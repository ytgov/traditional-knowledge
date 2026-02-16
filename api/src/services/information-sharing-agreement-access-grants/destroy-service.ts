import db, { InformationSharingAgreementAccessGrant, User, UserGroup } from "@/models"
import BaseService from "@/services/base-service"
import { UserGroups } from "@/services"

export class DestroyService extends BaseService {
  constructor(
    private informationSharingAgreementAccessGrant: InformationSharingAgreementAccessGrant,
    private currentUser: User,
    private options: {
      skipUserGroupRemoval?: boolean
    } = {}
  ) {
    super()
  }

  async perform() {
    const { informationSharingAgreementId, groupId, userId } =
      this.informationSharingAgreementAccessGrant

    return db.transaction(async () => {
      await this.informationSharingAgreementAccessGrant.destroy()

      if (!this.options.skipUserGroupRemoval) {
        await this.removeUserGroupMembershipIfNoRemainingGrants(
          informationSharingAgreementId,
          groupId,
          userId
        )
      }
    })
  }

  private async removeUserGroupMembershipIfNoRemainingGrants(
    informationSharingAgreementId: number,
    groupId: number,
    userId: number
  ): Promise<void> {
    const remainingGrantCount = await InformationSharingAgreementAccessGrant.count({
      where: {
        informationSharingAgreementId,
        userId,
        groupId,
      },
    })
    if (remainingGrantCount > 0) return

    await UserGroup.findEach(
      {
        where: {
          userId,
          groupId,
        },
        include: ["user", "group"],
      },
      async (userGroup) => {
        await UserGroups.DestroyService.perform(userGroup, this.currentUser, {
          skipAccessGrantRemoval: true,
        })
      }
    )
  }
}

export default DestroyService
