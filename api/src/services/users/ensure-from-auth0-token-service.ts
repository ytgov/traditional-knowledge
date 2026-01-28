import { Includeable } from "@sequelize/core"
import { isNil } from "lodash"

import { auth0Integration } from "@/integrations"
import { User } from "@/models"
import BaseService from "@/services/base-service"
import CreateService from "@/services/users/create-service"

export class EnsureFromAuth0TokenService extends BaseService {
  constructor(
    private token: string,
    private include?: Includeable | Includeable[]
  ) {
    super()
  }

  async perform(): Promise<User> {
    const { auth0Subject, email, firstName, lastName } = await auth0Integration.getUserInfo(
      this.token
    )

    const existingUser = await User.findOne({
      where: { auth0Subject },
      include: this.include,
    })

    if (!isNil(existingUser) && !isNil(existingUser.deactivatedAt)) {
      throw new Error("User is deactivated.")
    } else if (!isNil(existingUser)) {
      return existingUser
    }

    const firstTimeUser = await User.findOne({
      where: { auth0Subject: email },
      include: this.include,
    })
    if (!isNil(firstTimeUser) && !isNil(firstTimeUser.deactivatedAt)) {
      throw new Error("User is deactivated.")
    } else if (!isNil(firstTimeUser)) {
      await firstTimeUser.update({ auth0Subject })
      return firstTimeUser
    }

    const systemUser = await User.findOne({
      where: {
        email: "system.user@yukon.ca",
      },
      rejectOnEmpty: true,
    })

    const newUser = await CreateService.perform(
      {
        auth0Subject,
        email,
        firstName,
        lastName,
      },
      systemUser,
      { syncWithDirectory: true }
    )
    return newUser.reload({
      include: this.include,
    })
  }
}

export default EnsureFromAuth0TokenService
