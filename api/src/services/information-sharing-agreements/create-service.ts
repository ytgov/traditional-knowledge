import { Attributes } from "@sequelize/core"
import { isNil } from "lodash"

import db, { User, InformationSharingAgreement } from "@/models"
import BaseService from "@/services/base-service"
import { EnsureAdminAccessService } from "@/services/information-sharing-agreements/admin-access-grants-service"

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
    const { title, ...optionalAttributes } = this.attributes

    if (isNil(title)) {
      throw new Error("Title is required")
    }

    return db.transaction(async () => {
      const informationSharingAgreement = await InformationSharingAgreement.create({
        creatorId: this.currentUser.id,
        title,
        ...optionalAttributes,
      })

      if (
        !isNil(informationSharingAgreement.sharingGroupId) &&
        !isNil(informationSharingAgreement.sharingGroupContactId) &&
        !isNil(informationSharingAgreement.receivingGroupId) &&
        !isNil(informationSharingAgreement.receivingGroupContactId)
      ) {
        await this.ensureAdminAccessGrants(
          informationSharingAgreement.id,
          informationSharingAgreement.sharingGroupId,
          informationSharingAgreement.sharingGroupContactId,
          informationSharingAgreement.receivingGroupId,
          informationSharingAgreement.receivingGroupContactId,
          this.currentUser
        )
      }

      return informationSharingAgreement
    })
  }

  private async ensureAdminAccessGrants(
    informationSharingAgreementId: number,
    sharingGroupId: number,
    sharingGroupContactId: number,
    receivingGroupId: number,
    receivingGroupContactId: number,
    currentUser: User
  ) {
    await EnsureAdminAccessService.perform(
      informationSharingAgreementId,
      sharingGroupId,
      sharingGroupContactId,
      receivingGroupId,
      receivingGroupContactId,
      currentUser
    )
  }
}

export default CreateService
