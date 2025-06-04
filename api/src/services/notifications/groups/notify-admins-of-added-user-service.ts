import { Op } from "@sequelize/core"

import { Group, User, Notification } from "@/models"

import BaseService from "@/services/base-service"
import { Notifications } from "@/services"

export class NotifyAdminsOfAddedUserService extends BaseService {
  constructor(
    private user: User,
    private group: Group,
    private currentUser: User
  ) {
    super()
  }

  async perform() {
    await this.group.reload({ include: ["adminUsers"] })

    const groupAdmins = this.group.adminUsers ?? []

    const excludedUserIds = groupAdmins.map((user) => user.id)
    excludedUserIds.push(this.currentUser.id)
    excludedUserIds.push(this.user.id)

    const systemAdmins = await User.withScope("isSystemAdmin").findAll({
      where: {
        id: {
          [Op.notIn]: excludedUserIds,
        },
      },
    })

    const { name: groupName } = this.group
    const safeTitle = Notification.sanitizeAttribute("title", `User Added to Group: ${groupName}`)

    for (const user of [...systemAdmins, ...groupAdmins]) {
      await Notifications.CreateService.perform(
        {
          title: safeTitle,
          subtitle: "A user has been added to a group.",
          href: `/administration/groups/${this.group.id}`,
          userId: user.id,
          sourceType: Notification.SourceTypes.GROUP,
        },
        this.currentUser
      )
    }
  }
}

export default NotifyAdminsOfAddedUserService
