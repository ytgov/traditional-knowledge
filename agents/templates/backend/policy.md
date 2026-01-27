# Policy Template

**Location:** `api/src/policies/{resource-name}-policy.ts`

## Template

```typescript
import { Attributes, FindOptions } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"

import { ResourceName, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class ResourceNamePolicy extends PolicyFactory(ResourceName) {
  show(): boolean {
    return true
  }

  create(): boolean {
    if (this.user.isSystemAdmin) return true

    return false
  }

  update(): boolean {
    if (this.user.isSystemAdmin) return true

    return false
  }

  destroy(): boolean {
    if (this.user.isSystemAdmin) return true

    return false
  }

  permittedAttributes(): Path[] {
    return ["name"]
  }

  permittedAttributesForCreate(): Path[] {
    return [...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<ResourceName>> {
    return ALL_RECORDS_SCOPE
  }
}
```

## Integration

Add to `api/src/policies/index.ts`:

```typescript
export { ResourceNamePolicy } from "./resource-name-policy"
```

## Checklist

- [ ] Extends `PolicyFactory(ModelClass)`
- [ ] All CRUD methods return `boolean` (show, create, update, destroy)
- [ ] Default to `false` (restrictive by default)
- [ ] Check `this.user.isSystemAdmin` for admin bypass
- [ ] `permittedAttributes()` returns array of allowed field names
- [ ] `permittedAttributesForCreate()` extends `permittedAttributes()` for foreign keys
- [ ] `policyScope()` returns `ALL_RECORDS_SCOPE` or scoped query
- [ ] Exported from `policies/index.ts`

## Common Patterns

### Admin-Only Access

```typescript
create(): boolean {
  if (this.user.isSystemAdmin) return true

  return false
}
```

### Owner-Based Access

```typescript
update(): boolean {
  if (this.user.isSystemAdmin) return true
  if (this.user.id === this.record.userId) return true

  return false
}
```

### Role-Based Access

```typescript
destroy(): boolean {
  if (this.user.isSystemAdmin) return true
  if (this.user.roles.includes("manager")) return true

  return false
}
```

### Scoped by User Ownership

```typescript
static policyScope(user: User): FindOptions<Attributes<ResourceName>> {
  if (user.isSystemAdmin) return ALL_RECORDS_SCOPE

  return {
    where: {
      userId: user.id,
    },
  }
}
```

### Additional Attributes for Create

```typescript
permittedAttributesForCreate(): Path[] {
  return [
    "foreignKeyId",  // Set on create, not editable
    ...this.permittedAttributes(),
  ]
}
```
