# Evidence

This page separates the 2026-10-09 test capture from the earlier adversarial phase. They describe different moments in the project.

## Current suite: all 14 pass

The evidence comes from `docs/suite-2026-10-09.txt`: 14 tests, 14 pass, 0 cancelled, 0 skipped, 0 todo, run with `node --test` on Node v24.15.0 in a clean clone of the private project, with an empty HOME and no network. The results follow its test names and output.

| Area | Test expectation | Result |
|---|---|---|
| Kernel pin | The consumed kernel matches the pinned cut module by module | Pass |
| Module provenance | Five module headers declare the same commit | Pass |
| Permission | Access without a key is blocked and returned to the person | Pass |
| Expiry | An expired key does not open access | Pass |
| Destination | A key cannot travel to another destination | Pass |
| Scope | Scope names one item, not “the data” | Pass |
| Budget | A hard budget accumulates across accesses | Pass |
| Purpose | A different purpose does not open access | Pass |
| Revocation | Revocation blocks from that moment and does not undo itself | Pass |
| Delegation | A holder cannot pass more authority than the key grants | Pass |
| Idempotency | The same access does not run twice and returns its first receipt | Pass |
| Receipt integrity | A hand-edited receipt does not verify | Pass |
| Independent verification | A verifier that trusts only the executor cannot return green | Pass |
| Readable record | The person’s file contains an access entry readable without Llavero | Pass |

The names and statuses come from the 2026-10-09 capture (`docs/suite-2026-10-09.txt`). A passing test supports that expectation in its test context; it does not show a real institutional deployment.

## Why the earlier capture was red

Llavero consumes the shared Vespi kernel and fixes the expected files by digest. A digest fingerprints file contents: when a pinned module changes, the comparison reports a mismatch instead of treating the new contents as the reviewed cut. The 2026-10-09 capture shows the vendored copy (kernel 0.1.5, commit ed559e8, in vendor/vespi-kernel) matching its SOURCE.md module by module, and the suite verifies that copy. The earlier capture, dated 2026-10-03, was red because the project was still pinned to an older cut of the kernel (0.1.3); the re-pin is done. A phase record places an earlier implementation and a complete walkthrough against that older cut; the public sources keep no original terminal transcript.

## What the adversarial phase found

The agreement requires nine red cases to be written before implementation and observed red. Their boundaries are: no access without a key, matching purpose, narrow scope, expiry, permanent revocation, one execution, independent recomputation, readable local history, and a reasoned blocked outcome. The principles also require simulated access and synthetic data to be identified.

The phase record says the nine initial red cases were observed and saved in private project material. This public repository does not include those original logs. The current suite retains the named regression expectations, all of them passing in the 2026-10-09 capture. The historical red phase and the 2026-10-09 capture are separate records.

## What reviewers can inspect

This public repository contains agreement-derived documentation and the 2026-10-09 capture (`docs/suite-2026-10-09.txt`); it does not include the source code or a full transcript of the historical terminal walkthrough. The package identifies npm test as its test command; when the source is available, running it should report the same counts as the reference capture — 14 tests, 14 pass, 0 cancelled, 0 skipped, 0 todo — against the kernel files present then. Those counts attest only to what these tests cover, not to a real institutional deployment or an audit.

There is no testnet transaction, public chain anchor, institutional integration, network access, or external data access in the evidence. The agreement specifies a local, reversible effect using synthetic example data only.

---

## Español

# Evidencia

Esta página separa la captura de pruebas del 2026-10-09 de la fase adversarial anterior. Describen momentos distintos del proyecto.

## Suite actual: las 14 pasan

La evidencia viene de `docs/suite-2026-10-09.txt`: 14 pruebas, 14 pasan, 0 canceladas, 0 omitidas, 0 todo, corridas con `node --test` sobre Node v24.15.0 en un clon limpio del proyecto privado, con HOME vacío y sin red. Los resultados siguen sus nombres y salida.

| Área | Expectativa de la prueba | Resultado |
|---|---|---|
| Fijación del kernel | El kernel consumido coincide módulo por módulo con el corte fijado | Pasa |
| Procedencia de módulos | Los encabezados de cinco módulos declaran el mismo commit | Pasa |
| Permiso | Sin llave, se bloquea el acceso y vuelve a la persona | Pasa |
| Vencimiento | La llave vencida no abre el acceso | Pasa |
| Destino | La llave no se usa en otro destino | Pasa |
| Alcance | El alcance nombra un dato, no “los datos” | Pasa |
| Presupuesto | El límite se acumula entre accesos | Pasa |
| Propósito | Un propósito distinto no abre el acceso | Pasa |
| Revocación | Revocar bloquea desde ese momento y no se deshace sola | Pasa |
| Delegación | El portador no pasa más autoridad que la concedida | Pasa |
| Idempotencia | El mismo acceso no se ejecuta dos veces y devuelve su primer comprobante | Pasa |
| Integridad | Un comprobante editado a mano no verifica | Pasa |
| Verificación separada | Un verificador que solo cree al ejecutor no puede dar verde | Pasa |
| Registro legible | El archivo incluye el acceso y se lee sin Llavero | Pasa |

Los nombres y estados vienen de la captura del 2026-10-09 (`docs/suite-2026-10-09.txt`). Que una prueba pase respalda esa expectativa en su contexto de prueba; no demuestra un despliegue institucional real.

## Por qué la captura anterior estaba en rojo

Llavero consume el kernel compartido de Vespi y fija por digest los archivos esperados. El digest es una huella del contenido: si cambia un módulo fijado, la comparación informa una diferencia en vez de tratar en silencio el contenido nuevo como el corte ya revisado. La captura del 2026-10-09 muestra que la copia vendida (kernel 0.1.5, commit ed559e8, en vendor/vespi-kernel) coincide con su SOURCE.md módulo por módulo, y la suite verifica esa copia. La captura anterior, del 2026-10-03, estaba en rojo porque el proyecto aún fijaba un corte viejo del kernel (0.1.3); el re-pin ya está hecho. El registro de fases sitúa una implementación y un recorrido completo anteriores contra ese corte viejo; las fuentes públicas no conservan la transcripción original de terminal.

## Qué encontró la fase adversarial

El acuerdo exige escribir nueve casos rojos antes de implementar y observarlos fallar. Sus límites son: bloquear el acceso sin llave, exigir que coincida el propósito, limitar el alcance, aplicar el vencimiento, mantener la revocación permanente, ejecutar una sola vez, recalcular por separado, conservar un historial local legible y dar una razón para el bloqueo. Los principios también exigen identificar el acceso simulado y los datos sintéticos.

El registro de fases dice que los nueve casos rojos iniciales se observaron y guardaron en material privado. Este repositorio público no incluye esos registros originales. La suite conserva las expectativas de regresión con nombre, y las 14 pasan en la captura del 2026-10-09. La fase roja histórica y la captura del 2026-10-09 son registros distintos.

## Qué pueden inspeccionar quienes revisan

Este repositorio público contiene documentación derivada del acuerdo y la captura del 2026-10-09 (`docs/suite-2026-10-09.txt`); no incluye el código fuente ni la transcripción completa del recorrido histórico en terminal. El paquete indica npm test como comando de pruebas; al estar disponible el código, ejecutarlo debe dar el mismo conteo que la captura de referencia — 14 pruebas, 14 pasan, 0 canceladas, 0 omitidas, 0 todo — contra los archivos del kernel presentes en ese momento. Esos números acreditan solo lo que esas pruebas cubren, no un despliegue institucional ni una auditoría.

La evidencia no incluye transacciones de testnet, anclajes públicos a una cadena, integración institucional, acceso a la red ni acceso externo a datos. El acuerdo especifica un efecto local y reversible con datos sintéticos de ejemplo.