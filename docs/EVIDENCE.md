# Evidence

This page separates the supplied current test record from the earlier adversarial phase. They describe different moments in the project.

## Current suite: 8 pass, 6 fail

The test run consulted for this evidence page reports 14 tests: 8 pass and 6 fail. The results follow its test names and output.

| Area | Test expectation | Result |
|---|---|---|
| Kernel pin | The consumed kernel matches the pinned cut module by module | Fail: continuity.js has a different digest |
| Module provenance | Five module headers declare the same commit | Pass |
| Permission | Access without a key is blocked and returned to the person | Pass |
| Expiry | An expired key does not open access | Pass |
| Destination | A key cannot travel to another destination | Pass |
| Scope | Scope names one item, not “the data” | Pass |
| Budget | A hard budget accumulates across accesses | Fail |
| Purpose | A different purpose does not open access | Pass |
| Revocation | Revocation blocks from that moment and does not undo itself | Fail |
| Delegation | A holder cannot pass more authority than the key grants | Pass |
| Idempotency | The same access does not run twice and returns its first receipt | Fail |
| Receipt integrity | A hand-edited receipt does not verify | Pass |
| Independent verification | A verifier that trusts only the executor cannot return green | Fail |
| Readable record | The person’s file contains an access entry readable without Llavero | Fail |

The names and statuses come from the supplied run. A passing test supports that expectation in its test context; it does not show a real institutional deployment.

## Why the kernel pin fails

Llavero consumes the shared Vespi kernel and fixes the expected files by digest. A digest fingerprints file contents. If a pinned module changes, its comparison fails rather than silently treating the new contents as the reviewed cut. The current run says continuity.js has a digest different from the expected one. That is one failure, separate from the five behavior failures above.

The phase record says implementation and a complete walkthrough were previously run against Vespi cut 54c20c7. The current suite is later. The sources do not establish why the installed module changed, so this page does not guess or update the pin.

## What the adversarial phase found

The agreement requires nine red cases to be written before implementation and observed failing. Their boundaries are: no access without a key, matching purpose, narrow scope, expiry, permanent revocation, one execution, independent recomputation, readable local history, and a reasoned blocked outcome. The principles also require simulated access and synthetic data to be identified.

The phase record says the nine initial failures were observed and saved in private project material. This public repository does not include those original logs. The current suite retains named regression expectations, some passing and some failing. The historical red phase and the supplied 8/14 result are separate records.

## What reviewers can inspect

This public repository contains agreement-derived documentation and a summary of the current test result; it does not include the raw test output, source code, or a full transcript of the historical terminal walkthrough. The package identifies npm test as its test command; running it when source is available would produce a new result against the kernel files and digests present then. A green claim would require a reviewed kernel pin and resolved or explained behavior failures.

There is no testnet transaction, public chain anchor, institutional integration, network access, or external data access in the evidence. The agreement specifies a local, reversible effect using synthetic example data only.

---

## Español

# Evidencia

Esta página separa el registro actual de pruebas de la fase adversarial anterior. Describen momentos distintos del proyecto.

## Suite actual: 8 pasan y 6 fallan

La corrida consultada para esta página de evidencia informa 14 pruebas: 8 pasan y 6 fallan. Los resultados siguen sus nombres y salida.

| Área | Expectativa de la prueba | Resultado |
|---|---|---|
| Fijación del kernel | El kernel consumido coincide módulo por módulo con el corte fijado | Falla: continuity.js tiene otro digest |
| Procedencia de módulos | Los encabezados de cinco módulos declaran el mismo commit | Pasa |
| Permiso | Sin llave, se bloquea el acceso y vuelve a la persona | Pasa |
| Vencimiento | La llave vencida no abre el acceso | Pasa |
| Destino | La llave no se usa en otro destino | Pasa |
| Alcance | El alcance nombra un dato, no “los datos” | Pasa |
| Presupuesto | El límite se acumula entre accesos | Falla |
| Propósito | Un propósito distinto no abre el acceso | Pasa |
| Revocación | Revocar bloquea desde ese momento y no se deshace sola | Falla |
| Delegación | El portador no pasa más autoridad que la concedida | Pasa |
| Idempotencia | El mismo acceso no se ejecuta dos veces y devuelve su primer comprobante | Falla |
| Integridad | Un comprobante editado a mano no verifica | Pasa |
| Verificación independiente | Un verificador que solo cree al ejecutor no puede dar verde | Falla |
| Registro legible | El archivo incluye el acceso y se lee sin Llavero | Falla |

Los nombres y estados vienen de la corrida suministrada. Que una prueba pase respalda esa expectativa en su contexto de prueba; no demuestra un despliegue institucional real.

## Por qué falla la fijación del kernel

Llavero consume el kernel compartido de Vespi y fija por digest los archivos esperados. El digest es una huella del contenido. Si cambia un módulo fijado, la comparación falla en vez de tratar silenciosamente el contenido nuevo como el corte ya revisado. La corrida actual dice que continuity.js tiene un digest distinto del esperado. Es un fallo, separado de los cinco fallos de comportamiento de la tabla.

El registro de fases dice que la implementación y un recorrido completo se ejecutaron antes contra el corte de Vespi 54c20c7. La suite actual es posterior. Las fuentes no establecen por qué cambió el módulo, así que esta página no adivina ni actualiza la fijación.

## Qué encontró la fase adversarial

El acuerdo exige escribir nueve casos rojos antes de implementar y observarlos fallar. Sus límites son: bloquear el acceso sin llave, exigir que coincida el propósito, limitar el alcance, aplicar el vencimiento, mantener la revocación permanente, ejecutar una sola vez, recalcular de forma independiente, conservar un historial local legible y dar una razón para el bloqueo. Los principios también exigen identificar el acceso simulado y los datos sintéticos.

El registro de fases dice que los nueve fallos iniciales se observaron y guardaron en material privado. El repositorio público no incluye esos registros originales. La suite actual conserva expectativas de regresión con nombre, unas aprobadas y otras fallidas. La fase roja histórica y el resultado suministrado de 8/14 son registros distintos.

## Qué pueden inspeccionar quienes revisan

Este repositorio público contiene documentación derivada del acuerdo y un resumen del resultado actual; no incluye la salida bruta de las pruebas, el código fuente ni una transcripción completa del recorrido histórico en terminal. El paquete indica npm test como comando de pruebas; al estar disponible el código, ejecutarlo daría un resultado nuevo para los archivos y digests del kernel de ese momento. Para afirmar que la suite está verde, habría que revisar la fijación del kernel y resolver o explicar los fallos de comportamiento.

La evidencia no incluye transacciones de testnet, anclajes públicos a una cadena, integración institucional, acceso a la red ni acceso externo a datos. El acuerdo especifica un efecto local y reversible con datos sintéticos de ejemplo.