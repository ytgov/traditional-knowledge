import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import logger from "@/utils/logger"
import { User } from "@/models"
import BaseService from "@/services/base-service"
import { Notifications, Users } from "@/services"
import { Users as UsersMailers } from "@/mailers"

export type UserCreationAttributes = Partial<CreationAttributes<User>>

export class CreateService extends BaseService {
  constructor(
    private attributes: UserCreationAttributes,
    private currentUser: User,
    private options?: {
      syncWithDirectory?: boolean
    }
  ) {
    super()
  }

  async perform(): Promise<User> {
    this.assertRolesAreGrantable()
    await this.assertEmailIsAvailable()

    const { isExternal } = this.attributes

    const user = isExternal
      ? await Users.CreateExternalService.perform(this.attributes, this.currentUser)
      : await Users.CreateInternalService.perform(this.attributes, this.currentUser, this.options)

    await this.safeAttemptNotifyAdmins(user)

    return user
  }

  private assertRolesAreGrantable(): void {
    const { roles } = this.attributes
    if (isNil(roles)) return

    const ungrantableRole = roles.find((role) => !this.currentUser.canGrantRole(role))
    if (!isNil(ungrantableRole)) {
      throw new Error(`You are not authorized to grant the ${ungrantableRole} role`)
    }
  }

  /**
   * The email and auth0_subject unique indexes exclude soft-deleted rows but not
   * deactivated ones, so re-adding an existing person otherwise surfaces as a raw
   * database constraint error. Fail early with copy an admin can act on, and point
   * them at reactivation when the person is only deactivated. See TK-102.
   */
  private async assertEmailIsAvailable(): Promise<void> {
    const { email } = this.attributes
    if (isNil(email)) return

    const existingUser = await User.findOne({ where: { email } })
    if (isNil(existingUser)) return

    if (isNil(existingUser.deactivatedAt)) {
      throw new Error(`A user with the email ${email} already exists.`)
    }

    throw new Error(
      `A user with the email ${email} already exists but is deactivated. ` +
        `Reactivate that user instead of creating a new one.`
    )
  }

  /**
   * Telling admins is not worth failing the creation over, and it runs outside the
   * creation transaction so a notification error cannot roll the new user back.
   * See TK-6.
   */
  private async safeAttemptNotifyAdmins(user: User): Promise<void> {
    try {
      await Notifications.Users.NotifyAdminsOfCreatedUserService.perform(user, this.currentUser)
      await UsersMailers.NotifyAdminsOfCreatedUserMailer.perform(user, this.currentUser)
    } catch (error) {
      logger.error(`Failed to notify admins of created user ${user.id}: ${error}`, { error })
    }
  }
}

export default CreateService
