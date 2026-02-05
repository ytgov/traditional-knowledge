# Services Templates

**Location:** `api/src/services/{resource-names}/`

Create 4 files in a folder named after the resource (plural, kebab-case).

---

## create-service.ts

```typescript
import { Attributes } from "@sequelize/core"
import { isNil } from "lodash"

import { ResourceName, User } from "@/models"
import BaseService from "@/services/base-service"

export type ResourceNameCreationAttributes = Partial<Attributes<ResourceName>>

export class CreateService extends BaseService {
  constructor(
    private attributes: ResourceNameCreationAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<ResourceName> {
    const { name, ...optionalAttributes } = this.attributes

    if (isNil(name)) {
      throw new Error("Name is required")
    }

    const resourceName = await ResourceName.create({
      ...optionalAttributes,
      name,
    })
    return resourceName
  }
}

export default CreateService
```

---

## update-service.ts

```typescript
import { Attributes } from "@sequelize/core"

import { ResourceName, User } from "@/models"
import BaseService from "@/services/base-service"

export type ResourceNameUpdateAttributes = Partial<Attributes<ResourceName>>

export class UpdateService extends BaseService {
  constructor(
    private resourceName: ResourceName,
    private attributes: ResourceNameUpdateAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<ResourceName> {
    return this.resourceName.update(this.attributes)
  }
}

export default UpdateService
```

---

## destroy-service.ts

```typescript
import { ResourceName, type User } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  constructor(
    private resourceName: ResourceName,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<void> {
    await this.resourceName.destroy()
  }
}

export default DestroyService
```

---

## index.ts

```typescript
export { CreateService } from "./create-service"
export { UpdateService } from "./update-service"
export { DestroyService } from "./destroy-service"
```

---

## Checklist

- [ ] Folder created: `api/src/services/{resource-names}/`
- [ ] All 4 files created: `create-service.ts`, `update-service.ts`, `destroy-service.ts`, `index.ts`
- [ ] Constructor parameter order: (attributes, currentUser) or (record, attributes, currentUser)
- [ ] `currentUser` is always the **last** parameter
- [ ] CreateService validates required fields
- [ ] Barrel exports in `index.ts`

## Constructor Parameter Order

| Service | Parameters |
|---------|------------|
| CreateService | `(attributes, currentUser)` |
| UpdateService | `(record, attributes, currentUser)` |
| DestroyService | `(record, currentUser)` |

**Rule:** The current user is always the last parameter.

## Advanced Patterns

### With Transaction

```typescript
import db from "@/db/db-client"

async perform(): Promise<ResourceName> {
  return db.transaction(async () => {
    const resourceName = await ResourceName.create({
      ...this.attributes,
      name: this.attributes.name,
    })

    await RelatedModel.create({
      resourceNameId: resourceName.id,
      // ...
    })

    return resourceName
  })
}
```

### Calling Other Services

```typescript
async perform(): Promise<ResourceName> {
  const resourceName = await ResourceName.create({
    ...this.attributes,
    name: this.attributes.name,
  })

  await SomeOtherService.perform(resourceName, this.currentUser)

  return resourceName
}
```
