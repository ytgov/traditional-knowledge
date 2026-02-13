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
        ...optionalAttributes,
        creatorId: this.currentUser.id,
        title,
        status: InformationSharingAgreement.Status.DRAFT,
      })

      if (
        !isNil(informationSharingAgreement.externalGroupId) &&
        !isNil(informationSharingAgreement.externalGroupContactId) &&
        !isNil(informationSharingAgreement.internalGroupId) &&
        !isNil(informationSharingAgreement.internalGroupContactId)
      ) {
        await this.ensureAdminAccessGrants(
          informationSharingAgreement.id,
          informationSharingAgreement.externalGroupId,
          informationSharingAgreement.externalGroupContactId,
          informationSharingAgreement.internalGroupId,
          informationSharingAgreement.internalGroupContactId,
          this.currentUser
        )
      }

      return informationSharingAgreement.reload({
        include: ["accessGrants", "signedAcknowledgement"],
      })
    })
  }

  private async ensureAdminAccessGrants(
    informationSharingAgreementId: number,
    externalGroupId: number,
    externalGroupContactId: number,
    internalGroupId: number,
    internalGroupContactId: number,
    currentUser: User
  ) {
    await EnsureAdminAccessService.perform(
      informationSharingAgreementId,
      externalGroupId,
      externalGroupContactId,
      internalGroupId,
      internalGroupContactId,
      currentUser
    )
  }
}

export default CreateService
