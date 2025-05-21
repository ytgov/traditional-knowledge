import {
  DataTypes,
  sql,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from "@sequelize/core"
import {
  Attribute,
  AutoIncrement,
  BelongsTo,
  Default,
  NotNull,
  PrimaryKey,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"
import Group from "@/models/group"
import InformationSharingAgreement from "@/models/information-sharing-agreement"
import User from "@/models/user"

export enum InformationSharingAgreementAccessGrantAccessLevel {
  READ = "read",
  READ_DOWNLOAD = "read_download",
  EDIT = "edit",
}

export class InformationSharingAgreementAccessGrant extends BaseModel<
  InferAttributes<InformationSharingAgreementAccessGrant>,
  InferCreationAttributes<InformationSharingAgreementAccessGrant>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare informationSharingAgreementId: number

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare groupId: number

  @Attribute(DataTypes.INTEGER)
  declare userId: number | null

  @Attribute(DataTypes.STRING)
  @NotNull
  @Default(InformationSharingAgreementAccessGrantAccessLevel.READ)
  @ValidateAttribute({
    isIn: {
      args: [Object.values(InformationSharingAgreementAccessGrantAccessLevel)],
      msg: `Access level must be one of ${Object.values(
        InformationSharingAgreementAccessGrantAccessLevel
      ).join(", ")}`,
    },
  })
  declare accessLevel: CreationOptional<InformationSharingAgreementAccessGrantAccessLevel>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare creatorId: number

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
  @BelongsTo(() => InformationSharingAgreement, {
    foreignKey: "informationSharingAgreementId",
    inverse: {
      as: "accessGrants",
      type: "hasMany",
    },
  })
  declare informationSharingAgreement?: NonAttribute<InformationSharingAgreement>

  @BelongsTo(() => Group, {
    foreignKey: "groupId",
    inverse: {
      as: "informationSharingAgreementAccessGrants",
      type: "hasMany",
    },
  })
  declare group?: NonAttribute<Group>

  @BelongsTo(() => User, {
    foreignKey: "userId",
    inverse: {
      as: "informationSharingAgreementAccessGrants",
      type: "hasMany",
    },
  })
  declare user?: NonAttribute<User>

  @BelongsTo(() => User, {
    foreignKey: "creatorId",
    inverse: {
      as: "createdInformationSharingAgreementAccessGrants",
      type: "hasMany",
    },
  })
  declare creator?: NonAttribute<User>

  // Scopes
  static establishScopes(): void {
    // Add as needed, might want nested user or group search?
  }
}

export default InformationSharingAgreementAccessGrant
