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
  BelongsToMany,
  Default,
  HasMany,
  NotNull,
  PrimaryKey,
  Table,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"
import { isUndefined } from "lodash"

import BaseModel from "@/models/base-model"
import ArchiveItemInformationSharingAgreementAccessGrant from "@/models/archive-item-information-sharing-agreement-access-grant"
import Group from "@/models/group"
import InformationSharingAgreement from "@/models/information-sharing-agreement"
import InformationSharingAgreementAccessGrantSibling from "@/models/information-sharing-agreement-access-grant-sibling"
import User from "@/models/user"

export enum InformationSharingAgreementAccessGrantAccessLevels {
  READ = "read",
  READ_DOWNLOAD = "read_download",
  EDIT = "edit",
  ADMIN = "admin",
}

@Table({
  tableName: "information_sharing_agreement_access_grants",
})
export class InformationSharingAgreementAccessGrant extends BaseModel<
  InferAttributes<InformationSharingAgreementAccessGrant>,
  InferCreationAttributes<InformationSharingAgreementAccessGrant>
> {
  static readonly AccessLevels = InformationSharingAgreementAccessGrantAccessLevels

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
  @Default(InformationSharingAgreementAccessGrantAccessLevels.READ)
  @ValidateAttribute({
    isIn: {
      args: [Object.values(InformationSharingAgreementAccessGrantAccessLevels)],
      msg: `Access level must be one of ${Object.values(
        InformationSharingAgreementAccessGrantAccessLevels
      ).join(", ")}`,
    },
  })
  declare accessLevel: CreationOptional<InformationSharingAgreementAccessGrantAccessLevels>

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

  // Helpers
  get selfAndSiblings(): NonAttribute<InformationSharingAgreementAccessGrant[]> {
    if (isUndefined(this.siblings)) {
      throw new Error("Expected siblings association to be pre-loaded.")
    }

    return [this, ...this.siblings]
  }

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

  @HasMany(() => ArchiveItemInformationSharingAgreementAccessGrant, {
    foreignKey: {
      name: "informationSharingAgreementAccessGrantId",
      allowNull: false,
    },
    inverse: "informationSharingAgreementAccessGrant",
  })
  declare archiveItemInformationSharingAgreementAccessGrants?: NonAttribute<
    ArchiveItemInformationSharingAgreementAccessGrant[]
  >

  @BelongsToMany(() => InformationSharingAgreementAccessGrant, {
    through: () => InformationSharingAgreementAccessGrantSibling,
    foreignKey: "informationSharingAgreementAccessGrantId",
    otherKey: "informationSharingAgreementAccessGrantSiblingId",
    inverse: "siblingsOf",
  })
  declare siblings?: NonAttribute<InformationSharingAgreementAccessGrant[]>
  declare siblingsOf?: NonAttribute<InformationSharingAgreementAccessGrant[]>

  // Scopes
  static establishScopes(): void {
    this.addScope("forArchiveItemId", (archiveItemId: number) => {
      return {
        include: [
          {
            association: "archiveItemInformationSharingAgreementAccessGrants",
            attributes: [],
            where: {
              archiveItemId,
            },
          },
        ],
      }
    })
  }
}

export default InformationSharingAgreementAccessGrant
