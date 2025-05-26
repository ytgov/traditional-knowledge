import { Attributes } from "@sequelize/core"

import { Notification } from "@/models"
import BaseService from "@/services/base-service"

export type NotificationUpdateAttributes = Partial<Attributes<Notification>>

export class UpdateService extends BaseService {
  constructor(
    private notification: Notification,
    private attributes: NotificationUpdateAttributes
  ) {
    super()
  }

  async perform() {
    const notification = await this.notification.update(this.attributes)
    return notification
  }
}

export default UpdateService
