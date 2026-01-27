import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import db, { User } from "@/models"
import BaseService from "@/services/base-service"
import logger from "@/utils/logger"
import { Users } from "@/services"

export type UserInternalCreationAttributes = Partial<CreationAttributes<User>>

export class CreateInternalService extends BaseService {
  constructor(
    private attributes: UserInternalCreationAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<User> {
    const { email, auth0Subject, firstName, lastName, displayName, ...optionalAttributes } =
      this.attributes

    if (isNil(email)) {
      throw new Error("Email is required")
    }

    if (isNil(firstName)) {
      throw new Error("First name is required")
    }

    if (isNil(lastName)) {
      throw new Error("Last name is required")
    }

    const auth0SubjectOrFallback = auth0Subject || email
    const displayNameOrFallback = displayName || `${firstName} ${lastName}`

    return db.transaction(async () => {
      const user = await User.create({
        ...optionalAttributes,
        email,
        auth0Subject: auth0SubjectOrFallback,
        firstName,
        lastName,
        displayName: displayNameOrFallback,
        roles: [User.Roles.USER],
        isExternal: false,
        createdById: this.currentUser.id,
      })

      await this.safeAttemptDirectorySync(user, this.currentUser)

      return user.reload({
        include: ["adminGroups", "adminInformationSharingAgreementAccessGrants"],
      })
    })
  }

  private async safeAttemptDirectorySync(user: User, currentUser: User) {
    try {
      await Users.DirectorySyncService.perform(user, currentUser)
    } catch (error) {
      logger.info(`Error syncing user ${user.id} with directory: ${error}`, { error })
    }
  }
}

export default CreateInternalService
