import { Attributes } from "@sequelize/core"
import { isNil } from "lodash"

import db, {
  User,
  InformationSharingAgreement,
  InformationSharingAgreementAccessGrant,
} from "@/models"
import BaseService from "@/services/base-service"

export type InformationSharingAgreementCreationAttributes = Partial<
  Attributes<InformationSharingAgreement>
>

export class CreateService extends BaseService {
  constructor(
    private attributes: InformationSharingAgreementCreationAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<InformationSharingAgreement> {
    const {
      title,
      sharingGroupId,
      sharingGroupContactId,
      receivingGroupId,
      receivingGroupContactId,
      startDate,
      endDate,
      ...optionalAttributes
    } = this.attributes

    if (isNil(title)) {
      throw new Error("Title is required")
    }

    if (isNil(sharingGroupId)) {
      throw new Error("Sharing group is required")
    }

    if (isNil(sharingGroupContactId)) {
      throw new Error("Sharing group contact is required")
    }

    if (isNil(receivingGroupId)) {
      throw new Error("Receiving group is required")
    }

    if (isNil(receivingGroupContactId)) {
      throw new Error("Receiving group contact is required")
    }

    if (isNil(startDate)) {
      throw new Error("Start date is required")
    }

    if (isNil(endDate)) {
      throw new Error("End date is required")
    }

    return db.transaction(async () => {
      const informationSharingAgreement = await InformationSharingAgreement.create({
        creatorId: this.currentUser.id,
        title,
        sharingGroupId,
        sharingGroupContactId,
        receivingGroupId,
        receivingGroupContactId,
        startDate,
        endDate,
        ...optionalAttributes,
      })

      await this.ensureAdminAccessGrants(
        informationSharingAgreement.id,
        informationSharingAgreement.sharingGroupId,
        informationSharingAgreement.sharingGroupContactId,
        informationSharingAgreement.receivingGroupId,
        informationSharingAgreement.receivingGroupContactId
      )

      return informationSharingAgreement
    })
  }

  private async ensureAdminAccessGrants(
    informationSharingAgreementId: number,
    sharingGroupId: number,
    sharingGroupContactId: number,
    receivingGroupId: number,
    receivingGroupContactId: number
  ) {
    await this.ensureAdminAccessGrantFor(
      informationSharingAgreementId,
      sharingGroupId,
      this.currentUser.id
    )
    await this.ensureAdminAccessGrantFor(
      informationSharingAgreementId,
      sharingGroupId,
      sharingGroupContactId
    )
    await this.ensureAdminAccessGrantFor(
      informationSharingAgreementId,
      receivingGroupId,
      receivingGroupContactId
    )
  }

  private async ensureAdminAccessGrantFor(
    informationSharingAgreementId: number,
    groupId: number,
    userId: number
  ) {
    const existingAccessGrant = await InformationSharingAgreementAccessGrant.findOne({
      where: {
        informationSharingAgreementId,
        groupId,
        userId,
      },
    })
    if (existingAccessGrant) return

    return InformationSharingAgreementAccessGrant.create({
      informationSharingAgreementId,
      groupId,
      userId,
      accessLevel: InformationSharingAgreementAccessGrant.AccessLevels.ADMIN,
      creatorId: this.currentUser.id,
    })
  }
}

export default CreateService
