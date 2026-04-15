# Services

Business logic lives here. → **Copy-paste template:** [`agents/templates/backend/services.md`](../../../agents/templates/backend/services.md)

For complete feature scaffolding: [`agents/workflows/create-admin-ui.md`](../../../agents/workflows/create-admin-ui.md)

## Conventions

- Extend `BaseService`.
- Call via static method: `ServiceName.perform(args)` — never instantiate directly.
- Services call other services, not queries directly.
- All write operations wrapped in transactions.
- One service per file — separate `CreateService`, `UpdateService`, `DestroyService` with barrel exports.

## Per-Action Class Scaling

For complex domains, use per-action classes in a subdirectory with barrel exports:

```
services/estimates/bulk-generate.ts   → exports BulkGenerate extends BaseService
services/estimates/index.ts           → export * from "./bulk-generate"
```

Import as `import { BulkGenerate } from "@/services/estimates"`.

## Orchestrate Up Front

Load required associations near the top-level `perform()`, then pass simple values into small helper methods. Don't hide async lookups inside helpers.
