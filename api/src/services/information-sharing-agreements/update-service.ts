import { Attributes } from "@sequelize/core"

import db, { InformationSharingAgreement, User } from "@/models"
import BaseService from "@/services/base-service"
import { EnsureAdminAccessService } from "@/services/information-sharing-agreements/admin-access-grants-service"

export type InformationSharingAgreementUpdateAttributes = Partial<
  Attributes<InformationSharingAgreement>
>

export class UpdateService extends BaseService {
  constructor(
    private informationSharingAgreement: InformationSharingAgreement,
    private attributes: InformationSharingAgreementUpdateAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<InformationSharingAgreement> {
    return db.transaction(async () => {
      await this.informationSharingAgreement.update(this.attributes)

      if (
        this.informationSharingAgreement.externalGroupId &&
        this.informationSharingAgreement.externalGroupContactId &&
        this.informationSharingAgreement.internalGroupId &&
        this.informationSharingAgreement.internalGroupContactId
      ) {
        await this.ensureAdminAccessGrants(
          this.informationSharingAgreement.id,
          this.informationSharingAgreement.externalGroupId,
          this.informationSharingAgreement.externalGroupContactId,
          this.informationSharingAgreement.internalGroupId,
          this.informationSharingAgreement.internalGroupContactId,
          this.currentUser
        )
      }

      return this.informationSharingAgreement.reload({
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

export default UpdateService
