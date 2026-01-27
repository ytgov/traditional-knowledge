import { CreationAttributes } from "@sequelize/core"

import { User } from "@/models"
import BaseService from "@/services/base-service"
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
    const { isExternal } = this.attributes

    if (isExternal) {
      return Users.CreateExternalService.perform(this.attributes, this.currentUser)
    }

    return Users.CreateInternalService.perform(this.attributes, this.currentUser)
  }
}

export default CreateService
