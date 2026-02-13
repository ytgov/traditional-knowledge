import { InformationSharingAgreementAccessGrant, User } from "@/models"
import BaseService from "@/services/base-service"

export class EnsureAdminAccessService extends BaseService {
  constructor(
    private informationSharingAgreementId: number,
    private externalGroupId: number,
    private externalGroupContactId: number,
    private internalGroupId: number,
    private internalGroupContactId: number,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<void> {
    await this.ensureAdminAccessGrantFor(
      this.informationSharingAgreementId,
      this.externalGroupId,
      this.currentUser.id
    )
    await this.ensureAdminAccessGrantFor(
      this.informationSharingAgreementId,
      this.externalGroupId,
      this.externalGroupContactId
    )
    await this.ensureAdminAccessGrantFor(
      this.informationSharingAgreementId,
      this.internalGroupId,
      this.internalGroupContactId
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
