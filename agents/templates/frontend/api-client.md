# API Client Template

**Location:** `web/src/api/{resource-names}-api.ts`

## Template

```typescript
import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"

/** Keep in sync with api/src/models/resource-name.ts */
export type ResourceName = {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

/** Keep in sync with api/src/serializers/resource-names/index-serializer.ts */
export type ResourceNameAsIndex = Pick<
  ResourceName,
  "id" | "name" | "createdAt" | "updatedAt"
>

/** Keep in sync with api/src/serializers/resource-names/show-serializer.ts */
export type ResourceNameAsShow = Pick<
  ResourceName,
  "id" | "name" | "createdAt" | "updatedAt"
>

/** Keep in sync with api/src/serializers/resource-names/reference-serializer.ts */
export type ResourceNameAsReference = Pick<
  ResourceName,
  "id" | "name"
>

export type ResourceNamePolicy = Policy

export type ResourceNameWhereOptions = WhereOptions<ResourceName, "name">

/** Must match model scopes */
export type ResourceNameFiltersOptions = FiltersOptions<{
  search: string | string[]
  excludeById: number | number[]
}>

export type ResourceNameQueryOptions = QueryOptions<
  ResourceNameWhereOptions,
  ResourceNameFiltersOptions
>

export const resourceNamesApi = {
  async list(params: ResourceNameQueryOptions = {}): Promise<{
    resourceNames: ResourceNameAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/resource-names", {
      params,
    })
    return data
  },

  async get(resourceNameId: number): Promise<{
    resourceName: ResourceNameAsShow
    policy: ResourceNamePolicy
  }> {
    const { data } = await http.get(`/api/resource-names/${resourceNameId}`)
    return data
  },

  async create(attributes: Partial<ResourceName>): Promise<{
    resourceName: ResourceNameAsShow
    policy: ResourceNamePolicy
  }> {
    const { data } = await http.post("/api/resource-names", attributes)
    return data
  },

  async update(
    resourceNameId: number,
    attributes: Partial<ResourceName>
  ): Promise<{
    resourceName: ResourceNameAsShow
    policy: ResourceNamePolicy
  }> {
    const { data } = await http.patch(
      `/api/resource-names/${resourceNameId}`,
      attributes
    )
    return data
  },

  async delete(resourceNameId: number): Promise<void> {
    const { data } = await http.delete(`/api/resource-names/${resourceNameId}`)
    return data
  },
}

export default resourceNamesApi
```

## Checklist

- [ ] Base type matches backend model fields
- [ ] `AsIndex`, `AsShow`, `AsReference` types match serializers
- [ ] `WhereOptions` lists queryable fields
- [ ] `FiltersOptions` matches model scopes (search, excludeById)
- [ ] All 5 CRUD methods implemented (list, get, create, update, delete)
- [ ] Correct HTTP methods (GET, POST, PATCH, DELETE)
- [ ] Default export for convenient importing

## Type Reference

| Type | Purpose |
|------|---------|
| `ResourceName` | Base type matching model |
| `ResourceNameAsIndex` | List/table rows |
| `ResourceNameAsShow` | Detail/edit views |
| `ResourceNameAsReference` | Dropdowns/references |
| `ResourceNamePolicy` | Authorization flags |
| `ResourceNameWhereOptions` | Exact match filters |
| `ResourceNameFiltersOptions` | Scope-based filters |
| `ResourceNameQueryOptions` | Combined query params |
