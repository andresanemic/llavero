# How Llavero works

## Scope

Llavero is a local terminal project for reviewing data-access requests, granting or revoking permission, and reading a local record of completed and blocked attempts. All records and sample data are synthetic. There is no institutional connection, external data store, network call, blockchain, or real-world access.

## Participants and rights

| Participant | What they may do | Boundary |
|---|---|---|
| Person | Review a request, grant or revoke a key, and read or keep the record | Only the person grants or revokes |
| Requester | Ask for access with a stated purpose and destination | A request does not confer permission |
| Holder | Use a granted key within its named scope, purpose, destination, and expiry | Delegation may narrow scope, never widen it |
| Verifier | Recompute from the record which attempts occurred | It does not decide whether a request is truthful or lawful |

## A request from beginning to end

Imagine one of the three fictional organizations asks to access one specific item in the synthetic data for persona-1, for its stated purpose. The person sees the requester, purpose, item, destination, and expiry before deciding whether to grant a key. The agreement does not name a real field or purpose, so this example keeps those details generic.

The holder presents the key with an access request. Llavero checks that it exists, is not revoked or expired, names the requested field and destination, and carries the same purpose. If these conditions hold, the local example store returns the example field and the record gets a receipt. This is access to data written for the project, not a real institution or person.

A different purpose or broader field is blocked with a reason and, when possible, a next step. Revoking the key blocks later attempts permanently. Repeating the same access key returns the first receipt instead of opening the example data again. The person can read the JSONL record with an ordinary editor, without Llavero.

```
requester asks: purpose + scope + destination
                    |
                    v
person reviews and grants a key, or declines
                    |
                    v
holder presents key -> purpose, scope, destination, expiry, revocation checked
                    |
          +---------+---------+
          |                   |
       allowed             blocked
          |                   |
          +------ receipt ----+
                    |
                    v
        local readable JSONL record
                    |
                    v
     separate verifier recomputes result
```

## Rules the project is meant to enforce

- **A request is not permission.** Access stays blocked until the person grants a key.
- **A key has a purpose.** It is stated in the request and checked again at access time.
- **A key has a narrow scope.** It names a specific piece of data. A holder may pass on less authority, never more.
- **A key has a destination and expiry.** It cannot be used elsewhere and stops opening access after expiry.
- **The person controls revocation.** Revoking a key blocks later use permanently for that key.
- **Access happens once for the same access key.** A repeat returns the prior receipt.
- **The record belongs to the person.** It is a local JSONL file readable outside the program.
- **Verification recomputes.** The verifier calculates the outcome from the record, apart from the executor's summary.
- **An impossible request comes back blocked.** The record gives a reason and names a way forward when one exists.
- **A simulation is labelled.** Sample-store access is not presented as access to a real external system.

These are the rules in the agreement and principles. The current suite has passing and failing expectations; this describes the agreed behavior, not a claim that every rule is verified against the installed kernel.

## Receipts and records

The agreement says each grant, revocation, access, and rejection leaves a receipt with who requested access, purpose, key, what was opened, what the verifier checked, and a content fingerprint. Receipts use the kernel's canonical digest and `verifyReceipt`; hand-editing a receipt should make verification fail. The record is local and readable without Llavero.

## What this demonstrates, and what it does not

The project demonstrates a local flow over synthetic sample data, with grants, revocations, access attempts, rejections, receipts, and tests. The agreement and phase notes describe a complete terminal walkthrough and a suite run in the original pinned-kernel context.

It does not demonstrate access to real personal data, an institution, a third-party system, or a network service. It does not establish legal compliance, identity, consent in a real setting, truth of a request, or fitness for production. For current suite results and the historical kernel context, see [Evidence](EVIDENCE.md).

## Español

### Alcance

Llavero es un proyecto local de terminal para revisar solicitudes de acceso a datos, conceder o revocar permisos y leer un registro local de intentos permitidos y bloqueados. Todos los registros y datos de ejemplo son sintéticos. No hay conexión institucional, almacén externo, llamada de red, blockchain ni acceso real.

### Participantes y derechos

| Participante | Qué puede hacer | Límite |
|---|---|---|
| Persona | Revisar solicitudes, conceder o revocar una llave y leer o guardar el registro | Solo la persona concede o revoca |
| Solicitante | Pedir acceso con propósito y destino declarados | Pedir no concede permiso |
| Portador | Usar una llave dentro de su alcance, propósito, destino y vencimiento | Al delegar puede reducir el alcance, nunca ampliarlo |
| Verificador | Recalcular desde el registro qué intentos ocurrieron | No decide si la solicitud es verdadera o lícita |

### Una solicitud de principio a fin

Imagina que una de las tres organizaciones ficticias pide acceder a un dato concreto de los datos sintéticos de persona-1 para el propósito que declara. Antes de decidir si concede una llave, la persona ve quién solicita, el propósito, el dato, el destino y el vencimiento. El acuerdo no nombra un campo ni un propósito real, así que este ejemplo mantiene esos detalles generales.

El portador presenta la llave con una solicitud. Llavero comprueba que exista, que no esté revocada ni vencida, que nombre el campo y destino solicitados y que tenga el mismo propósito. Si se cumplen esas condiciones, el almacén local devuelve el campo de ejemplo y el registro recibe un comprobante. Es acceso a datos escritos para el proyecto, no a una institución ni a una persona real.

Un propósito distinto o un campo más amplio se bloquea con una razón y, cuando existe, un siguiente paso. Revocar la llave bloquea permanentemente los intentos posteriores. Si se repite la misma clave de acceso, se devuelve el comprobante inicial sin abrir los datos otra vez. La persona puede leer el JSONL con un editor común, sin Llavero.

```
solicitante pide: propósito + alcance + destino
                    |
                    v
persona revisa y concede una llave o rechaza
                    |
                    v
portador presenta llave -> se comprueban propósito, alcance, destino, vencimiento, revocación
                    |
          +---------+---------+
          |                   |
      permitido             bloqueado
          |                   |
          +---- comprobante --+
                    |
                    v
          registro JSONL local y legible
                    |
                    v
       verificador aparte recalcula el resultado
```

### Reglas que el proyecto busca hacer cumplir

- **Pedir no es tener permiso.** El acceso sigue bloqueado hasta que la persona concede una llave.
- **La llave tiene propósito.** Se declara al pedir y se vuelve a comprobar al acceder.
- **La llave tiene alcance acotado.** Nombra un dato concreto. El portador puede transmitir menos autoridad, nunca más.
- **La llave tiene destino y vencimiento.** No sirve en otro destino y deja de abrir el acceso al vencer.
- **La persona controla la revocación.** Revocar una llave bloquea su uso posterior para siempre.
- **Una misma clave de acceso se ejecuta una vez.** Si se repite, devuelve el comprobante anterior.
- **El registro pertenece a la persona.** Es un archivo JSONL que se puede leer fuera del programa.
- **Verificar es recalcular.** El verificador calcula el resultado desde el registro, aparte del resumen del ejecutor.
- **Una solicitud imposible vuelve bloqueada.** El registro da la razón y nombra una salida cuando existe.
- **La simulación se etiqueta.** El acceso al almacén de ejemplo no se presenta como acceso a un sistema real.

Estas son las reglas del acuerdo y los principios. La suite actual tiene expectativas aprobadas y fallidas; esto describe el comportamiento acordado, sin afirmar que cada regla esté verificada contra el kernel instalado.

### Comprobantes y registros

El acuerdo dice que cada concesión, revocación, acceso y rechazo deja un comprobante con quién pidió acceso, el propósito, la llave, qué se abrió, qué comprobó el verificador y una huella del contenido. Los comprobantes usan el digest canónico del kernel y `verifyReceipt`; una edición manual debería hacer fallar la verificación. El registro es local y legible sin Llavero.

### Qué demuestra y qué no

El proyecto muestra un recorrido local con datos sintéticos, concesiones, revocaciones, intentos de acceso, rechazos, comprobantes y pruebas. El acuerdo y las notas de fases describen un recorrido completo de terminal y una suite ejecutada en el contexto original del kernel fijado.

No demuestra acceso a datos personales reales, a una institución, a un sistema de terceros ni a un servicio de red. No establece cumplimiento legal, identidad, consentimiento real, veracidad de una solicitud ni preparación para producción. Para ver los resultados actuales de la suite y el contexto histÃ³rico del kernel, consulta [Evidencia](EVIDENCE.md).
