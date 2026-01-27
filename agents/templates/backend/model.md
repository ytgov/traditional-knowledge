# Model Template

**Location:** `api/src/models/{resource-name}.ts`

## Template

```typescript
import {
  DataTypes,
  Op,
  sql,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  Default,
  HasMany,
  Index,
  NotNull,
  PrimaryKey,
} from "@sequelize/core/decorators-legacy"

import { arrayWrap } from "@/utils/array-wrap"

import BaseModel from "@/models/base-model"

export class ResourceName extends BaseModel<
  InferAttributes<ResourceName>,
  InferCreationAttributes<ResourceName>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(200))
  @NotNull
  @Index({ unique: true })
  declare name: string

  @Attribute(DataTypes.DATE(0))
  @NotNull
  @Default(sql.fn("getutcdate"))
  declare createdAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE(0))
  @NotNull
  @Default(sql.fn("getutcdate"))
  declare updatedAt: CreationOptional<Date>

  @Attribute(DataTypes.DATE(0))
  declare deletedAt: Date | null

  // Associations (optional)
  // @HasMany(() => RelatedModel, {
  //   foreignKey: "resourceNameId",
  //   inverse: "resourceName",
  // })
  // declare relatedModels?: NonAttribute<RelatedModel[]>

  // CRITICAL: Required for search and uniqueness validation
  static establishScopes(): void {
    this.addSearchScope(["name"])

    this.addScope("excludeById", (resourceNameIdOrIds: number) => {
      const resourceNameIds = arrayWrap(resourceNameIdOrIds)
      return {
        where: {
          id: {
            [Op.notIn]: resourceNameIds,
          },
        },
      }
    })
  }
}

export default ResourceName
```

## Integration

Add to `api/src/models/index.ts`:

```typescript
export { ResourceName } from "./resource-name"
```

## Checklist

- [ ] Extends `BaseModel`
- [ ] Uses `CreationOptional` for auto-generated fields
- [ ] Uses `DATE(0)` for timestamp fields (no milliseconds)
- [ ] Uses `sql.fn("getutcdate")` for default timestamps
- [ ] Includes soft delete (`deletedAt`)
- [ ] **CRITICAL:** Implements `establishScopes()` with `addSearchScope` and `excludeById`
- [ ] Uses `arrayWrap` utility for array handling
- [ ] Exported from `models/index.ts`

## Field Type Reference

| JavaScript Type | Sequelize Type | Notes |
|-----------------|----------------|-------|
| `string` | `DataTypes.STRING(length)` | Specify max length |
| `number` | `DataTypes.INTEGER` | For IDs, counts |
| `number` | `DataTypes.DECIMAL(10, 2)` | For money |
| `boolean` | `DataTypes.BOOLEAN` | |
| `Date` | `DataTypes.DATE(0)` | 0 = no milliseconds |
| `string` (long) | `DataTypes.TEXT` | For descriptions |
