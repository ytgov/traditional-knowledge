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
  Default,
  NotNull,
  PrimaryKey,
  Table,
  ValidateAttribute,
} from "@sequelize/core/decorators-legacy"

import BaseModel from "@/models/base-model"
import InformationSharingAgreement from "@/models/information-sharing-agreement"

export enum AttachmentTargetTypes {
  InformationSharingAgreement = "InformationSharingAgreement",
}

@Table({
  defaultScope: {
    attributes: {
      exclude: ["content"],
    },
  },
})
export class Attachment extends BaseModel<
  InferAttributes<Attachment>,
  InferCreationAttributes<Attachment>
> {
  static readonly TargetTypes = AttachmentTargetTypes

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare targetId: number

  @Attribute(DataTypes.STRING(255))
  @NotNull
  @ValidateAttribute({
    isIn: {
      args: [Object.values(AttachmentTargetTypes)],
      msg: `Target type must be one of: ${Object.values(AttachmentTargetTypes).join(", ")}`,
    },
  })
  declare targetType: AttachmentTargetTypes

  @Attribute(DataTypes.STRING(255))
  @NotNull
  declare name: string

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare size: number

  @Attribute(DataTypes.BLOB)
  @NotNull
  declare content: Buffer

  @Attribute(DataTypes.STRING(255))
  @NotNull
  declare mimeType: string

  @Attribute(DataTypes.STRING(64))
  @NotNull
  declare sha256Checksum: string

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
  /**
   * Defined by {@link InformationSharingAgreement#signedAcknowledgement}
   *
   * NOTE: lookup must include targetType or result will return a random model
   * @example
   * ```ts
   * const attachment = await Attachment.findOne({
   *   where: {
   *     targetType: Attachment.TargetTypes.InformationSharingAgreement,
   *   },
   *   include: ["informationSharingAgreement"],
   * })
   * ```
   */
  declare informationSharingAgreement?: NonAttribute<InformationSharingAgreement>

  get target(): NonAttribute<InformationSharingAgreement | undefined> {
    switch (this.targetType) {
      case AttachmentTargetTypes.InformationSharingAgreement:
        return this.informationSharingAgreement
      default:
        return undefined
    }
  }

  static establishScopes(): void {
    this.addScope("withContent", () => ({
      attributes: {
        include: ["content"],
      },
    }))
  }
}

export default Attachment
