'use strict';

// El corte del núcleo, verificado por bytes.
//
// Llavero consume la copia del kernel que Lore Plugin instala en los tres hosts.
// Esa copia tiene un encabezado de procedencia de tres líneas y, debajo, los bytes
// exactos del commit fijado. Estos cinco digest son los que ese `SOURCE.md`
// declara; si el corte se mueve, esta prueba falla en vez de dejar que el proyecto
// siga corriendo contra un núcleo que nadie revisó.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

const KERNEL = path.join(__dirname, '..', 'vendor', 'vespi-kernel');

const ESPERADOS = {
  'authority.js': 'fcf7952489d6f9c42616b52f54832524926d2f2ba6c0ea6514480a7bdc7a265e',
  'continuity.js': 'abbee9cab8c92b2c4680dba2d573bf8eb6a50ab63194e4a0b0b525af5f044e6c',
  'delegation.js': '357d8b9398ac2b2c3508565e6c2293cc6abff3801f09a60f985dc1c781e002a3',
  'operation.js': '9a95815fc10435cb55415da1531e1545168eaf209518630b83f24b10f0e78d48',
  'receipt.js': 'd006eff3538b2c701366ba09d1e41a32d267b2bad44177f0095541ce9b2a644d',
};

test('el núcleo que consume Llavero es el corte fijado, módulo por módulo', () => {
  for (const [archivo, esperado] of Object.entries(ESPERADOS)) {
    const crudo = fs.readFileSync(path.join(KERNEL, archivo));
    const cuerpo = crudo.slice(crudo.indexOf(10, crudo.indexOf(10, crudo.indexOf(10) + 1) + 1) + 1);
    const real = createHash('sha256').update(cuerpo).digest('hex');
    assert.equal(real, esperado, `${archivo}: el núcleo se movió; repínalo a mano y vuelve a correr la suite`);
  }
});

test('el encabezado de los cinco módulos declara el mismo commit', () => {
  const commits = new Set();
  for (const archivo of Object.keys(ESPERADOS)) {
    const lineas = fs.readFileSync(path.join(KERNEL, archivo), 'utf8').split('\n').slice(0, 3).join(' ');
    const encontrado = lineas.match(/commit ([0-9a-f]{7,40})/);
    assert.ok(encontrado, `${archivo}: el encabezado no declara un commit`);
    commits.add(encontrado[1].slice(0, 7));
  }
  assert.equal(commits.size, 1, `los cinco módulos no apuntan al mismo commit: ${[...commits].join(', ')}`);
});
