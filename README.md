[![Llavero: visible permissions for personal data](./assets/cover.png)](./assets/cover.png)

# Llavero

<p align="center">
  <a href="#english"><img src="https://img.shields.io/badge/status-working_path-D7B698?style=for-the-badge&labelColor=07111A" alt="Status: working path"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-review--only-D7B698?style=for-the-badge&labelColor=07111A" alt="License: review only"></a>
  <a href="./docs/EVIDENCE.md"><img src="https://img.shields.io/badge/suite-14_pass-D7B698?style=for-the-badge&labelColor=07111A" alt="Suite: 14 pass"></a>
  <a href="#english"><img src="https://img.shields.io/badge/agreement-written_before_code-E0C170?style=for-the-badge&labelColor=07111A" alt="Agreement written before code"></a>
  <a href="https://github.com/andresanemic/vespi"><img src="https://img.shields.io/badge/built_with-Vespi_%C2%B7_Lore_Plugin-E0C170?style=for-the-badge&labelColor=07111A" alt="Built with Vespi and Lore Plugin"></a>
  <a href="https://github.com/andresanemic/vespi/tree/ed559e83c976dd6e6a379a5510db776206f670b4"><img src="https://img.shields.io/badge/kernel-0.1.5_pinned-ed559e8?style=for-the-badge&labelColor=07111A&color=E0C170" alt="Kernel: 0.1.5 pinned (commit ed559e8)"></a>
</p>

<p align="center">
  <b>A permission should be legible to the person it affects: who asked, for what, and what happened next.</b>
</p>

---

<details>
<summary><b>Read in English</b></summary>

<a id="english"></a>

**Llavero makes a permission legible to the person it affects.**

> “The unit is the permission: who asks, for what purpose, under which key, and what was refused.”

## The problem

When someone gives an organization a piece of personal information, the permission can disappear into the organization's own systems. The person may not be able to see who asked for it, what purpose was declared, or whether an attempt was refused. A record that only the organization can inspect does not answer the person's plain question: who has access, and why?

Llavero explores a bounded answer. Each request names a purpose, a specific scope, a destination, and a time limit. The person is the one who grants or revokes the key; a local, readable record is meant to show what was allowed and what was blocked. This is a synthetic, local project path, not a deployed data-rights service.

## If you are judging Find Your Way or Meridian, start here

- Read the project foundation and its walkthrough. Start with [How it works](./docs/HOW_IT_WORKS.md).
- Open the test record. See [Evidence](./docs/EVIDENCE.md).
- Read the legal and verification limits. See [Legal and limits](./docs/LEGAL_AND_LIMITS.md).
- Review the publication conditions. See [Code not included](./CODE_NOT_INCLUDED.md) and the [review-only license](./LICENSE).

## In one minute

Imagine a fictional requester asking persona-1, a synthetic example identity, for one specific data item. The person can review the requester, declared purpose, destination, scope, and expiry before granting a key or declining. If a holder later presents the key with matching details, the agreed flow permits access to the project's local example store and records a receipt. A request with a different purpose is blocked; revocation is meant to block later attempts. The person can inspect the JSONL record with an ordinary editor.

That is the agreed path, and the supplied suite of 2026-10-09 backs it: 14 tests, 14 pass, 0 cancelled, 0 skipped, 0 todo, on Node v24.15.0. The record does not contain a captured transcript of the full walkthrough. [Evidence](./docs/EVIDENCE.md) separates the historical walkthrough from the current test result.

## What it looks like in practice

The exchange below is an illustrative reconstruction from the agreement and named test expectations. It is not terminal output, and the bracketed request details are intentionally fictional placeholders. The agreement says simulated access is labelled as such; no real person's data or external system is involved.

```text
Fictional requester: I request one synthetic field for a stated purpose,
                     at a named destination, until a stated expiry.
Person:              I can review the request before deciding.
                     [Grant a key, or decline.]
Holder:              I present the key with the requested purpose,
                     field, and destination.
Llavero's agreed rule:
                     Check the key, purpose, scope, destination,
                     expiry, and revocation before local example access.
Record:              Keep a local receipt that can be inspected separately.
Verifier:             Recompute the result from the record.
```

The suite includes a mismatched-purpose block and a keyless-access block, and it also covers permanent revocation, same-access idempotency, independent rejection of an executor-only green result, and an access entry in the person's readable record: the 2026-10-09 capture shows all 14 passing. This example explains the intended decision sequence; it does not supply missing output. [How it works](./docs/HOW_IT_WORKS.md) gives the fuller walkthrough and its limits.

## How it works

```text
requester names purpose, scope, destination, and expiry
                         |
                         v
person reviews the request and grants a key or declines
                         |
                         v
holder presents key -> checks before local example access
                         |
               +---------+---------+
               |                   |
            allowed              blocked
               |                   |
               +---- receipt -------+
                         |
                         v
             local, readable JSONL record
                         |
                         v
               separate verification
```

The diagram describes the agreed flow. The table describes authority and boundaries, not proof that each rule currently passes.

| Actor | Right or role | Boundary |
|---|---|---|
| Person | Reviews a request, grants or revokes a key, reads or keeps the record | Only the person grants or revokes |
| Requester | Requests access with a declared purpose and destination | A request alone grants no access |
| Holder | Presents a key for its named scope and purpose | Delegation may narrow authority, never widen it |
| Verifier | Recomputes what the record supports | Does not decide whether a request is true or lawful |

### Why Llavero

| You need | What it gives you | Where it lives |
|---|---|---|
| To see what is being requested | A request framed by purpose, one data scope, destination, and expiry | Agreement and [How it works](./docs/HOW_IT_WORKS.md) |
| To decide who may act | A key granted or revoked by the person | Agreement; the revocation expectation passes in the 2026-10-09 run |
| To inspect what happened | A local JSONL record and receipts are part of the agreed design | [Evidence](./docs/EVIDENCE.md) lists the access-entry expectation as passing |
| To distinguish a claim from a check | A verifier that recalculates from the record | Agreement and the named verifier test; that test passes in the 2026-10-09 run |

## What Llavero is not

It is not a real data custodian, an institutional integration, a consent dashboard, a credential wallet, a data exchange, or a finished product. Its sample identity, organizations, records, and data are synthetic. It has no network call, external data store, blockchain, testnet anchor, or access to a real third-party system.

## Evidence you can open

The 2026-10-09 run reports **14 tests: 14 pass, 0 cancelled, 0 skipped, 0 todo**, run with `node --test` on Node v24.15.0 in a clean clone of the private project, with an empty HOME and no network. Every expectation passes: the eight that were already green (keyless access, expiry, destination matching, narrow scope, purpose matching, delegation that cannot widen scope, a receipt changed by hand, and matching module commit headers) and the six that were red on 2026-10-03 (the kernel digest pinned module by module, cumulative budget, permanent revocation, repeating the same access, independent verification, and the person's readable access record).

The digest check matters because the project pins the Vespi kernel by digest: the suite verifies the vendored copy (kernel 0.1.5, commit ed559e8, in vendor/vespi-kernel) against its SOURCE.md module by module, so a changed kernel is not silently treated as the reviewed one. The 2026-10-03 capture was red because the project was still pinned to an older cut of the kernel (0.1.3); the re-pin is done. The adversarial phase records nine red cases written and observed before implementation; the public repository does not include the original nine logs. See [Evidence](./docs/EVIDENCE.md) for names, scope, and chronology.

## Llavero, Vespi, and Lore Plugin

The project agreement names Vespi's canonical receipt digest and `verifyReceipt`; Llavero is designed to consume that kernel without modifying it. The shared kernel supplies receipt sealing and verification mechanics described by the agreement. It does not make the sample data real, decide whether a request is lawful, or independently prove that every agreed behavior passes in the current checkout.

**What this relationship means.** The project was built with Lore Plugin's method (its agreement and criterion live in the project, in `acuerdo.md` and `lore/`), and its operations, authority and receipts run on the Vespi kernel 0.1.5, in the pinned copy that Lore Plugin 2.5.1 distributes (`skills/vespi/core/kernel`). That copy sits in the project as `vendor/vespi-kernel` and the suite verifies it against its `SOURCE.md`. Lore Plugin does not run inside the project. This project does not use the kernel's newer capabilities (Stellar pubnet anchors, live x402 settlement, the ZK verifier, emergency access); it exercises the core of operations, authority and receipts.

Lore Plugin is the surrounding project-context and routing system: the project contract points to the agreement, principles, and phase record. It is not the permission store or the data-access service. This public repository contains documentation and evidence, not source code for those mechanics.

## What it does not do, and what is not verified

Llavero does not establish legal compliance, identity, real consent, a requester's real-world right to data, the truth of a request, or readiness for production. The agreement cites Chile's Law 21.719 as design context, marks it `NO VERIFICADO`, and says the primary law and implementation were not checked during this phase. No legal professional reviewed the project's legal position.

The supplied run is green for the 14 expectations it names, and for nothing more: it does not audit the project, does not make the example data real, and does not cover the historical walkthrough. The complete historical walkthrough is described in the agreement and phase record, but its original terminal transcript is not available in the public source material.

## How to review this project

Start with the agreement's public summary in [How it works](./docs/HOW_IT_WORKS.md), compare the declared rules with [Evidence](./docs/EVIDENCE.md), then read [Legal and limits](./docs/LEGAL_AND_LIMITS.md). [Code not included](./CODE_NOT_INCLUDED.md) explains the publication boundary; the [LICENSE](./LICENSE) contains the review terms. Do not treat the fictional interaction above as a runnable CLI transcript.

## Author

**Andrés Peña**, repository authority: `andresanemic`.

[<img src="./assets/icons/v2/telegram.svg" width="28" alt="Telegram">](https://t.me/andresanemic) &nbsp;&nbsp; [<picture><source media="(prefers-color-scheme: dark)" srcset="./assets/icons/v2/x-dark.svg"><img src="./assets/icons/v2/x.svg" width="28" alt="X"></picture>](https://x.com/andresanemic) &nbsp;&nbsp; [<img src="./assets/icons/v2/linkedin.svg" width="28" alt="LinkedIn">](https://www.linkedin.com/in/andresanemic/)

---

[How it works](./docs/HOW_IT_WORKS.md) · [Evidence](./docs/EVIDENCE.md) · [Legal and limits](./docs/LEGAL_AND_LIMITS.md) · [Code not included](./CODE_NOT_INCLUDED.md) · [Review-only license](./LICENSE) · [Vespi](https://github.com/andresanemic/vespi) · [Lore Plugin](https://github.com/andresanemic/lore-plugin)

</details>

<details>
<summary><b>Leer en español</b></summary>

<a id="espanol"></a>

**Llavero vuelve legible el permiso para quien debe decidir.**

> «La unidad es el permiso: quién lo pide, para qué, bajo qué llave y qué se negó.»

## El problema

Cuando una persona entrega un dato a una organización, el permiso puede perderse dentro de los sistemas de esa organización. Tal vez la persona no pueda ver quién lo pidió, qué propósito declaró o si un intento fue rechazado. Un registro que solo la organización puede inspeccionar no responde la pregunta sencilla de quien entregó el dato: quién puede acceder y por qué.

Llavero explora una respuesta acotada. Cada solicitud declara un propósito, un alcance concreto, un destino y un vencimiento. La persona concede o revoca la llave; un registro local y legible busca mostrar qué se permitió y qué se bloqueó. Es un recorrido local con datos sintéticos, no un servicio desplegado de derechos sobre datos.

## Si estás evaluando Find Your Way o Meridian, empieza aquí

- Lee la base del proyecto y su recorrido. Empieza por [Cómo funciona](./docs/HOW_IT_WORKS.md).
- Abre el registro de pruebas. Consulta [Evidencia](./docs/EVIDENCE.md).
- Lee los límites jurídicos y de verificación. Consulta [Marco legal y límites](./docs/LEGAL_AND_LIMITS.md).
- Revisa las condiciones de publicación. Consulta [Código no incluido](./CODE_NOT_INCLUDED.md) y la [licencia de solo revisión](./LICENSE).

## En un minuto

Imagina que un solicitante ficticio pide a persona-1, una identidad sintética de ejemplo, un dato específico. Antes de conceder una llave o rechazar la petición, la persona puede revisar quién solicita, el propósito declarado, el destino, el alcance y el vencimiento. Si después un portador presenta la llave con esos mismos datos, el recorrido acordado permite consultar el almacén local de ejemplos y dejar un comprobante. Una petición con otro propósito se bloquea; la revocación debe bloquear los intentos posteriores. La persona puede inspeccionar el registro JSONL con un editor común.

Ese es el recorrido acordado, y la suite suministrada del 2026-10-09 lo respalda: 14 pruebas, las 14 pasan, 0 canceladas, 0 omitidas, 0 todo, sobre Node v24.15.0. Las fuentes no conservan una transcripción de terminal del recorrido completo. [Evidencia](./docs/EVIDENCE.md) distingue el recorrido histórico del resultado actual.

## Cómo se ve en la práctica

El intercambio siguiente es una reconstrucción ilustrativa basada en el acuerdo y en las expectativas de pruebas con nombre. No es una salida de terminal, y los detalles entre corchetes son marcadores ficticios deliberados. El acuerdo dice que el acceso simulado se identifica como tal; no intervienen datos de personas reales ni sistemas externos.

```text
Solicitante ficticio: Pido un campo sintético para un propósito declarado,
                      en un destino nombrado y hasta un vencimiento indicado.
Persona:              Puedo revisar la solicitud antes de decidir.
                      [Conceder una llave o rechazarla.]
Portador:             Presento la llave con el propósito, el campo
                      y el destino solicitados.
Regla acordada:       Comprobar la llave, el propósito, el alcance,
                      el destino, el vencimiento y la revocación
                      antes de consultar el ejemplo local.
Registro:             Dejar un comprobante local que se pueda inspeccionar.
Verificador:          Recalcular el resultado desde el registro.
```

La suite incluye el bloqueo de una petición sin llave y de otra con propósito distinto, y también cubre la revocación permanente, la idempotencia del mismo acceso, el rechazo de un resultado verde que solo confía en el ejecutor y una entrada de acceso en el registro legible por la persona: la captura del 2026-10-09 muestra las 14 en verde. El ejemplo explica la secuencia de decisión prevista; no sustituye una salida que no está disponible. [Cómo funciona](./docs/HOW_IT_WORKS.md) desarrolla el recorrido y sus límites.

## Cómo funciona

```text
solicitante declara propósito, alcance, destino y vencimiento
                           |
                           v
persona revisa y concede una llave o rechaza
                           |
                           v
portador presenta llave -> comprobaciones antes del acceso local
                           |
                 +---------+---------+
                 |                   |
              permitido           bloqueado
                 |                   |
                 +--- comprobante ---+
                           |
                           v
             registro JSONL local y legible
                           |
                           v
                verificación separada
```

El diagrama representa el recorrido acordado. La tabla describe autoridad y límites, no demuestra que cada regla pase hoy.

| Actor | Derecho o función | Límite |
|---|---|---|
| Persona | Revisa solicitudes, concede o revoca llaves y lee o guarda el registro | Solo ella concede o revoca |
| Solicitante | Pide acceso con propósito y destino declarados | La solicitud por sí sola no concede acceso |
| Portador | Presenta una llave para el alcance y propósito que nombra | Al delegar puede reducir la autoridad, nunca ampliarla |
| Verificador | Recalcula lo que respalda el registro | No decide si una solicitud es verdadera o lícita |

### Por qué Llavero

| Necesitas | Qué te da | Dónde está |
|---|---|---|
| Ver qué se solicita | Una solicitud con propósito, un dato concreto, destino y vencimiento | Acuerdo y [Cómo funciona](./docs/HOW_IT_WORKS.md) |
| Decidir quién puede actuar | Una llave que la persona concede o revoca | Acuerdo; la expectativa de revocación pasa en la corrida del 2026-10-09 |
| Inspeccionar qué pasó | Un registro JSONL local y comprobantes forman parte del diseño acordado | [Evidencia](./docs/EVIDENCE.md) indica que la expectativa de registrar el acceso pasa |
| Distinguir una afirmación de una comprobación | Un verificador que recalcula desde el registro | Acuerdo y prueba del verificador; pasa en la corrida del 2026-10-09 |

## Qué no es Llavero

No es un custodio real de datos, una integración institucional, un panel de consentimiento, una billetera de credenciales, un intercambio de datos ni un producto terminado. La identidad, las organizaciones, los registros y los datos de ejemplo son sintéticos. No hace llamadas de red, no usa un almacén externo, no toca blockchain ni testnet y no accede a sistemas reales de terceros.

## Evidencia que puedes abrir

La corrida del 2026-10-09 informa **14 pruebas: las 14 pasan, 0 canceladas, 0 omitidas, 0 todo**, corridas con `node --test` sobre Node v24.15.0 en un clon limpio del proyecto privado, con HOME vacío y sin red. Todas las expectativas pasan: las ocho que ya estaban en verde (acceso sin llave, vencimiento, coincidencia del destino, alcance acotado, coincidencia del propósito, delegación que no amplía el alcance, un comprobante editado a mano y encabezados de módulos con el mismo commit) y las seis que el 2026-10-03 estaban en rojo (el digest del kernel fijado módulo por módulo, presupuesto acumulativo, revocación permanente, repetición del mismo acceso, verificación separada y registro legible del acceso para la persona).

La comprobación del digest importa porque el proyecto fija el kernel de Vespi por digest: la suite verifica la copia vendida (kernel 0.1.5, commit ed559e8, en vendor/vespi-kernel) contra su SOURCE.md módulo por módulo, así que un cambio del kernel no se toma en silencio como si fuera el mismo kernel revisado. La captura del 2026-10-03 estaba en rojo porque el proyecto aún fijaba un corte viejo del kernel (0.1.3); el re-pin ya está hecho. La fase adversarial registra nueve casos rojos escritos y observados antes de implementar; el repositorio público no incluye los registros originales de esos nueve casos. [Evidencia](./docs/EVIDENCE.md) da los nombres, el alcance y la cronología.

## Llavero, Vespi y Lore Plugin

El acuerdo del proyecto nombra el digest canónico de comprobantes de Vespi y `verifyReceipt`; Llavero está diseñado para consumir ese kernel sin modificarlo. El kernel compartido aporta la mecánica de sellado y verificación de comprobantes que describe el acuerdo. No vuelve reales los datos de ejemplo, no decide si una solicitud es lícita ni demuestra por sí solo que cada comportamiento acordado pase en la versión actual.

**Qué significa esta relación.** El proyecto se construyó con el método de Lore Plugin (su acuerdo y su criterio viven en el proyecto, en `acuerdo.md` y `lore/`), y sus operaciones, autoridad y recibos corren sobre el kernel de Vespi 0.1.5, en la copia fijada que distribuye Lore Plugin 2.5.1 (`skills/vespi/core/kernel`). Esa copia está en el proyecto como `vendor/vespi-kernel` y la suite la verifica contra su `SOURCE.md`. Lore Plugin no corre dentro del proyecto. Este proyecto no usa las capacidades nuevas del kernel (anclas Stellar pubnet, liquidación x402 en vivo, el verificador ZK, el acceso de emergencia); ejerce el núcleo de operaciones, autoridad y recibos.

Lore Plugin aporta el contexto y el enrutamiento del proyecto: el contrato del proyecto apunta al acuerdo, los principios y el registro de fases. No es el almacén de permisos ni el servicio de acceso a datos. Este repositorio público contiene documentación y evidencia, no el código fuente de esas mecánicas.

## Lo que no hace y lo que no está verificado

Llavero no establece cumplimiento legal, identidad, consentimiento real, derecho de un solicitante real a los datos, veracidad de una solicitud ni preparación para producción. El acuerdo cita la Ley 21.719 de Chile como contexto de diseño, la marca `NO VERIFICADO` y dice que durante esta fase no se leyeron la ley primaria ni se contrastó con ella la implementación. Ningún profesional del derecho revisó la posición jurídica del proyecto.

La corrida suministrada está en verde para las 14 expectativas que nombra, y para nada más: no audita el proyecto, no vuelve reales los datos de ejemplo ni cubre el recorrido histórico. El acuerdo y el registro de fases describen el recorrido histórico completo, pero las fuentes públicas no contienen su transcripción original de terminal.

## Cómo revisar este proyecto

Empieza por el resumen público del acuerdo en [Cómo funciona](./docs/HOW_IT_WORKS.md), compara las reglas declaradas con [Evidencia](./docs/EVIDENCE.md) y lee [Marco legal y límites](./docs/LEGAL_AND_LIMITS.md). [Código no incluido](./CODE_NOT_INCLUDED.md) explica la frontera de publicación; la [LICENSE](./LICENSE) contiene las condiciones de revisión. No tomes el intercambio ficticio anterior como una transcripción ejecutable de la CLI.

## Autor

**Andrés Peña**, autoridad del repositorio: `andresanemic`.

[<img src="./assets/icons/v2/telegram.svg" width="28" alt="Telegram">](https://t.me/andresanemic) &nbsp;&nbsp; [<picture><source media="(prefers-color-scheme: dark)" srcset="./assets/icons/v2/x-dark.svg"><img src="./assets/icons/v2/x.svg" width="28" alt="X"></picture>](https://x.com/andresanemic) &nbsp;&nbsp; [<img src="./assets/icons/v2/linkedin.svg" width="28" alt="LinkedIn">](https://www.linkedin.com/in/andresanemic/)

---

[Cómo funciona](./docs/HOW_IT_WORKS.md) · [Evidencia](./docs/EVIDENCE.md) · [Marco legal y límites](./docs/LEGAL_AND_LIMITS.md) · [Código no incluido](./CODE_NOT_INCLUDED.md) · [Licencia de solo revisión](./LICENSE) · [Vespi](https://github.com/andresanemic/vespi) · [Lore Plugin](https://github.com/andresanemic/lore-plugin)

</details>
