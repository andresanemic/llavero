'use strict';

// La interfaz de Llavero: la persona pregunta, concede, revoca y lee su registro
// sin saber nada del kernel.

const fs = require('node:fs');
const path = require('node:path');
const { Llavero } = require('./llavero.js');
const { verifyReceipt } = require('../vendor/vespi-kernel/receipt.js');

const AYUDA = `llavero — mis datos, del lado de la persona

  llavero <comando> [--clave valor ...] [--registro <carpeta>]

  persona     --id --nombre
  dato       --persona --id --nombre --valor
  solicitar   --portador --proposito --alcance --destino
  pendientes
  conceder   --id --portador --proposito --alcance --destino --presupuesto --vence --persona [--pauser a,b]
  transferir --hereda --id --portador [--presupuesto]
  revocar    --llave --persona [--motivo]
  llaves
  acceder    --portador --proposito --alcance --destino --unidades --clave [--pausar quien]
  accesos
  registro
  auditar    --clave

Datos de ejemplo. Sin red, sin blockchain, sin pagos y sin un tercero.
No afirma cumplir la Ley 21.719 ni ninguna otra norma.`;

function flags(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) out[key] = true;
    else { out[key] = next; i += 1; }
  }
  return out;
}

function linea(t = '') { process.stdout.write(`${t}\n`); }

function mostrar(r) {
  if (!r) return;
  linea(`  estado:   ${r.estado}`);
  if (r.detalle) linea(`  detalle:  ${r.detalle}`);
  if (r.salida) linea(`  salida:   ${r.salida}`);
  if (r.recibo) {
    linea(`  recibo:   ${r.recibo.status} · sello ${String(r.recibo.digest).slice(0, 16)}…`);
    linea(`  anclaje:  ${r.recibo.anchor.status} en ${r.recibo.anchor.network} — nada llegó a la red; esto NO se verificó afuera`);
  }
}

async function main(argv) {
  const [comando, ...resto] = argv;
  const f_ = flags(resto);
  const dir = f_.registro || path.join(__dirname, '..', 'datos');
  const l = new Llavero({ dir });

  if (!comando || f_.ayuda) { linea(AYUDA); return 0; }

  if (comando === 'persona') {
    const p = l.registrarPersona({ id: f_.id, nombre: f_.nombre });
    linea(`persona anotada: ${p.id}`);
    return 0;
  }
  if (comando === 'dato') {
    const d = l.registrarDato({ persona: f_.persona, id: f_.id, nombre: f_.nombre, valor: f_.valor });
    linea(`dato anotado: ${d.id} (${d.nombre}) de ${d.persona} — valor de ejemplo`);
    return 0;
  }
  if (comando === 'solicitar') {
    const s = l.solicitar({ portador: f_.portador, proposito: f_.proposito, alcance: f_.alcance, destino: f_.destino });
    linea(`petición de ${s.portador}: «${s.proposito}», pide ${s.alcance} hacia ${s.destino}. Queda a la vista de la persona.`);
    return 0;
  }
  if (comando === 'pendientes') {
    for (const s of l.solicitudes().filter((x) => !x.contestada)) {
      linea(`${s.portador} pide ${s.alcance} para «${s.proposito}» hacia ${s.destino} — sin llave todavía`);
    }
    return 0;
  }
  if (comando === 'conceder') {
    const k = l.conceder({
      persona: f_.persona,
      id: f_.id,
      portador: f_.portador,
      proposito: f_.proposito,
      alcance: f_.alcance,
      destino: f_.destino,
      presupuesto: f_.presupuesto,
      vence: f_.vence,
      pauser: typeof f_.pauser === 'string' ? f_.pauser.split(',') : [],
    });
    linea(`llave ${k.id} para ${k.portador}: ${k.alcance}, para «${k.proposito}», ${k.presupuesto} unidades, hasta ${k.vence}, solo en ${k.destino}`);
    return 0;
  }
  if (comando === 'transferir') {
    const madre = l.llaves().find((k) => k.id === f_.hereda);
    const k = l.transferir({ ...madre, hereda: f_.hereda, id: f_.id, portador: f_.portador, presupuesto: f_.presupuesto || madre.presupuesto });
    linea(`llave ${k.id} transferida a ${k.portador} desde ${k.transferida_de}: mismo propósito, mismo alcance, ${k.presupuesto} de ${madre.presupuesto} unidades`);
    return 0;
  }
  if (comando === 'revocar') {
    l.revocar({ persona: f_.persona, llave: f_.llave, motivo: f_.motivo });
    linea(`llave ${f_.llave} revocada por ${f_.persona}. Desde ahora cualquier acceso con ella se bloquea.`);
    return 0;
  }
  if (comando === 'llaves') {
    for (const k of l.quienTiene()) {
      linea(`${k.portador}  ${k.alcance}  «${k.proposito}»  ${k.destino}  hasta ${k.vence}  ${k.revocada ? 'REVOCADA' : 'sin revocar'}`);
    }
    return 0;
  }
  if (comando === 'acceder') {
    const r = await l.acceder({
      portador: f_.portador,
      proposito: f_.proposito,
      alcance: f_.alcance,
      destino: f_.destino,
      unidades: f_.unidades,
      clave: f_.clave,
    }, { now: f_.ahora, pausar: f_.pausar, verificador: f_.verificador });
    linea(`acceso «${f_.clave}»: ${f_.portador} lee ${f_.alcance} para «${f_.proposito}»`);
    mostrar(r);
    return r.estado === 'verificado' || r.estado === 'repetido' ? 0 : 1;
  }
  if (comando === 'accesos') {
    for (const a of l.accesos()) {
      linea(`${a.clave}  ${a.cuerpo.portador} leyó ${a.cuerpo.alcance} para «${a.cuerpo.proposito}» con ${a.llave}  (${a.cuerpo.en})`);
    }
    return 0;
  }
  if (comando === 'registro') {
    linea(fs.readFileSync(path.join(dir, 'registro.jsonl'), 'utf8').trim());
    return 0;
  }
  if (comando === 'auditar') {
    const r = l.recibos().find((x) => x.clave === f_.clave);
    if (!r) { linea(`no hay recibo para la clave ${String(f_.clave)}`); return 1; }
    linea(`sello del recibo: ${verifyReceipt(r.recibo).ok ? 'verifica' : 'NO verifica'}`);
    const a = l.auditar(r.recibo);
    linea(`auditoría independiente: ${a.ok ? 'pasa' : 'NO pasa'} — ${a.motivo}`);
    return a.ok ? 0 : 1;
  }

  linea(`comando desconocido: ${comando}`);
  linea(AYUDA);
  return 2;
}

module.exports = { main, AYUDA };

if (require.main === module) {
  main(process.argv.slice(2)).then((code) => { process.exitCode = code; });
}
