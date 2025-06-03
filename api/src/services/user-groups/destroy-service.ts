import { isNil } from "lodash"

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
    return db.transaction(async () => {
      const user = await User.findByPk(this.userGroup.userId)
      const group = await Group.findByPk(this.userGroup.groupId)

      if (isNil(user)) {
        throw new Error("User not found")
      }

      if (isNil(group)) {
        throw new Error("Group not found")
      }

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
