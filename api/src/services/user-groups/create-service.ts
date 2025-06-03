import { Attributes } from "@sequelize/core"
import { isNil, isUndefined } from "lodash"

import { NotifyUserOfMembershipMailer, NotifyAdminsOfAddedUserMailer } from "@/mailers/groups"
import db, { Group, User, UserGroup } from "@/models"
import BaseService from "@/services/base-service"
import { Notifications } from "@/services"

export type UserGroupCreationAttributes = Partial<Attributes<UserGroup>>

export class CreateService extends BaseService {
  constructor(
    private attributes: UserGroupCreationAttributes,
    private user: User,
    private group: Group,
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

    if (isUndefined(this.user)) {
      throw new Error("Expected user association to be preloaded")
    }

    if (isUndefined(this.group)) {
      throw new Error("Expected group association to be preloaded")
    }

    return db.transaction(async () => {
      const userGroup = await UserGroup.create({
        ...optionalAttributes,
        creatorId: this.currentUser.id,
        userId,
        groupId,
      })

      await this.notifyUserOfMembership(this.user, this.group)
      await this.notifyAdminsOfMembership(this.user, this.group)

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
