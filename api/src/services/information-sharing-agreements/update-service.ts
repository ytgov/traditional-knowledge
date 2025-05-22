import { Attributes } from "@sequelize/core"

import db, {
  InformationSharingAgreement,
  InformationSharingAgreementAccessGrant,
  User,
} from "@/models"
import BaseService from "@/services/base-service"

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
        this.informationSharingAgreement.receivingGroupContactId
      )

      return this.informationSharingAgreement
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

export default UpdateService
