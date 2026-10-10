'use strict';

// El recorrido de Llavero: la persona ve quién pide, concede, un acceso ocurre,
// lo revoca, el acceso se cierra y el registro queda legible. Cada línea sale de
// una ejecución real. Los datos son de ejemplo y esto no cumple ninguna norma.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Llavero } = require('./llavero.js');
const { verifyReceipt } = require('../vendor/vespi-kernel/receipt.js');

const T0 = '2026-09-29T12:00:00.000Z';
const T1 = '2026-09-29T13:00:00.000Z';
const T2 = '2026-10-05T09:00:00.000Z';

function linea(t = '') { process.stdout.write(`${t}\n`); }
function titulo(t) { linea(`\n── ${t}`); }

async function main() {
  const dir = process.argv[2] || fs.mkdtempSync(path.join(os.tmpdir(), 'llavero-recorrido-'));
  const l = new Llavero({ dir });
  linea(`Llavero — recorrido completo. Registro en: ${path.join(dir, 'registro.jsonl')}`);
  linea('Persona, organizaciones y datos son de EJEMPLO. Sin red, sin blockchain, sin pagos, sin un tercero.');

  titulo('1. La persona y sus datos');
  l.registrarPersona({ id: 'persona-1', nombre: 'Persona de ejemplo' });
  l.registrarDato({ persona: 'persona-1', id: 'dato-1', nombre: 'domicilio declarado', valor: 'Calle Ejemplo 123' });
  l.registrarDato({ persona: 'persona-1', id: 'dato-2', nombre: 'fecha de nacimiento', valor: '1990-01-01' });
  linea('  persona-1 tiene 2 datos anotados. Los valores son de ejemplo.');

  titulo('2. Dos organizaciones piden acceso, con propósito declarado');
  l.solicitar({ portador: 'org-a', proposito: 'cobrar el arriendo', alcance: 'dato-1', destino: 'sistema:cobranza' });
  l.solicitar({ portador: 'org-b', proposito: 'verificar identidad', alcance: 'dato-2', destino: 'sistema:kyc' });
  for (const s of l.solicitudes()) linea(`  ${s.portador} pide ${s.alcance} para «${s.proposito}» hacia ${s.destino}`);

  titulo('3. La persona concede una llave y deja la otra sin contestar');
  l.conceder({
    persona: 'ana',
    id: 'llave-1',
    portador: 'org-a',
    proposito: 'cobrar el arriendo',
    alcance: 'dato-1',
    destino: 'sistema:cobranza',
    presupuesto: '3',
    vence: '2026-10-01T00:00:00.000Z',
    pauser: ['ana'],
  });
  linea(`  org-b sigue SIN llave: ${l.solicitudes().filter((s) => !s.contestada).map((s) => s.portador).join(', ')}`);

  const pedido = { portador: 'org-a', proposito: 'cobrar el arriendo', alcance: 'dato-1', destino: 'sistema:cobranza', unidades: '1', clave: 'acc-1' };

  titulo('4. El acceso ocurre dentro de la llave');
  const uno = await l.acceder(pedido, { now: T0 });
  linea(`  estado:  ${uno.estado}`);
  linea(`  detalle: ${uno.detalle}`);
  linea(`  recibo:  ${uno.recibo.status} · sello ${uno.recibo.digest.slice(0, 16)}…`);
  linea(`  anclaje: ${uno.recibo.anchor.status} en ${uno.recibo.anchor.network} — nada llegó a una red; esto NO está verificado afuera`);

  titulo('5. org-a intenta usarlo para otra cosa: no abre');
  const otroProposito = await l.acceder({ ...pedido, proposito: 'vigilar dónde vive', clave: 'acc-2' }, { now: T0 });
  linea(`  estado:  ${otroProposito.estado}`);
  linea(`  detalle: ${otroProposito.detalle}`);

  titulo('6. org-a pide un dato que la llave no abre: no abre');
  const otroAlcance = await l.acceder({ ...pedido, alcance: 'dato-2', clave: 'acc-3' }, { now: T0 });
  linea(`  estado:  ${otroAlcance.estado}`);
  linea(`  detalle: ${otroAlcance.detalle}`);

  titulo('7. org-a intenta en otro sistema: no abre');
  const otroDestino = await l.acceder({ ...pedido, destino: 'sistema:otro', clave: 'acc-4' }, { now: T0 });
  linea(`  estado:  ${otroDestino.estado}`);
  linea(`  detalle: ${otroDestino.detalle}`);

  titulo('8. Y cuando se acaba el presupuesto, tampoco');
  await l.acceder({ ...pedido, clave: 'acc-5' }, { now: T1 });
  await l.acceder({ ...pedido, clave: 'acc-6' }, { now: T1 });
  const sinPresupuesto = await l.acceder({ ...pedido, clave: 'acc-7' }, { now: T1 });
  linea(`  estado:  ${sinPresupuesto.estado}`);
  linea(`  detalle: ${sinPresupuesto.detalle}`);

  titulo('9. Pasó la fecha del reloj: la llave tampoco revive sola');
  // Una llave nueva empieza por una petición nueva: la persona no renueva en
  // silencio, y el registro muestra que hubo una segunda petición.
  l.solicitar({ portador: 'org-a', proposito: 'cobrar el arriendo', alcance: 'dato-1', destino: 'sistema:cobranza' });
  linea('  org-a vuelve a pedir (petición nueva, no una renovación automática)');
  l.conceder({
    persona: 'ana',
    id: 'llave-3',
    portador: 'org-a',
    proposito: 'cobrar el arriendo',
    alcance: 'dato-1',
    destino: 'sistema:cobranza',
    presupuesto: '3',
    vence: '2026-09-30T00:00:00.000Z',
    pauser: ['ana'],
  });
  const vencida = await l.acceder({ ...pedido, clave: 'acc-9' }, { now: T2 });
  linea(`  estado:  ${vencida.estado}`);
  linea(`  detalle: ${vencida.detalle}`);

  titulo('10. La persona revoca la llave-1');
  l.revocar({ persona: 'ana', llave: 'llave-1', motivo: 'ya no lo necesito' });
  linea('  llave-1 revocada por ana. La llave-3 sigue vigente: son dos llaves y revocar una no es revocar la otra.');
  const conLaRevocada = await l.acceder({ portador: 'org-a', proposito: 'cobrar el arriendo', alcance: 'dato-1', destino: 'sistema:cobranza', unidades: '1', clave: 'acc-8' }, { now: T1 });
  linea(`  org-a intenta con la revocada → ${conLaRevocada.estado} (entra por la llave-3, que sigue viva)`);
  const revocada = l.llaves().find((k) => k.id === 'llave-1');
  linea(`  estado de llave-1: revocada=${Boolean(revocada.revocado)} por ${revocada.revocada_por} — «${revocada.motivo_revocacion}»`);
  const soloRevocada = await l.acceder({ portador: 'org-a', proposito: 'cobrar el arriendo', alcance: 'dato-1', destino: 'sistema:cobranza', unidades: '9', clave: 'acc-12' }, { now: T2 });
  linea(`  y cuando ninguna llave alcanza (todo venció) → ${soloRevocada.estado}: ${soloRevocada.detalle}`);

  titulo('11. Lo que la persona puede leer sin Llavero');
  for (const k of l.quienTiene()) {
    linea(`  ${k.portador}  ${k.alcance}  «${k.proposito}»  ${k.destino}  hasta ${k.vence}  ${k.revocada ? 'REVOCADA' : 'sin revocar'}`);
  }
  linea('  — y el registro completo está en: registro.jsonl (un JSONL, se abre con cualquier editor)');

  titulo('12. La tercera parte audita sin creer a nadie');
  for (const r of l.recibos()) {
    const sello = verifyReceipt(r.recibo);
    const a = l.auditar(r.recibo);
    linea(`  ${r.clave}: sello ${sello.ok ? 'verifica' : 'NO verifica'} · auditoría ${a.ok ? 'pasa' : 'NO pasa'}`);
  }
  const creyente = { id: 'verificador-creyente', verificar: async () => ({ verified: true, checks: { me_lo_creo: true }, reason: 'me lo creo' }) };
  const conCreyente = await l.acceder({ portador: 'org-b', proposito: 'verificar identidad', alcance: 'dato-2', destino: 'sistema:kyc', unidades: '1', clave: 'acc-10' }, { now: T1, verificador: creyente });
  linea('  (org-b no tiene llave, así que este intento se va por la puerta correcta)');
  l.conceder({ persona: 'ana', id: 'llave-2', portador: 'org-b', proposito: 'verificar identidad', alcance: 'dato-2', destino: 'sistema:kyc', presupuesto: '2', vence: '2026-11-01T00:00:00.000Z', pauser: ['ana'] });
  const conLlave = await l.acceder({ portador: 'org-b', proposito: 'verificar identidad', alcance: 'dato-2', destino: 'sistema:kyc', unidades: '1', clave: 'acc-11' }, { now: T1, verificador: creyente });
  const aCreyente = l.auditar(conLlave.recibo);
  linea(`  acc-11 con un verificador que solo cree al ejecutor:`);
  linea(`      el acceso dice ${conLlave.estado}; la auditoría dice ${aCreyente.ok ? 'pasa' : 'NO pasa'} — ${aCreyente.motivo}`);

  titulo('13. Lo que este recorrido NO demuestra');
  linea('  - No cumple la Ley 21.719 ni ninguna otra norma: la norma primaria no se leyó aquí.');
  linea('  - No hay hash en testnet ni recibo en explorador: el anclaje quedó en `pending` a propósito.');
  linea('  - No hay custodia de datos reales, ni integración institucional, ni permiso de nadie.');
  linea('  - La persona, las organizaciones y los datos son de ejemplo.');
  linea('');
  return dir;
}

if (require.main === module) {
  main().then((dir) => { process.stdout.write(`registro: ${path.join(dir, 'registro.jsonl')}\n`); });
}

module.exports = { main };
