'use strict';

// RED de Llavero. Escrito ANTES del código, el 2026-09-29.
//
// Los nueve casos: llave ausente, expirado, destino distinto, presupuesto
// excedido, subdelegación amplificada, revocación, repetición de efecto, recibo
// alterado y verificador que solo cree al ejecutor. Más el que le es propio:
// un acceso cuyo propósito no es el declarado, y un registro que la persona
// puede leer sin Llavero.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { Llavero } = require('../src/llavero.js');
const { verifyReceipt } = require('../vendor/vespi-kernel/receipt.js');

const T0 = '2026-09-29T12:00:00.000Z';
const T1 = '2026-09-29T13:00:00.000Z';
const T2 = '2026-10-05T09:00:00.000Z';

function temporal() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'llavero-'));
}

function llavero(dir) {
  const l = new Llavero({ dir });
  l.registrarPersona({ id: 'persona-1', nombre: 'Persona de ejemplo' });
  l.registrarSolicitante({ id: 'org-a', nombre: 'Organización A (ejemplo)' });
  l.registrarSolicitante({ id: 'org-b', nombre: 'Organización B (ejemplo)' });
  l.registrarDato({ persona: 'persona-1', id: 'dato-1', nombre: 'domicilio declarado', valor: 'Calle Ejemplo 123' });
  l.registrarDato({ persona: 'persona-1', id: 'dato-2', nombre: 'fecha de nacimiento', valor: '1990-01-01' });
  return l;
}

const LLAVE = {
  persona: 'ana',
  id: 'llave-1',
  portador: 'org-a',
  proposito: 'cobrar el arriendo',
  alcance: 'dato-1',
  destino: 'sistema:cobranza',
  presupuesto: '5',
  vence: '2026-10-01T00:00:00.000Z',
  pauser: ['ana'],
};

const PEDIDO = {
  portador: 'org-a',
  proposito: 'cobrar el arriendo',
  alcance: 'dato-1',
  destino: 'sistema:cobranza',
  unidades: '1',
  clave: 'acc-1',
};

test('pedir no es tener: sin llave, el acceso se bloquea y vuelve a la persona', async () => {
  const l = llavero(temporal());
  const r = await l.acceder(PEDIDO, { now: T0 });
  assert.equal(r.estado, 'bloqueado');
  assert.match(r.detalle, /no hay llave/);
  assert.match(r.salida, /ana|la persona/);
  assert.equal(r.recibo.status, 'blocked');
});

test('la llave vencida no abre y el bloqueo dice cuándo murió', async () => {
  const l = llavero(temporal());
  l.conceder(LLAVE);
  const r = await l.acceder({ ...PEDIDO, clave: 'acc-2' }, { now: T2 });
  assert.equal(r.estado, 'bloqueado');
  assert.match(r.detalle, /2026-10-01/);
});

test('la llave no viaja a otro destino y el bloqueo nombra los dos', async () => {
  const l = llavero(temporal());
  l.conceder(LLAVE);
  const r = await l.acceder({ ...PEDIDO, destino: 'sistema:otro', clave: 'acc-3' }, { now: T0 });
  assert.equal(r.estado, 'bloqueado');
  assert.match(r.detalle, /sistema:cobranza/);
  assert.match(r.detalle, /sistema:otro/);
});

test('el alcance es un dato, no «los datos»', async () => {
  const l = llavero(temporal());
  l.conceder(LLAVE);
  const r = await l.acceder({ ...PEDIDO, alcance: 'dato-2', clave: 'acc-4' }, { now: T0 });
  assert.equal(r.estado, 'bloqueado');
  assert.match(r.detalle, /dato-1/);
  assert.match(r.detalle, /dato-2/);
});

test('el presupuesto es un límite duro y se acumula entre accesos', async () => {
  const l = llavero(temporal());
  l.conceder({ ...LLAVE, presupuesto: '3' });
  const uno = await l.acceder(PEDIDO, { now: T0 });
  assert.equal(uno.estado, 'verificado');
  const dos = await l.acceder({ ...PEDIDO, unidades: '2', clave: 'acc-5' }, { now: T1 });
  assert.equal(dos.estado, 'verificado');
  const tres = await l.acceder({ ...PEDIDO, unidades: '1', clave: 'acc-6' }, { now: T1 });
  assert.equal(tres.estado, 'bloqueado');
  assert.match(tres.detalle, /presupuesto/);
});

test('un acceso con otro propósito no abre: la llave dice para qué', async () => {
  const l = llavero(temporal());
  l.conceder(LLAVE);
  const r = await l.acceder({ ...PEDIDO, proposito: 'vigilar dónde vive', clave: 'acc-7' }, { now: T0 });
  assert.equal(r.estado, 'bloqueado');
  assert.match(r.detalle, /cobrar el arriendo/);
  assert.match(r.detalle, /vigilar/);
});

test('la revocación cierra la puerta desde ese momento y no se reactiva sola', async () => {
  const l = llavero(temporal());
  l.conceder(LLAVE);
  const antes = await l.acceder(PEDIDO, { now: T0 });
  assert.equal(antes.estado, 'verificado');
  l.revocar({ persona: 'ana', llave: 'llave-1', motivo: 'ya no lo necesito' });
  const despues = await l.acceder({ ...PEDIDO, clave: 'acc-8' }, { now: T1 });
  assert.equal(despues.estado, 'bloqueado');
  assert.match(despues.detalle, /revocad/);
  const revocado = l.llaves().find((k) => k.id === 'llave-1');
  assert.equal(revocado.revocado, true);
  assert.equal(revocado.revocada_por, 'ana');
});

test('un portador no puede pasar más de lo que su llave le da', async () => {
  const l = llavero(temporal());
  l.conceder(LLAVE);
  const madre = () => ({ ...l.llaves().find((k) => k.id === 'llave-1'), hereda: 'llave-1' });
  const caso = (parche, etiqueta) => {
    assert.throws(
      () => l.transferir({ ...madre(), id: 'llave-2', portador: 'org-b', ...parche }),
      (err) => {
        assert.match(err.message, /no cabe|amplifica/i, etiqueta);
        return true;
      },
      etiqueta,
    );
  };
  caso({ proposito: 'otra cosa' }, 'propósito');
  caso({ alcance: 'dato-2' }, 'alcance');
  caso({ destino: 'sistema:otro' }, 'destino');
  caso({ presupuesto: '9' }, 'presupuesto');
  caso({ vence: '2026-12-01T00:00:00.000Z' }, 'reloj');
  const ok = l.transferir({ ...madre(), id: 'llave-2', portador: 'org-b' });
  assert.equal(ok.id, 'llave-2');
  assert.equal(ok.portador, 'org-b');
  assert.equal(ok.transferida_de, 'llave-1');
});

test('el mismo acceso no se ejecuta dos veces: el segundo devuelve el recibo del primero', async () => {
  const l = llavero(temporal());
  l.conceder(LLAVE);
  const uno = await l.acceder(PEDIDO, { now: T0 });
  const dos = await l.acceder(PEDIDO, { now: T1 });
  assert.equal(uno.estado, 'verificado');
  assert.equal(dos.estado, 'repetido');
  assert.equal(dos.recibo.digest, uno.recibo.digest);
  assert.equal(l.accesos().length, 1);
});

test('un recibo editado a mano no verifica', async () => {
  const l = llavero(temporal());
  l.conceder(LLAVE);
  const r = await l.acceder(PEDIDO, { now: T0 });
  assert.equal(verifyReceipt(r.recibo).ok, true);
  const veredicto = verifyReceipt({ ...r.recibo, detail: 'todo bien' });
  assert.equal(veredicto.ok, false);
  assert.equal(veredicto.reason, 'digest mismatch');
});

test('un verificador que solo cree al ejecutor no puede producir un verde en la auditoría', async () => {
  const l = llavero(temporal());
  l.conceder(LLAVE);
  const r = await l.acceder(PEDIDO, { now: T0 });
  assert.equal(r.estado, 'verificado');
  const creyente = { id: 'verificador-creyente', verificar: async () => ({ verified: true, checks: { me_lo_creo: true }, reason: 'me lo creo' }) };
  const conCreyente = await l.acceder({ ...PEDIDO, clave: 'acc-9' }, { now: T1, verificador: creyente });
  assert.equal(conCreyente.estado, 'verificado', 'el kernel acepta lo que le digan');
  const auditoria = l.auditar(conCreyente.recibo);
  assert.equal(auditoria.ok, false);
  assert.match(auditoria.motivo, /creyó al ejecutor/);
});

test('el registro es un archivo que la persona puede abrir sin Llavero', async () => {
  const dir = temporal();
  const l = llavero(dir);
  l.solicitar({ portador: 'org-a', proposito: 'cobrar el arriendo', alcance: 'dato-1', destino: 'sistema:cobranza' });
  l.conceder(LLAVE);
  await l.acceder(PEDIDO, { now: T0 });
  l.revocar({ persona: 'ana', llave: 'llave-1', motivo: 'ya no' });
  const crudo = fs.readFileSync(path.join(dir, 'registro.jsonl'), 'utf8').trim().split('\n').map((x) => JSON.parse(x));
  assert.ok(crudo.some((x) => x.tipo === 'solicitud'));
  assert.ok(crudo.some((x) => x.tipo === 'acceso'));
  assert.ok(crudo.some((x) => x.tipo === 'revocacion'));
});
