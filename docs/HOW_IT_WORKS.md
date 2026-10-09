# How Llavero works

Llavero is a local terminal project for reviewing data-access requests, granting or revoking permission, and reading a local record. The agreement limits its example to synthetic data and reversible local effects. There is no institutional connection, external store, network call, blockchain, or real-world access.

## The unit: one permission

A key names a purpose, a specific scope, a destination, and an expiry. Asking does not grant access. The person reviews the request and is the only actor who grants or revokes a key. A holder may delegate less authority than the key permits, never more.

The agreement also describes a human decision before access, receipts for grants, revocations, accesses, and rejections, and verification separate from execution. These are agreed rules, not proof that every current test passes. See [Evidence](EVIDENCE.md).

## Participants, rights, and limits

| Participant | Right or role | Limit |
|---|---|---|
| Person | Reviews a request, grants or revokes a key, reads or keeps the record | Only the person grants or revokes |
| Requester | Asks for access with a declared purpose and destination | A request is not permission |
| Holder | Presents a key for its named purpose, scope, destination, and expiry | Delegation can narrow scope, never widen it |
| Verifier | Recomputes what the record supports | Cannot decide whether a request is true or lawful |

## A fictional request, from review to record

This is a narrative of the agreed route, not a captured terminal run. The agreement identifies persona-1 and three fictional organizations but does not provide a specific data field, purpose, or destination, so the details stay generic.

A fictional organization requests one field in persona-1’s synthetic example data and declares a purpose, destination, and expiry. The person sees these details before granting a key or declining. If a holder presents the key for that same field, purpose, and destination before expiry, the agreed flow checks that the key exists and has not been revoked or expired before reading from the local example store. The access is simulated and is meant to be labelled that way. A receipt records the event; the person can read the JSONL record with an ordinary editor, and a separate verifier recalculates what the record supports.

A different purpose is blocked in a passing test, as is access without a key. Permanent revocation, repeated-access idempotency, independent verification, and an access entry in the readable record are agreed expectations with tests; in the 2026-10-09 run all of them pass. This route explains the design; a passing suite covers only what those tests check.

## Flow

<pre>
requester declares purpose + scope + destination + expiry
                            |
                            v
person reviews -> grants a key or declines
                            |
                            v
holder presents key -> checks before local example access
                            |
                 +----------+----------+
                 |                     |
              allowed                blocked
                 |                     |
                 +------ receipt ------+
                            |
                            v
                local readable JSONL record
                            |
                            v
                 separate recomputation
</pre>

The agreement says a receipt carries the requester, purpose, key, opened item, verifier check, and a content fingerprint. It names Vespi’s canonical digest and verifyReceipt. Evidence describes which related expectations pass in the supplied suite.

## Rules and current verification

| Agreed rule | Meaning | Current test |
|---|---|---|
| Asking is not permission | Without a granted key, access is blocked | Pass |
| Purpose must match | A different purpose is blocked | Pass |
| Scope names one item | The key does not open all of a person’s data | Pass |
| Destination and expiry apply | The key cannot travel elsewhere or stay valid past expiry | Pass |
| Delegation narrows | A holder cannot pass on more authority than received | Pass |
| Revocation is permanent | Later uses of the key stay blocked | Pass |
| Same access runs once | A repeat returns the first receipt | Pass |
| Verification recalculates | The verifier does not trust only the executor’s green result | Pass |
| The person’s record is readable | The access appears in a file readable outside Llavero | Pass |
| Receipt integrity is checked | A hand-edited receipt does not verify | Pass |

The supplied run of 2026-10-09 reports 14 tests: 14 pass, none fail, none skipped (`docs/suite-2026-10-09.txt`). These results describe tests, not a real deployment.

## What it shows, and what it does not

The agreement, principles, and test names describe a local permission flow over synthetic data. The phase record says a complete walkthrough was previously reproduced against Vespi cut 54c20c7, but the public sources contain no original terminal transcript. Llavero does not establish identity, real consent, a requester’s legal right, truth of a declared purpose, legal compliance, or readiness for production. It does not retrieve real information from an organization. See [Legal and limits](LEGAL_AND_LIMITS.md).

---

<a id="espanol"></a>

# Cómo funciona Llavero

Llavero es un proyecto local de terminal para revisar solicitudes de acceso a datos, conceder o revocar permisos y leer un registro local. El acuerdo limita el ejemplo a datos sintéticos y efectos locales reversibles. No hay conexión institucional, almacén externo, llamada de red, blockchain ni acceso real.

## La unidad: un permiso

Una llave declara un propósito, un alcance concreto, un destino y un vencimiento. Pedir no concede acceso. La persona revisa la solicitud y es la única que concede o revoca una llave. Un portador puede delegar menos autoridad de la que permite la llave, nunca más.

El acuerdo también describe una decisión humana antes del acceso, comprobantes para concesiones, revocaciones, accesos y rechazos, y una verificación separada de la ejecución. Son reglas acordadas, no pruebas de que toda expectativa pase hoy. Consulta [Evidencia](EVIDENCE.md).

## Participantes, derechos y límites

| Participante | Derecho o función | Límite |
|---|---|---|
| Persona | Revisa solicitudes, concede o revoca una llave, lee o guarda el registro | Solo ella concede o revoca |
| Solicitante | Pide acceso con propósito y destino declarados | Pedir no es tener permiso |
| Portador | Presenta una llave para su propósito, alcance, destino y vencimiento | Al delegar puede reducir el alcance, nunca ampliarlo |
| Verificador | Recalcula lo que respalda el registro | No puede decidir si una solicitud es verdadera o lícita |

## Una solicitud ficticia, de la revisión al registro

Este relato describe el recorrido acordado, no una corrida de terminal capturada. El acuerdo identifica a persona-1 y tres organizaciones ficticias, pero no especifica un campo, propósito o destino; por eso los detalles se mantienen generales.

Una organización ficticia pide un campo de los datos sintéticos de ejemplo de persona-1 y declara un propósito, un destino y un vencimiento. La persona ve esos detalles antes de conceder una llave o rechazar. Si un portador presenta la llave para ese mismo campo, propósito y destino antes del vencimiento, el recorrido acordado comprueba que la llave exista y no se haya revocado ni vencido antes de consultar el almacén local de ejemplos. El acceso es simulado y debe identificarse como tal. Un comprobante registra el evento; la persona puede leer el JSONL con un editor común y un verificador separado recalcula lo que respalda el registro.

Una prueba aprobada bloquea un propósito distinto, y otra bloquea el acceso sin llave. Las expectativas de revocación permanente, idempotencia de un acceso repetido, verificación independiente y entrada de acceso en el registro legible tienen pruebas, y en la corrida del 2026-10-09 todas pasan. El recorrido explica el diseño, pero no afirma que esté todo verificado.

## Recorrido

<pre>
solicitante declara propósito + alcance + destino + vencimiento
                              |
                              v
persona revisa -> concede una llave o rechaza
                              |
                              v
portador presenta llave -> comprobar antes del acceso local
                              |
                   +----------+----------+
                   |                     |
                permitido             bloqueado
                   |                     |
                   +---- comprobante ----+
                              |
                              v
                  registro JSONL legible
                              |
                              v
                    recálculo separado
</pre>

El acuerdo dice que el comprobante incluye al solicitante, propósito, llave, dato abierto, comprobación del verificador y huella del contenido. Nombra el digest canónico de Vespi y verifyReceipt. Evidencia indica cuáles expectativas relacionadas pasan en la suite suministrada.

## Reglas y verificación actual

| Regla acordada | Significado | Prueba actual |
|---|---|---|
| Pedir no es tener permiso | Sin una llave concedida, se bloquea el acceso | Pasa |
| El propósito debe coincidir | Se bloquea un propósito distinto | Pasa |
| El alcance nombra un dato | La llave no abre todos los datos de la persona | Pasa |
| Aplican destino y vencimiento | La llave no sirve en otro destino ni después de vencer | Pasa |
| La delegación reduce | El portador no pasa más autoridad de la recibida | Pasa |
| La revocación es permanente | Los usos posteriores siguen bloqueados | Pasa |
| El mismo acceso se ejecuta una vez | Si se repite, devuelve el primer comprobante | Pasa |
| La verificación recalcula | El verificador no confía solo en el resultado verde del ejecutor | Pasa |
| El registro de la persona es legible | El acceso aparece en un archivo que se abre fuera de Llavero | Pasa |
| Se comprueba la integridad | Un comprobante editado a mano no verifica | Pasa |

La corrida suministrada del 2026-10-09 informa 14 pruebas: 14 pasan, ninguna falla ni se omite (`docs/suite-2026-10-09.txt`). Estos resultados describen pruebas, no un despliegue real.

## Qué muestra y qué no

El acuerdo, los principios y los nombres de pruebas describen un flujo local de permisos con datos sintéticos. El registro de fases dice que un recorrido completo se reprodujo antes contra el corte de Vespi 54c20c7, pero las fuentes públicas no incluyen la transcripción original de terminal. Llavero no establece identidad, consentimiento real, derecho legal del solicitante, veracidad de un propósito declarado, cumplimiento jurídico ni preparación para producción. No obtiene información real de una organización. Consulta [Marco legal y límites](LEGAL_AND_LIMITS.md).
