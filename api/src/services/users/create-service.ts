import { CreationAttributes } from "@sequelize/core"
import { isNil, random } from "lodash"

import db, { User } from "@/models"
import BaseService from "@/services/base-service"
import logger from "@/utils/logger"
import { Users } from "@/services"

export type UserCreationAttributes = Partial<CreationAttributes<User>>

export class CreateService extends BaseService {
  constructor(
    private attributes: UserCreationAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<User> {
    const { email, auth0Subject, ...optionalAttributes } = this.attributes

    if (isNil(email)) {
      throw new Error("Email is required")
    }

    const auth0SubjectOrFallback = auth0Subject || email

    const [emailLocalPart] = email.split("@")
    /**
     * Yep, if we don't have enough data, your name becomes your email split randomly.
     * This way we can at least have a first name and last name,
     * and the first and last name are likely to be distinct.
     */
    const randomSplit = random(1, emailLocalPart.length - 2)
    const [firstNameFallback, lastNameFallback] = emailLocalPart.includes(".")
      ? emailLocalPart.split(".")
      : [emailLocalPart.slice(0, randomSplit), emailLocalPart.slice(randomSplit)]
    const { firstName, lastName } = optionalAttributes
    const firstNameOrFallback = firstName || firstNameFallback
    const lastNameOrFallback = lastName || lastNameFallback

    return db.transaction(async () => {
      const user = await User.create({
        ...optionalAttributes,
        email,
        auth0Subject: auth0SubjectOrFallback,
        firstName: firstNameOrFallback,
        lastName: lastNameOrFallback,
        displayName: `${firstNameOrFallback} ${lastNameOrFallback}`,
        roles: [User.Roles.USER],
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

export default CreateService
