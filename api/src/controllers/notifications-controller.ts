import logger from "@/utils/logger"

import { Notification } from "@/models"
import { NotificationsPolicy } from "@/policies"
import BaseController from "@/controllers/base-controller"

export class NotificationsController extends BaseController<Notification> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const scopedNotifications = NotificationsPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedNotifications.count({ where })
      const notifications = await scopedNotifications.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
        order: [["createdAt", "DESC"]],
      })
      return this.response.json({
        notifications,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching notifications: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching notifications: ${error}`,
      })
    }
  }

  async show() {
    try {
      const notification = await this.loadNotification()
      if (!notification) {
        return this.response.status(404).json({
          message: "Notification not found",
        })
      }

      const policy = this.buildPolicy(notification)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this notification",
        })
      }

      return this.response.json({ notification, policy })
    } catch (error) {
      logger.error(`Error fetching notification: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching notification: ${error}`,
      })
    }
  }

  private async loadNotification() {
    return Notification.findByPk(this.params.notificationId)
  }

  private buildPolicy(notification: Notification = Notification.build()) {
    return new NotificationsPolicy(this.currentUser, notification)
  }
}

export default NotificationsController
