import { isUndefined } from "lodash"

import { NotifyUserOfRemovalMailer, NotifyAdminsOfRemovedUserMailer } from "@/mailers/groups"
import db, { UserGroup, User, Group } from "@/models"
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
      await this.notifyUserOfRemoval(user, group)
      await this.notifyAdminsOfRemoval(user, group)
      await this.userGroup.destroy()
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
    await NotifyAdminsOfRemovedUserMailer.perform(group, user)
  }
}

export default DestroyService
