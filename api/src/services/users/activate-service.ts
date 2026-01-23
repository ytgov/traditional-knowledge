import { isNil } from "lodash"

import logger from "@/utils/logger"

import { User } from "@/models"
import BaseService from "@/services/base-service"

export class ActivateService extends BaseService {
  constructor(
    private user: User,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<User> {
    if (isNil(this.user.deactivatedAt)) {
      throw new Error("User is already active")
    }

    await this.user.update({
      deactivatedAt: null,
      deactivationReason: null,
    })

    logger.info(`User ${this.user.id} activated by ${this.currentUser.id} at ${new Date()}`)

    return this.user.reload({
      include: ["adminGroups", "adminInformationSharingAgreementAccessGrants"],
    })
  }
}

export default ActivateService
