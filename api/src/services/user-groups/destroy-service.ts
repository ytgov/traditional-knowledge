import { isUndefined } from "lodash"

import { NotifyUserOfRemovalMailer, NotifyAdminsOfRemovedUserMailer } from "@/mailers/groups"
import db, { UserGroup, User, Group, InformationSharingAgreementAccessGrant } from "@/models"
import BaseService from "@/services/base-service"
import { Notifications } from "@/services"

export class DestroyService extends BaseService {
  private userGroup: UserGroup
  private currentUser: User

  constructor(userGroup: UserGroup, currentUser: User) {
    super()
    this.userGroup = userGroup
    this.currentUser = currentUser
  }

  async perform() {
    if (isUndefined(this.userGroup.user)) {
      throw new Error("Expected user association to be preloaded")
    }

    if (isUndefined(this.userGroup.group)) {
      throw new Error("Expected group association to be preloaded")
    }

    const { user, group } = this.userGroup

    return db.transaction(async () => {
      await this.removeAccessGrantsForGroupMembership(user, group)
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
    await InformationSharingAgreementAccessGrant.destroy({
      where: {
        userId: user.id,
        groupId: group.id,
      },
    })
  }
}

export default DestroyService
