'use strict';

// Llavero — proyecto 7 de los diez de Vespi: «mis datos», del lado de la persona.
//
// Este archivo es la carrocería; el núcleo ejecutable es el kernel de Vespi, que
// este proyecto consume sin modificar. El predicado de suficiencia, la pausa, la
// verificación separada y el recibo sellado son del núcleo. Lo que el núcleo no
// puede expresar y este proyecto agrega son el propósito, el alcance, la
// revocación y la traducción de la razón a la persona.
//
// El núcleo se carga desde la copia vendorizada que Lore Plugin instala en los
// hosts, no desde el árbol de desarrollo: esa copia está fijada al corte y sus
// bytes están declarados en su `SOURCE.md`, mientras el árbol de desarrollo avanza.
// `test/kernel.test.js` verifica esas huellas, así que si el corte se mueve, esta
// suite lo dice.

const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

const KERNEL = '../vendor/vespi-kernel';

const { sufficient } = require(`${KERNEL}/authority.js`);
const { createOperation, runOperation, pauseOperation, resumeOperation, STATES } = require(`${KERNEL}/operation.js`);
const { verifyReceipt } = require(`${KERNEL}/receipt.js`);

const REGISTRO = 'registro.jsonl';

// Lo que el verificador independiente tiene que recalcular desde el registro. Un
// verificador que no produce este conjunto no verificó nada: devolver un
// subconjunto, o añadir uno propio, es creerle al ejecutor en vez de mirar.
const CHECKS_INDEPENDIENTES = ['permiso-cubria', 'acceso-en-registro', 'ejecutado-una-vez', 'proposito-declarado'];

function entero(value) {
  if (typeof value === 'bigint') return value >= 0n ? value : null;
  if (typeof value === 'number') return Number.isSafeInteger(value) && value >= 0 ? BigInt(value) : null;
  return typeof value === 'string' && /^\d+$/.test(value) ? BigInt(value) : null;
}

function texto(value) {
  return typeof value === 'string' && value.length > 0;
}

function huella(value) {
  return createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex');
}

function iso(now) {
  if (now === undefined || now === null) return new Date().toISOString();
  const ms = Date.parse(now);
  return Number.isNaN(ms) ? new Date().toISOString() : new Date(ms).toISOString();
}

class Llavero {
  constructor({ dir } = {}) {
    this.dir = dir;
    this.ruta = path.join(dir, REGISTRO);
    fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(this.ruta)) fs.writeFileSync(this.ruta, '', 'utf8');
  }

  leer() {
    return fs.readFileSync(this.ruta, 'utf8').split('\n').filter((l) => l.trim().length > 0).map((l) => JSON.parse(l));
  }

  escribir(linea) {
    fs.appendFileSync(this.ruta, `${JSON.stringify(linea)}\n`, 'utf8');
    return linea;
  }

  lineas(tipo) {
    return this.leer().filter((l) => l.tipo === tipo);
  }

  // --- Quiénes están en la historia: la persona, los solicitantes, los datos ---
  registrarPersona({ id, nombre }) {
    if (!texto(id)) throw new Error('una persona necesita id');
    const previa = this.lineas('persona').find((p) => p.id === id);
    if (previa) return previa;
    return this.escribir({ tipo: 'persona', id, nombre: nombre || id, en: iso() });
  }

  registrarSolicitante({ id, nombre }) {
    if (!texto(id)) throw new Error('un solicitante necesita id');
    const previa = this.lineas('solicitante').find((p) => p.id === id);
    if (previa) return previa;
    return this.escribir({ tipo: 'solicitante', id, nombre: nombre || id, en: iso() });
  }

  registrarDato({ persona, id, nombre, valor }) {
    if (!texto(persona) || !texto(id)) throw new Error('un dato necesita a qué persona pertenece y un id');
    const previa = this.lineas('dato').find((d) => d.id === id);
    if (previa) return previa;
    return this.escribir({ tipo: 'dato', persona, id, nombre: nombre || id, valor: String(valor), en: iso() });
  }

  datos() { return this.lineas('dato'); }

  // Una llave cambia de estado (se revoca), así que el registro se lee como una
  // línea por llave: la última gana. El historial sigue completo en el archivo.
  llaves() {
    const porId = new Map();
    for (const k of this.lineas('llave')) porId.set(k.id, k);
    return [...porId.values()];
  }

  accesos() { return this.lineas('acceso'); }
  recibos() { return this.lineas('recibo'); }
  // Una petición cambia de estado (la contesta la persona), así que el registro
  // se lee como una línea por petición: la última gana. El historial queda.
  solicitudes() {
    const porId = new Map();
    for (const s of this.lineas('solicitud')) porId.set(s.id, s);
    return [...porId.values()];
  }

  consumoDe(id) {
    return this.accesos().filter((a) => a.llave === id).reduce((suma, a) => suma + entero(a.cuerpo.unidades), 0n);
  }

  // --- La puerta de la persona ---
  solicitar({ portador, proposito, alcance, destino, personas = 'persona-1', unidades = '1' }) {
    if (!texto(portador) || !texto(proposito) || !texto(alcance) || !texto(destino)) {
      throw new Error('una solicitud necesita quién pide, para qué, qué alcance y hacia dónde');
    }
    return this.escribir({
      tipo: 'solicitud',
      id: `sol-${this.lineas('solicitud').length + 1}`,
      portador,
      proposito,
      alcance,
      destino,
      personas,
      unidades,
      en: iso(),
      contestada: false,
    });
  }

  conceder(spec) {
    // Una llave nueva contesta una petición nueva. Si la persona ya contestó
    // esta petición y no llegó otra, no hay puerta que abrir.
    const delPortador = this.solicitudes().filter((s) => s.portador === spec.portador
      && s.proposito === spec.proposito && s.alcance === spec.alcance);
    if (delPortador.length > 0 && !delPortador.some((s) => !s.contestada)) {
      throw new Error('esa petición ya fue contestada: una llave nueva empieza por una petición nueva');
    }
    const llave = this.armarLlave(spec, { revocado: false });
    this.escribir(llave);
    for (const s of this.solicitudes()) {
      if (s.portador === llave.portador && s.alcance === llave.alcance && s.proposito === llave.proposito && !s.contestada) {
        this.escribir({ ...s, contestada: true, llave: llave.id });
      }
    }
    return llave;
  }
  // Transferir es delegar: la llave hija es un subconjunto de la madre, y el
  // nombre de la madre viaja en `hereda` porque la hija tiene id propio.
  transferir(spec) {
    const padre = this.llaves().find((k) => k.id === spec.hereda);
    if (!padre) throw new Error(`no hay llave ${String(spec.hereda)} de la que transferir`);
    if (padre.revocado) throw new Error('una llave revocada no se transfiere: hay que concederla otra vez');
    const hija = this.armarLlave({ ...padre, ...spec }, { revocado: false });
    for (const [que, campo, igual] of [
      ['propósito', 'proposito', (a, b) => a === b],
      ['alcance', 'alcance', (a, b) => a === b],
      ['destino', 'destino', (a, b) => a === b],
    ]) {
      if (!igual(hija[campo], padre[campo])) {
        throw new Error(`una transferencia que cambia el ${que} amplifica la llave: ${padre[campo]} → ${hija[campo]}`);
      }
    }
    const h = entero(hija.presupuesto);
    const p = entero(padre.presupuesto);
    if (h === null || p === null || h > p) {
      throw new Error(`una transferencia que agranda el presupuesto amplifica la llave: ${padre.presupuesto} → ${hija.presupuesto}`);
    }
    if (Date.parse(hija.vence) > Date.parse(padre.vence)) {
      throw new Error(`una transferencia que agranda el reloj amplifica la llave: ${padre.vence} → ${hija.vence}`);
    }
    hija.transferida_de = padre.id;
    this.escribir(hija);
    for (const s of this.solicitudes()) {
      if (s.portador === hija.portador && s.alcance === hija.alcance && s.proposito === hija.proposito && !s.contestada) {
        this.escribir({ ...s, contestada: true, llave: hija.id });
      }
    }
    return hija;
  }

  armarLlave(spec, estado) {
    for (const campo of ['id', 'portador', 'proposito', 'alcance', 'destino', 'presupuesto', 'vence']) {
      if (!texto(spec[campo])) throw new Error(`una llave necesita ${campo}: no hay llave sin él`);
    }
    if (entero(spec.presupuesto) === null) throw new Error('el presupuesto de la llave es un número entero de unidades');
    if (Number.isNaN(Date.parse(spec.vence))) throw new Error('el reloj de la llave no es una hora');
    if (this.llaves().some((k) => k.id === spec.id)) throw new Error(`ya existe la llave ${spec.id}`);
    return {
      tipo: 'llave',
      id: spec.id,
      portador: spec.portador,
      proposito: spec.proposito,
      alcance: spec.alcance,
      destino: spec.destino,
      presupuesto: spec.presupuesto,
      vence: iso(spec.vence),
      pauser: Array.isArray(spec.pauser) ? spec.pauser.filter((p) => texto(p)) : [],
      concedida_por: texto(spec.persona) ? spec.persona : 'la persona',
      concedida_en: iso(),
      revocada_por: null,
      revocada_en: null,
      motivo_revocacion: null,
      ...estado,
      transferida_de: texto(spec.hereda) ? spec.hereda : null,
    };
  }

  revocar({ persona, llave, motivo }) {
    const previa = this.llaves().find((k) => k.id === llave);
    if (!previa) throw new Error(`no hay llave ${String(llave)} que revocar`);
    if (previa.concedida_por !== persona) {
      throw new Error(`solo quien concedió la llave puede quitarla: ${previa.concedida_por} (y no ${String(persona)})`);
    }
    if (previa.revocado) throw new Error(`la llave ${llave} ya estaba revocada y no se reactiva sola`);
    this.escribir({
      tipo: 'llave',
      ...previa,
      revocado: true,
      revocada_por: persona,
      revocada_en: iso(),
      motivo_revocacion: texto(motivo) ? motivo : 'sin motivo declarado',
    });
    return this.escribir({ tipo: 'revocacion', llave, persona, motivo: texto(motivo) ? motivo : 'sin motivo declarado', en: iso() });
  }

  // La autoridad que el núcleo entiende, con el presupuesto que QUEDA.
  autoridadDe(llave, restante) {
    const libre = entero(restante === undefined ? String(entero(llave.presupuesto) - this.consumoDe(llave.id)) : restante);
    return {
      spend: [{
        asset: `dato:${llave.alcance}`,
        maxAmount: String(libre < 0n ? 0n : libre),
        to: `destino:${llave.destino}`,
        expiresAt: llave.vence,
      }],
      ...(llave.pauser.length > 0 ? { pausers: [...llave.pauser] } : {}),
    };
  }

  // La puerta: primero lo que el grant no puede decir —propósito, revocación— y
  // después el predicado del núcleo sobre destino, reloj y presupuesto.
  evaluar(pedido, now) {
    const delPortador = this.llaves().filter((k) => k.portador === pedido.portador);
    const candidatas = delPortador.filter((k) => !k.revocado);
    if (candidatas.length === 0) {
      // «Nunca lo tuvo» y «se lo quitaste» son respuestas distintas, y la
      // diferencia le importa a quien está mirando.
      const revocada = delPortador.find((k) => k.revocado);
      if (revocada) {
        return {
          ok: false,
          motivo: `la llave ${revocada.id} fue revocada por ${revocada.revocada_por} el ${String(revocada.revocada_en).slice(0, 10)} (${String(revocada.motivo_revocacion)}), y una revocación no se reactiva sola`,
          salida: `vuelve a ${String(revocada.concedida_por)}: si la persona vuelve a necesitarlo, se concede una llave nueva`,
          llave: revocada,
        };
      }
      return {
        ok: false,
        motivo: `no hay llave de ${pedido.portador} para ${pedido.alcance}: pedir no es tener`,
        salida: 'vuelve a la persona: concede una llave con propósito y alcance, o deja la petición anotada sin contestar',
      };
    }
    // Varias llaves pueden servir al mismo portador, y una revocada, vencida o
    // sin presupuesto no puede tapar a otra que sí cubre. La puerta pregunta
    // «¿alguna cubre?», no «¿la primera cubre?»: con la primera, una llave
    // revocada cerraba un acceso que otra llave vigente sostenía igual, y el
    // bloqueo mentía sobre el estado real.
    const queCubren = [];
    const queNo = [];
    for (const llave of candidatas) {
      if (llave.proposito !== pedido.proposito) {
        queNo.push({ llave, motivo: `la llave ${llave.id} se concedió para «${llave.proposito}» y este acceso pide «${pedido.proposito}»: un acceso con otro propósito no abre` });
        continue;
      }
      if (llave.alcance !== pedido.alcance) {
        queNo.push({ llave, motivo: `la llave ${llave.id} abre ${llave.alcance} y el acceso pide ${pedido.alcance}: el alcance es un dato, no «los datos»` });
        continue;
      }
      const restante = entero(llave.presupuesto) - this.consumoDe(llave.id);
      const check = sufficient(
        [{ asset: `dato:${pedido.alcance}`, amount: pedido.unidades, to: `destino:${pedido.destino}` }],
        this.autoridadDe(llave, restante),
        { now },
      );
      if (check.ok) queCubren.push({ llave, restante });
      else queNo.push({ llave, motivo: this.traducir(check.reason, llave, pedido, restante) });
    }
    if (queCubren.length > 0) {
      return { ok: true, llave: queCubren[0].llave, restante: String(queCubren[0].restante) };
    }
    const primera = queNo[0];
    const punto = /[.!?]$/.test(primera.motivo) ? '' : '.';
    const otras = queNo.length > 1 ? `${punto} Ninguna de las ${queNo.length} llaves vivas de ${pedido.portador} cubre este acceso.` : punto;
    return {
      ok: false,
      motivo: `${primera.motivo}${otras}`,
      salida: `vuelve a ${primera.llave.concedida_por}: concede una llave que cubra, o deja la petición anotada sin contestar`,
      llave: primera.llave,
    };
  }

  traducir(motivo, llave, pedido, restante) {
    if (/expired/.test(motivo)) {
      const cuando = (motivo.match(/expired at (\S+)/) || [])[1] || llave.vence;
      return `la llave ${llave.id} venció el ${cuando} y una llave que murió con su reloj no vuelve sola`;
    }
    if (/no grant for asset .* to /.test(motivo)) {
      return `la llave ${llave.id} sirve en ${llave.destino} y el acceso pide ${pedido.destino}: una llave no viaja`;
    }
    if (/consume/.test(motivo)) {
      return `el presupuesto de la llave ${llave.id} es de ${llave.presupuesto} unidades y ya gastó ${this.consumoDe(llave.id)}; el acceso pide ${pedido.unidades} y solo quedan ${String(restante)}`;
    }
    return motivo;
  }

  abrir(pedido, opciones = {}) {
    const puerta = this.evaluar(pedido, opciones.now);
    const op = createOperation({
      goal: `${pedido.portador} lee ${pedido.alcance} para «${pedido.proposito}» hacia ${pedido.destino}`,
      action: `llavero:acceso`,
      agent: pedido.portador,
      exit: puerta.ok ? null : puerta.salida,
      authority: puerta.ok ? this.autoridadDe(puerta.llave, puerta.restante) : { spend: [] },
    });
    op.pedido = { ...pedido };
    op.puerta = puerta;
    return this.guardar(op);
  }

  guardar(op) {
    const previa = this.retomar(op.id);
    if (previa) return previa;
    this.escribir({ tipo: 'operacion', id: op.id, estado: op.state, operacion: op });
    return op;
  }

  retomar(id) {
    const linea = this.lineas('operacion').find((l) => l.id === id);
    return linea ? linea.operacion : null;
  }

  pausar(op, quien) {
    return pauseOperation(op, quien);
  }

  reanudar(op, quien) {
    return resumeOperation(op, quien);
  }

  capacidad(pedido, puerta) {
    const self = this;
    return {
      id: 'llavero:acceso',
      required: () => {
        if (!puerta.ok) return { impossible: true, reason: puerta.motivo, exit: puerta.salida };
        return { spend: [{ asset: `dato:${pedido.alcance}`, amount: pedido.unidades, to: `destino:${pedido.destino}` }] };
      },
      perform: async () => {
        const dato = self.datos().find((d) => d.id === pedido.alcance);
        const cuerpo = {
          clave: pedido.clave,
          portador: pedido.portador,
          proposito: pedido.proposito,
          alcance: pedido.alcance,
          destino: pedido.destino,
          unidades: pedido.unidades,
          dato_entregado: dato ? dato.valor : null,
          por: puerta.llave.id,
          en: iso(),
        };
        const linea = { tipo: 'acceso', clave: pedido.clave, llave: puerta.llave.id, cuerpo, huella: huella(cuerpo) };
        self.escribir(linea);
        return {
          ok: true,
          evidence: { operationId: pedido.clave, type: 'acceso', status: 'leido', amount: pedido.unidades, code: linea.huella },
        };
      },
      io: { verify: (evidencia) => this.verificar(evidencia) },
    };
  }

  async verificar(evidencia) {
    const clave = evidencia && evidencia.operationId;
    const accesos = this.accesos().filter((a) => a.clave === clave);
    const uno = accesos[0];
    const llave = uno ? this.llaves().find((k) => k.id === uno.llave) : null;
    const checks = {
      'permiso-cubria': Boolean(llave) && !llave.revocado,
      'acceso-en-registro': accesos.length === 1 && accesos[0].huella === huella(accesos[0].cuerpo),
      'ejecutado-una-vez': accesos.length === 1,
      'proposito-declarado': Boolean(llave) && uno.cuerpo.proposito === llave.proposito,
    };
    const verified = Object.values(checks).every((v) => v === true);
    return { verified, checks, reason: verified ? 'recomputado desde el registro' : 'el registro no respalda el acceso' };
  }

  async correr(op, pedido, opciones = {}) {
    if (op.state === STATES.PAUSED) {
      return { estado: 'pausado', detalle: 'el acceso está pausado por quien tiene la llave para pausarlo', salida: 'reanuda o cancela', recibo: null };
    }
    const previo = this.recibos().find((r) => r.clave === pedido.clave);
    if (previo) {
      return { estado: 'repetido', detalle: `el acceso ${pedido.clave} ya ocurrió; no se repite`, salida: 'nada que hacer', recibo: previo.recibo };
    }
    const cap = this.capacidad(pedido, op.puerta);
    if (opciones.verificador) cap.io.verify = this.verificadorDe(opciones.verificador);
    const io = { verify: cap.io.verify, ask: async () => ({ approved: false, by: 'nadie' }) };
    if (opciones.now !== undefined && opciones.now !== null) {
      const fijo = opciones.now;
      io.now = typeof fijo === 'function' ? fijo : () => fijo;
    }
    const resultado = await runOperation(op, cap, io);
    const recibo = resultado.receipt;
    if (recibo && recibo.status === 'verified') this.escribir({ tipo: 'recibo', clave: pedido.clave, recibo });
    return { ...this.traducirResultado(resultado, op), recibo };
  }

  async acceder(pedido, opciones = {}) {
    const op = opciones.operacion ? this.retomar(opciones.operacion) : this.abrir(pedido, opciones);
    if (!op) throw new Error(`no hay operación abierta con id ${String(opciones.operacion)}`);
    if (opciones.pausar) pauseOperation(op, opciones.pausar);
    if (opciones.reanudar) resumeOperation(op, opciones.reanudar);
    return this.correr(op, op.pedido || pedido, opciones);
  }

  verificadorDe(verificador) {
    if (verificador && typeof verificador.verificar === 'function') return (evidencia) => verificador.verificar(evidencia);
    if (typeof verificador === 'function') return verificador;
    return (evidencia) => this.verificar(evidencia);
  }

  traducirResultado(resultado, op) {
    if (resultado.status === 'verified') {
      return { estado: 'verificado', detalle: 'el acceso ocurrió dentro de la llave y el verificador lo recomputó desde el registro', salida: null };
    }
    if (resultado.status === 'paused') return { estado: 'pausado', detalle: 'pausado', salida: 'reanuda o cancela' };
    const recibo = resultado.receipt;
    return {
      estado: 'bloqueado',
      detalle: (recibo && (recibo.detail || recibo.reason)) || 'no se pudo abrir',
      salida: (op && op.exit) || (recibo && recibo.exit) || 'vuelve a la persona',
    };
  }

  // --- La auditoría: tercera parte, lee el registro y el recibo y no cree a nadie ---
  auditar(recibo) {
    const sello = verifyReceipt(recibo);
    if (!sello.ok) return { ok: false, motivo: `el recibo no verifica: ${sello.reason}` };
    const clave = recibo.evidence && recibo.evidence.operationId;
    const accesos = this.accesos().filter((a) => a.clave === clave);
    if (accesos.length === 0) return { ok: false, motivo: 'el recibo dice que hubo un acceso y el registro no lo tiene' };
    if (accesos.length > 1) return { ok: false, motivo: `el acceso ${clave} aparece ${accesos.length} veces en el registro` };
    if (accesos[0].huella !== huella(accesos[0].cuerpo)) {
      return { ok: false, motivo: 'el acceso fue editado después de escrito: su huella ya no calza' };
    }
    const cubiertos = (recibo.coverage || []).filter((c) => CHECKS_INDEPENDIENTES.includes(c));
    const faltan = CHECKS_INDEPENDIENTES.filter((c) => !cubiertos.includes(c));
    if (faltan.length > 0) {
      return {
        ok: false,
        motivo: `el verificador creyó al ejecutor: no recomputó ${faltan.join(', ')} desde el registro, y una verificación independiente no puede dar por bueno lo que no midió`,
        checks: cubiertos,
      };
    }
    return { ok: true, motivo: 'el registro, la llave y el recibo dicen lo mismo', checks: cubiertos };
  }

  // Lo que la persona pregunta primero: ¿quién tiene mis datos y para qué?
  quienTiene() {
    return this.llaves().map((k) => ({
      portador: k.portador,
      proposito: k.proposito,
      alcance: k.alcance,
      destino: k.destino,
      revocada: k.revocado === true,
      vence: k.vence,
    }));
  }
}

module.exports = { Llavero, CHECKS_INDEPENDIENTES };
