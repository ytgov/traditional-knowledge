import { Attributes } from "@sequelize/core"
import { isNil } from "lodash"

import { NotifyUserOfMembershipMailer, NotifyAdminsOfAddedUserMailer } from "@/mailers/groups"
import db, { Group, User, UserGroup } from "@/models"
import BaseService from "@/services/base-service"
import { Notifications } from "@/services"

export type UserGroupCreationAttributes = Partial<Attributes<UserGroup>>

export class CreateService extends BaseService {
  constructor(
    private attributes: UserGroupCreationAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<UserGroup> {
    const { userId, groupId, ...optionalAttributes } = this.attributes

    if (isNil(userId)) {
      throw new Error("User ID is required")
    }

    if (isNil(groupId)) {
      throw new Error("Group ID is required")
    }

    return db.transaction(async () => {
      const userGroup = await UserGroup.create({
        ...optionalAttributes,
        creatorId: this.currentUser.id,
        userId,
        groupId,
      })

      const user = await User.findByPk(userId)
      const group = await Group.findByPk(groupId)

      if (isNil(user)) {
        throw new Error("User not found")
      }

      if (isNil(group)) {
        throw new Error("Group not found")
      }

      await this.notifyUserOfMembership(user, group)
      await this.notifyAdminsOfMembership(user, group)

      return userGroup
    })
  }

  private async notifyUserOfMembership(user: User, group: Group) {
    await Notifications.Groups.NotifyUserOfMembershipService.perform(user, group, this.currentUser)
    await NotifyUserOfMembershipMailer.perform(group, user)
  }

  private async notifyAdminsOfMembership(user: User, group: Group) {
    await Notifications.Groups.NotifyAdminsOfAddedUserService.perform(user, group, this.currentUser)
    await NotifyAdminsOfAddedUserMailer.perform(group, user)
  }
}

export default CreateService
