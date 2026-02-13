import { type Attributes, type WhereOptions } from "@sequelize/core"
import { isNil } from "lodash"

import Mailers from "@/mailers"
import db, {
  Group,
  InformationSharingAgreement,
  InformationSharingAgreementAccessGrant,
  User,
  UserGroup,
} from "@/models"
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

      await this.createAccessGrantsForGroupMembership(userGroup, user, group)

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

  private async createAccessGrantsForGroupMembership(
    userGroup: UserGroup,
    user: User,
    group: Group
  ) {
    const where: WhereOptions<InformationSharingAgreement> = {}
    if (group.isExternal) {
      where.externalGroupId = group.id
    } else {
      where.internalGroupId = group.id
    }
    await InformationSharingAgreement.findEach(
      {
        where,
      },
      async (informationSharingAgreement) => {
        await this.ensureAccessGrantFor(
          informationSharingAgreement.id,
          group.id,
          user.id,
          userGroup.isAdmin,
          group.isExternal
        )
      }
    )
  }

  private async ensureAccessGrantFor(
    informationSharingAgreementId: number,
    groupId: number,
    userId: number,
    isAdmin: boolean,
    isExternalGroup: boolean
  ): Promise<InformationSharingAgreementAccessGrant | void> {
    // TODO: reflect if this should just be a "create" operation?
    const existingAccessGrant = await InformationSharingAgreementAccessGrant.findOne({
      where: {
        informationSharingAgreementId,
        groupId,
        userId,
      },
    })
    if (existingAccessGrant) return

    const accessLevel = InformationSharingAgreementAccessGrant.defaultAccessLevelFor(
      isAdmin,
      isExternalGroup
    )
    return InformationSharingAgreementAccessGrant.create({
      informationSharingAgreementId,
      groupId,
      userId,
      accessLevel,
      creatorId: this.currentUser.id,
    })
  }
}

export default CreateService
