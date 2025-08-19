import {
  type CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  type NonAttribute,
  sql,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  BelongsToMany,
  Default,
  Index,
  NotNull,
  PrimaryKey,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"
import ArchiveItem from "./archive-item"
import ArchiveItemCategory from "./archive-item-category"

export class Category extends BaseModel<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(255))
  @NotNull
  @Index({ unique: true })
  declare name: string

  @Attribute(DataTypes.STRING(2000))
  declare description: string | null

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

  // Associations
  @BelongsToMany(() => ArchiveItem, {
    through: () => ArchiveItemCategory,
    foreignKey: "categoryId",
    otherKey: "archiveItemId",
    inverse: "categories",
    throughAssociations: {
      fromSource: "archiveItemCategories",
      toSource: "category",
      fromTarget: "archiveItemCategories",
      toTarget: "archiveItem",
    },
  })
  declare archiveItems?: NonAttribute<ArchiveItem[]>

  // Scopes
  static establishScopes(): void {
    this.addSearchScope(["name"])
  }
}

export default Category
