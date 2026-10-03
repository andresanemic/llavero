# Evidence

## Current suite result

The supplied `suite-hoy.txt` reports 14 tests: 8 pass and 6 fail. One failure is a mismatch between the installed kernel digest and the project's pinned digest. The output also lists five failed behavior expectations: cumulative budget, permanent revocation, same-access idempotency, the independent verifier rejecting an executor-only green result, and an access entry in the person's readable record.

The phase record says nine adversarial red cases were written and observed before implementation, and that implementation and a complete walkthrough were completed against Vespi kernel cut `54c20c7`. The project consumes the kernel by digest and is designed to fail when the kernel changes. The current result is not clean: the digest needs to be pinned again for the installed kernel, and the five behavior failures named above also need to be resolved or explained before a green result can be claimed. The project shows a working path, not a finished product.

## Tests grouped by what they check

Names below are copied from `suite-hoy.txt`.

### Kernel pin and version

- `el núcleo que consume Llavero es el corte fijado, módulo por módulo` : fails because `continuity.js` has a different digest than expected.
- `el encabezado de los cinco módulos declara el mismo commit` : passes.

### Permission boundaries and keys

- `pedir no es tener: sin llave, el acceso se bloquea y vuelve a la persona` : passes.
- `la llave vencida no abre y el bloqueo dice cuándo murió` : passes.
- `la llave no viaja a otro destino y el bloqueo nombra los dos` : passes.
- `el alcance es un dato, no «los datos»` : passes.
- `el presupuesto es un límite duro y se acumula entre accesos` : fails.
- `un acceso con otro propósito no abre: la llave dice para qué` : passes.
- `la revocación cierra la puerta desde ese momento y no se reactiva sola` : fails.
- `un portador no puede pasar más de lo que su llave le da` : passes.
- `el mismo acceso no se ejecuta dos veces: el segundo devuelve el recibo del primero` : fails.

### Receipt integrity and independent verification

- `un recibo editado a mano no verifica` : passes.
- `un verificador que solo cree al ejecutor no puede producir un verde en la auditoría` : fails.
- `el registro es un archivo que la persona puede abrir sin Llavero` : fails.

The agreement requires nine adversarial red cases to be written before code and observed failing. The current suite names include red cases kept as regression expectations. The phase notes say the original red failures were observed before implementation; the supplied current suite reports a later outcome after the kernel changed. These are different moments.

## What the adversarial phase found

The agreement's nine red cases cover the project boundaries: no access without a key, purpose matching, narrow scope, expiry, permanent revocation, single execution, independent recomputation, readable local history, and a reasoned blocked outcome. The principles also require visible labels for simulations and synthetic data.

The current suite output gives names and results, but this public repository does not contain the original nine pre-code failure logs as separate artifacts. The phase file says those logs were observed and saved in private project materials. This repository reports that phase record and the current named results without claiming readers can inspect those original logs here.

## How to rerun when the code opens

During the judges' review period, source code will be published under the review-only license. From the project root, run `npm test`, the package's test command. Treat the output as a fresh run against the kernel version and digests present then. A passing result is reportable only after the kernel pin has been reviewed and the current behavior failures resolved or explained.

Llavero's evidence includes no testnet transaction, public chain anchor, institutional integration, or external access. The agreement specifies a local, reversible effect using synthetic example data only.

## Español

### Resultado actual de la suite

El archivo suministrado `suite-hoy.txt` informa 14 pruebas: 8 pasan y 6 fallan. Un fallo es una diferencia entre el digest del kernel instalado y el digest fijado por el proyecto. La salida también enumera cinco expectativas de comportamiento fallidas: presupuesto acumulativo, revocación permanente, idempotencia del mismo acceso, el verificador independiente que rechaza un resultado verde basado solo en el ejecutor y una entrada de acceso en el registro legible por la persona.

El registro de fases dice que nueve casos rojos adversariales se escribieron y observaron antes de implementar, y que la implementación y un recorrido completo se terminaron contra el corte de kernel Vespi `54c20c7`. El proyecto consume el kernel mediante digest y está diseñado para fallar cuando cambia. El resultado actual no está limpio: hay que volver a fijar el digest para el kernel instalado y también resolver o explicar los cinco fallos de comportamiento antes de afirmar que la suite está verde. El proyecto muestra un camino funcional, no un producto terminado.

### Pruebas agrupadas por lo que comprueban

Los nombres siguientes se copian de `suite-hoy.txt`.

#### Fijación y versión del kernel

- `el núcleo que consume Llavero es el corte fijado, módulo por módulo` : falla porque `continuity.js` tiene un digest distinto del esperado.
- `el encabezado de los cinco módulos declara el mismo commit` : pasa.

#### Límites de permiso y llaves

- `pedir no es tener: sin llave, el acceso se bloquea y vuelve a la persona` : pasa.
- `la llave vencida no abre y el bloqueo dice cuándo murió` : pasa.
- `la llave no viaja a otro destino y el bloqueo nombra los dos` : pasa.
- `el alcance es un dato, no «los datos»` : pasa.
- `el presupuesto es un límite duro y se acumula entre accesos` : falla.
- `un acceso con otro propósito no abre: la llave dice para qué` : pasa.
- `la revocación cierra la puerta desde ese momento y no se reactiva sola` : falla.
- `un portador no puede pasar más de lo que su llave le da` : pasa.
- `el mismo acceso no se ejecuta dos veces: el segundo devuelve el recibo del primero` : falla.

#### Integridad de comprobantes y verificación independiente

- `un recibo editado a mano no verifica` : pasa.
- `un verificador que solo cree al ejecutor no puede producir un verde en la auditoría` : falla.
- `el registro es un archivo que la persona puede abrir sin Llavero` : falla.

El acuerdo requiere escribir los nueve casos rojos adversariales antes del código y observarlos fallar. Los nombres actuales incluyen casos rojos conservados como expectativas de regresión. Las notas de fases dicen que los fallos originales se observaron antes de implementar; la suite suministrada informa un resultado posterior al cambio del kernel. Son momentos distintos.

### Qué encontró la fase adversarial

Los nueve casos rojos del acuerdo cubren estos límites: no permitir acceso sin llave, exigir que coincida el propósito, mantener el alcance acotado, aplicar el vencimiento, conservar la revocación permanente, ejecutar una sola vez, recalcular de forma independiente, mantener un historial local legible y dar una razón para el bloqueo. Los principios también exigen identificar las simulaciones y los datos sintéticos.

La suite actual da nombres y resultados, pero este repositorio público no contiene los registros originales de los nueve fallos previos al código como artefactos separados. El archivo de fases dice que se observaron y guardaron en material privado. Aquí se informa esa fase y los resultados actuales con nombre, sin afirmar que se puedan inspeccionar aquellos registros.

### Cómo volver a correrla cuando se abra el código

Durante el periodo de los jueces se publicará el código fuente bajo la licencia de solo revisión. Desde la raíz del proyecto, ejecuta `npm test`, el comando de pruebas del paquete. Lee su salida como una corrida nueva contra la versión y los digests del kernel disponibles entonces. Solo se debe informar una suite aprobada después de revisar la fijación del kernel y resolver o explicar los fallos actuales de comportamiento.

La evidencia de Llavero no incluye transacciones de testnet, anclajes públicos, integración institucional ni acceso externo. El acuerdo especifica un efecto local y reversible, solo con datos sintéticos de ejemplo.
