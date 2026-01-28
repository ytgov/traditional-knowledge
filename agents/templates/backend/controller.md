# Controller Template

**Location:** `api/src/controllers/{resource-names}-controller.ts`

## Template

```typescript
import { isNil } from "lodash"

import logger from "@/utils/logger"

import { ResourceName } from "@/models"
import { ResourceNamePolicy } from "@/policies/resource-name-policy"
import { CreateService, DestroyService, UpdateService } from "@/services/resource-names"
import { IndexSerializer, ShowSerializer } from "@/serializers/resource-names"
import BaseController from "@/controllers/base-controller"

export class ResourceNamesController extends BaseController<ResourceName> {
  async index() {
    try {
      const whereClause = this.buildWhere()
      const filterScopes = this.buildFilterScopes()
      const orderClause = this.buildOrder([["name", "ASC"]])
      const scopedResourceNames = ResourceNamePolicy.applyScope(
        filterScopes,
        this.currentUser
      )

      const totalRecordCount = await scopedResourceNames.count({ where: whereClause })
      const resourceNameRecords = await scopedResourceNames.findAll({
        where: whereClause,
        order: orderClause,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedResourceNames = IndexSerializer.perform(resourceNameRecords)
      return this.response.json({
        resourceNames: serializedResourceNames,
        totalCount: totalRecordCount,
      })
    } catch (error) {
      logger.error(`Error fetching resource names: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching resource names: ${error}`,
      })
    }
  }

  async show() {
    try {
      const resourceNameRecord = await this.loadResourceName()
      if (isNil(resourceNameRecord)) {
        return this.response.status(404).json({
          message: "Resource name not found.",
        })
      }

      const policy = this.buildPolicy(resourceNameRecord)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this resource name.",
        })
      }

      const serializedResourceName = ShowSerializer.perform(resourceNameRecord)
      return this.response.json({
        resourceName: serializedResourceName,
        policy: policy,
      })
    } catch (error) {
      logger.error(`Error fetching resource name: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching resource name: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create a resource name.",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const newResourceName = await CreateService.perform(
        permittedAttributes,
        this.currentUser
      )
      const serializedResourceName = ShowSerializer.perform(newResourceName)
      return this.response.status(201).json({
        resourceName: serializedResourceName,
        policy: policy,
      })
    } catch (error) {
      logger.error(`Error creating resource name: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating resource name: ${error}`,
      })
    }
  }

  async update() {
    try {
      const existingResourceName = await this.loadResourceName()
      if (isNil(existingResourceName)) {
        return this.response.status(404).json({
          message: "Resource name not found.",
        })
      }

      const policy = this.buildPolicy(existingResourceName)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this resource name.",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      const updatedResourceName = await UpdateService.perform(
        existingResourceName,
        permittedAttributes,
        this.currentUser
      )
      const serializedResourceName = ShowSerializer.perform(updatedResourceName)
      return this.response.json({
        resourceName: serializedResourceName,
        policy: policy,
      })
    } catch (error) {
      logger.error(`Error updating resource name: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error updating resource name: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const resourceName = await this.loadResourceName()
      if (isNil(resourceName)) {
        return this.response.status(404).json({
          message: "Resource name not found.",
        })
      }

      const policy = this.buildPolicy(resourceName)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this resource name.",
        })
      }

      await DestroyService.perform(resourceName, this.currentUser)
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting resource name: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error deleting resource name: ${error}`,
      })
    }
  }

  private loadResourceName() {
    return ResourceName.findByPk(this.params.resourceNameId)
  }

  private buildPolicy(resourceName: ResourceName = ResourceName.build()) {
    return new ResourceNamePolicy(this.currentUser, resourceName)
  }
}
```

## Integration

Add to `api/src/controllers/index.ts`:

```typescript
export { ResourceNamesController } from "./resource-names-controller"
```

Add routes to `api/src/router.ts`:

```typescript
import { ResourceNamesController } from "@/controllers"

router
  .route("/api/resource-names")
  .get(ResourceNamesController.index)
  .post(ResourceNamesController.create)
router
  .route("/api/resource-names/:resourceNameId")
  .get(ResourceNamesController.show)
  .patch(ResourceNamesController.update)
  .delete(ResourceNamesController.destroy)
```

## Checklist

- [ ] All 5 CRUD methods (index, show, create, update, destroy)
- [ ] Proper HTTP status codes (200, 201, 204, 400, 403, 404, 422)
- [ ] Policy authorization checks before mutations
- [ ] Error logging with context
- [ ] Uses services for mutations (Create, Update, Destroy)
- [ ] Uses serializers for output (Index, Show)
- [ ] Private helper methods (`loadResourceName`, `buildPolicy`)
- [ ] Exported from `controllers/index.ts`
- [ ] Routes added to `router.ts`

## Status Code Reference

| Code | Meaning | Used When |
|------|---------|-----------|
| 200 | OK | Successful GET, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | General error in try/catch |
| 403 | Forbidden | Policy check fails |
| 404 | Not Found | Record not found |
| 422 | Unprocessable Entity | Create/Update/Delete fails |
