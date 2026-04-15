# Models

One Sequelize model per database table. → **Copy-paste template:** [`agents/templates/backend/model.md`](../../../agents/templates/backend/model.md)

## Responsibilities

- Persistence, associations, scopes, and model-adjacent helpers only.
- Put business logic in services, not models.

## Conventions

- **Soft deletes:** all models support `deletedAt` (paranoid mode enabled globally).
- **Section order:** `Fields → Helpers → Associations → Static methods`.
- **Scope naming:** name for the relationship or business rule, not the parameter type (e.g., `byFundingPeriod`, `byCentre`).
- **Anti-match scopes:** prefer correlated `NOT EXISTS` predicates over client-built exclusion lists or `NOT IN`.

## Index Decorators

```ts
createIndexDecorator("user-groups-user-id-group-id-unique", {
  name: "user_groups_user_id_group_id_unique",
  unique: true,
  where: { deletedAt: null },
  msg: "User group combination must be unique",
})
```

- First parameter (decorator identifier): kebab-case.
- `name` property: snake_case to match the actual database index name from migrations.
- Always include both the decorator identifier AND the `name` property.

## Enum Patterns

- Place enums directly in the relevant model file (not separate utilities).
- Include the model name in the enum: `UserYukonFirstNations` not `YukonFirstNations`.
- Add `@ValidateAttribute` + `isIn` validation decorators for enum fields.

## Ledger vs Template Pattern

- **Template models** hold current configuration and rates. Changes only affect new ledger records.
- **Ledger models** record period-specific facts. Rate and other period-anchored fields are **copied at creation** and never re-templated later. User edits to transaction fields (e.g., `estimatedCost`, `notes`) are allowed for corrections.
- Never re-template or automatically recompute frozen, period-anchored fields on ledger models.
- When designing new models, be explicit about which fields are copied "as of" a given period.
