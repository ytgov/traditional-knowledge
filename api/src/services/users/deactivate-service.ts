import { type Attributes } from "@sequelize/core"
import { isEmpty, isNil } from "lodash"

import logger from "@/utils/logger"

import { User } from "@/models"
import BaseService from "@/services/base-service"

export type UserDeactivationAttributes = Partial<Attributes<User>>

export class DeactivateService extends BaseService {
  constructor(
    private user: User,
    private attributes: UserDeactivationAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<User> {
    if (!isNil(this.user.deactivatedAt)) {
      throw new Error("User is already deactivated")
    }

    if (this.user.id === this.currentUser.id) {
      throw new Error("Cannot deactivate self")
    }

    const { deactivationReason } = this.attributes

    if (isNil(deactivationReason) || isEmpty(deactivationReason.trim())) {
      throw new Error("Reason is required when deactivating a user")
    }

    await this.user.update({
      deactivatedAt: new Date(),
      deactivationReason: deactivationReason.trim(),
    })

    logger.info(
      `User ${this.user.id} deactivated by ${this.currentUser.id} at ${this.user.deactivatedAt} for ${this.user.deactivationReason}`
    )

    return this.user.reload({
      include: ["adminGroups", "adminInformationSharingAgreementAccessGrants"],
    })
  }
}

export default DeactivateService
