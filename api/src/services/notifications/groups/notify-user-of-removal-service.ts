import { Group, User, Notification } from "@/models"

import BaseService from "@/services/base-service"
import { Notifications } from "@/services"

export class NotifyUserOfRemovalService extends BaseService {
  constructor(
    private user: User,
    private group: Group,
    private currentUser: User
  ) {
    super()
  }

  async perform() {
    const { name: groupName } = this.group
    const safeTitle = Notification.sanitizeAttribute("title", `Group Removed: ${groupName}`)
    await Notifications.CreateService.perform(
      {
        title: safeTitle,
        subtitle: "You have been removed from a group.",
        href: `/administration/groups/${this.group.id}`,
        userId: this.user.id,
        sourceType: Notification.SourceTypes.GROUP,
      },
      this.currentUser
    )
  }
}

export default NotifyUserOfRemovalService
