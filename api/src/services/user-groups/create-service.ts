import { Attributes } from "@sequelize/core"
import { isNil } from "lodash"

import Mailers from "@/mailers"
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
        userId,
        groupId,
        creatorId: this.currentUser.id,
      })

      const user = await this.loadUser(userId)
      const group = await this.loadGroup(groupId)
      await this.notifyUserOfMembership(user, group)
      await this.notifyAdminsOfMembership(user, group)

      return userGroup
    })
  }

  private async loadUser(userId: number): Promise<User> {
    const user = await User.findByPk(userId)
    if (isNil(user)) {
      throw new Error(`User with ID ${userId} not found`)
    }
    return user
  }

  private async loadGroup(groupId: number): Promise<Group> {
    const group = await Group.findByPk(groupId)
    if (isNil(group)) {
      throw new Error(`Group with ID ${groupId} not found`)
    }
    return group
  }

  private async notifyUserOfMembership(user: User, group: Group) {
    await Notifications.Groups.NotifyUserOfMembershipService.perform(user, group, this.currentUser)
    await Mailers.Groups.NotifyUserOfMembershipMailer.perform(group, user)
  }

  private async notifyAdminsOfMembership(user: User, group: Group) {
    await Notifications.Groups.NotifyAdminsOfAddedUserService.perform(user, group, this.currentUser)
    await Mailers.Groups.NotifyAdminsOfAddedUserMailer.perform(group, user, this.currentUser)
  }
}

export default CreateService
