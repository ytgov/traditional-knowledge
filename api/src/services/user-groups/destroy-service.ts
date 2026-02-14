import { isUndefined } from "lodash"

import { NotifyUserOfRemovalMailer, NotifyAdminsOfRemovedUserMailer } from "@/mailers/groups"
import db, { UserGroup, User, Group, InformationSharingAgreementAccessGrant } from "@/models"
import BaseService from "@/services/base-service"
import { Notifications, InformationSharingAgreementAccessGrants } from "@/services"

export class DestroyService extends BaseService {
  constructor(
    private userGroup: UserGroup,
    private currentUser: User,
    private options: {
      skipAccessGrantRemoval?: boolean
    } = {}
  ) {
    super()
  }

  async perform() {
    const { user, group } = this.userGroup

    if (isUndefined(user)) {
      throw new Error("Expected user association to be preloaded")
    }

    if (isUndefined(group)) {
      throw new Error("Expected group association to be preloaded")
    }

    return db.transaction(async () => {
      if (!this.options.skipAccessGrantRemoval) {
        await this.removeAccessGrantsForGroupMembership(user, group)
      }

      await this.userGroup.destroy()

      await this.notifyUserOfRemoval(user, group)
      await this.notifyAdminsOfRemoval(user, group)
    })
  }

  private async notifyUserOfRemoval(user: User, group: Group) {
    await Notifications.Groups.NotifyUserOfRemovalService.perform(user, group, this.currentUser)
    await NotifyUserOfRemovalMailer.perform(group, user)
  }

  private async notifyAdminsOfRemoval(user: User, group: Group) {
    await Notifications.Groups.NotifyAdminsOfRemovedUserService.perform(
      user,
      group,
      this.currentUser
    )
    await NotifyAdminsOfRemovedUserMailer.perform(group, user, this.currentUser)
  }

  private async removeAccessGrantsForGroupMembership(user: User, group: Group) {
    await InformationSharingAgreementAccessGrant.findEach(
      {
        where: {
          userId: user.id,
          groupId: group.id,
        },
      },
      async (accessGrant) => {
        await InformationSharingAgreementAccessGrants.DestroyService.perform(
          accessGrant,
          this.currentUser,
          { skipUserGroupRemoval: true }
        )
      }
    )
  }
}

export default DestroyService
