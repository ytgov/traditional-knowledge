import {
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
  sql,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  BelongsTo,
  Default,
  NotNull,
  PrimaryKey,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"
import ArchiveItem from "@/models/archive-item"
import Category from "@/models/category"

export class ArchiveItemCategory extends BaseModel<
  InferAttributes<ArchiveItemCategory>,
  InferCreationAttributes<ArchiveItemCategory>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare archiveItemId: number

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare categoryId: number

  @Attribute(DataTypes.INTEGER)
  declare setBySourceId: number | null

  @Attribute(DataTypes.INTEGER)
  declare setByUserId: number | null

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
  @BelongsTo(() => ArchiveItem, {
    foreignKey: "archiveItemId",
    inverse: {
      as: "archiveItemCategories",
      type: "hasMany",
    },
  })
  declare archiveItem?: NonAttribute<ArchiveItem>

  @BelongsTo(() => Category, {
    foreignKey: "categoryId",
    inverse: {
      as: "archiveItemCategories",
      type: "hasMany",
    },
  })
  declare category?: NonAttribute<Category>
 
  // Scopes
  static establishScopes(): void {
    //this.addSearchScope(["name"])
  }
}

export default ArchiveItemCategory