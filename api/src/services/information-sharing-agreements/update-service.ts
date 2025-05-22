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

      await this.ensureAdminAccessGrants(
        this.informationSharingAgreement.id,
        this.informationSharingAgreement.sharingGroupId,
        this.informationSharingAgreement.sharingGroupContactId,
        this.informationSharingAgreement.receivingGroupId,
        this.informationSharingAgreement.receivingGroupContactId,
        this.currentUser
      )

      return this.informationSharingAgreement
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

export default UpdateService
