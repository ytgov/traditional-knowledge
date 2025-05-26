import { isNil } from "lodash"

import logger from "@/utils/logger"

import { Notification } from "@/models"
import { Notifications } from "@/policies"
import BaseController from "@/controllers/base-controller"

export class ReadController extends BaseController<Notification> {
  async create() {
    try {
      const notification = await this.loadNotification()
      if (isNil(notification)) {
        return this.response.status(404).json({
          message: "Notification not found",
        })
      }

      const policy = this.buildPolicy(notification)
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to read this notification",
        })
      }

      await notification.update({ readAt: new Date() })

      return this.response.status(201).json({
        notification,
      })
    } catch (error) {
      logger.error(`Error reading notification: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error reading notification: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const notification = await this.loadNotification()
      if (isNil(notification)) {
        return this.response.status(404).json({
          message: "Notification not found",
        })
      }

      const policy = this.buildPolicy(notification)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to unread this notification",
        })
      }

      await notification.update({ readAt: null })

      return this.response.status(204).json({
        notification,
      })
    } catch (error) {
      logger.error(`Error unread notification: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error unread notification: ${error}`,
      })
    }
  }

  private async loadNotification() {
    return Notification.findByPk(this.params.notificationId)
  }

  private buildPolicy(notification: Notification = Notification.build()) {
    return new Notifications.ReadPolicy(this.currentUser, notification)
  }
}

export default ReadController
