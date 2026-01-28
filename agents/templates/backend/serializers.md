# Serializers Templates

**Location:** `api/src/serializers/{resource-names}/`

Create 4 files in a folder named after the resource (plural, kebab-case).

---

## index-serializer.ts

Used for list/index endpoints. Returns minimal fields needed for table display.

```typescript
import { pick } from "lodash"

import { ResourceName } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type ResourceNameIndexView = Pick<
  ResourceName,
  "id" | "name" | "createdAt" | "updatedAt"
>

export class IndexSerializer extends BaseSerializer<ResourceName> {
  perform(): ResourceNameIndexView {
    return {
      ...pick(this.record, ["id", "name", "createdAt", "updatedAt"]),
    }
  }
}

export default IndexSerializer
```

---

## show-serializer.ts

Used for show/detail endpoints. Returns all fields needed for display and editing.

```typescript
import { pick } from "lodash"

import { ResourceName } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type ResourceNameShowView = Pick<
  ResourceName,
  "id" | "name" | "createdAt" | "updatedAt"
>

export class ShowSerializer extends BaseSerializer<ResourceName> {
  perform(): ResourceNameShowView {
    return {
      ...pick(this.record, ["id", "name", "createdAt", "updatedAt"]),
    }
  }
}

export default ShowSerializer
```

---

## reference-serializer.ts

Used for dropdowns and references. Returns only id and display name.

```typescript
import { pick } from "lodash"

import { ResourceName } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type ResourceNameAsReference = Pick<
  ResourceName,
  "id" | "name"
>

export class ReferenceSerializer extends BaseSerializer<ResourceName> {
  perform(): ResourceNameAsReference {
    return {
      ...pick(this.record, ["id", "name"]),
    }
  }
}

export default ReferenceSerializer
```

---

## index.ts

```typescript
export { IndexSerializer } from "./index-serializer"
export { ShowSerializer } from "./show-serializer"
export {
  ReferenceSerializer,
  type ResourceNameAsReference as AsReference,
} from "./reference-serializer"
```

---

## Checklist

- [ ] Folder created: `api/src/serializers/{resource-names}/`
- [ ] All 4 files created
- [ ] Each serializer extends `BaseSerializer<Model>`
- [ ] Each serializer has a typed return (`Pick<Model, ...>`)
- [ ] Uses `pick()` from lodash for field selection
- [ ] Barrel exports in `index.ts` with type alias for `AsReference`

## Usage

The static `perform()` method handles both single records and arrays:

```typescript
// Single record
const serialized = ShowSerializer.perform(record)

// Array of records
const serializedList = IndexSerializer.perform(records)
```

## Advanced Patterns

### With Associations

```typescript
import { pick } from "lodash"

import { ResourceName } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"
import { ReferenceSerializer as UserReferenceSerializer } from "@/serializers/users"

export type ResourceNameShowView = Pick<
  ResourceName,
  "id" | "name" | "createdAt" | "updatedAt"
> & {
  user?: ReturnType<typeof UserReferenceSerializer.prototype.perform>
}

export class ShowSerializer extends BaseSerializer<ResourceName> {
  perform(): ResourceNameShowView {
    return {
      ...pick(this.record, ["id", "name", "createdAt", "updatedAt"]),
      user: this.record.user
        ? new UserReferenceSerializer(this.record.user).perform()
        : undefined,
    }
  }
}
```

### With Computed Fields

```typescript
export class ShowSerializer extends BaseSerializer<ResourceName> {
  perform(): ResourceNameShowView {
    return {
      ...pick(this.record, ["id", "name", "createdAt", "updatedAt"]),
      isActive: this.record.deletedAt === null,
      displayName: `${this.record.name} (${this.record.id})`,
    }
  }
}
```
