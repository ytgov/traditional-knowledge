import { Op } from "@sequelize/core"

import { Group, User, Notification } from "@/models"

import BaseService from "@/services/base-service"
import { Notifications } from "@/services"

export class NotifyAdminsOfRemovedUserService extends BaseService {
  constructor(
    private user: User,
    private group: Group,
    private currentUser: User
  ) {
    super()
  }

  async perform() {
    await this.group.reload({ include: ["adminUsers"] })

    const excludedUserIds = [this.user.id]

    const groupAdmins = this.group.adminUsers ?? []

    const nonExcludedGroupAdmins = groupAdmins.filter(
      (admin) => !excludedUserIds.includes(admin.id)
    )

    nonExcludedGroupAdmins.forEach((admin) => {
      excludedUserIds.push(admin.id)
    })

    const systemAdmins = await User.withScope("isSystemAdmin").findAll({
      where: {
        id: {
          [Op.notIn]: excludedUserIds,
        },
      },
    })

    const { name: groupName } = this.group
    const safeTitle = Notification.sanitizeAttribute(
      "title",
      `User Removed from Group: ${groupName}`
    )

    for (const user of [...systemAdmins, ...nonExcludedGroupAdmins]) {
      await Notifications.CreateService.perform(
        {
          title: safeTitle,
          subtitle: "A user has been removed from a group.",
          href: `/administration/groups/${this.group.id}`,
          userId: user.id,
          sourceType: Notification.SourceTypes.GROUP,
        },
        this.currentUser
      )
    }
  }
}

export default NotifyAdminsOfRemovedUserService
