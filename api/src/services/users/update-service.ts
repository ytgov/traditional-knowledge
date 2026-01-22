import { Attributes } from "@sequelize/core"

import db, { User } from "@/models"
import BaseService from "@/services/base-service"

export type UserUpdateAttributes = Partial<Attributes<User>>

export class UpdateService extends BaseService {
  constructor(
    private user: User,
    private attributes: UserUpdateAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<User> {
    return db.transaction(async () => {
      await this.user.update(this.attributes)
      return this.user.reload({
        include: ["adminGroups", "adminInformationSharingAgreementAccessGrants"],
      })
    })
  }
}

export default UpdateService
