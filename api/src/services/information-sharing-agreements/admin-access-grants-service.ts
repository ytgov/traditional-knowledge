import { InformationSharingAgreementAccessGrant, User } from "@/models"
import BaseService from "@/services/base-service"

export class EnsureAdminAccessService extends BaseService {
  constructor(
    private informationSharingAgreementId: number,
    private sharingGroupId: number,
    private sharingGroupContactId: number,
    private receivingGroupId: number,
    private receivingGroupContactId: number,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<void> {
    await this.ensureAdminAccessGrantFor(
      this.informationSharingAgreementId,
      this.sharingGroupId,
      this.currentUser.id
    )
    await this.ensureAdminAccessGrantFor(
      this.informationSharingAgreementId,
      this.sharingGroupId,
      this.sharingGroupContactId
    )
    await this.ensureAdminAccessGrantFor(
      this.informationSharingAgreementId,
      this.receivingGroupId,
      this.receivingGroupContactId
    )
  }

  private async ensureAdminAccessGrantFor(
    informationSharingAgreementId: number,
    groupId: number,
    userId: number
  ): Promise<InformationSharingAgreementAccessGrant | void> {
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

export default EnsureAdminAccessService
