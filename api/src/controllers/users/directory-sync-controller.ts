import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"
import { User } from "@/models"
import { UsersPolicy } from "@/policies"
import { Users } from "@/serializers"
import { DirectorySyncService } from "@/services/users"

export class DirectorySyncController extends BaseController<User> {
  async create() {
    try {
      const user = await this.loadUser()
      if (isNil(user)) {
        return this.response.status(404).json({
          message: "User not found",
        })
      }

      const policy = this.buildPolicy(user)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to sync this user",
        })
      }

      const updatedUser = await DirectorySyncService.perform(user, this.currentUser)
      const serializedUser = Users.ShowSerializer.perform(updatedUser)
      return this.response.status(200).json({
        user: serializedUser,
        policy,
      })
    } catch (error) {
      logger.error(`Error syncing user with directory: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error syncing user with directory: ${error}`,
      })
    }
  }

  private async loadUser() {
    return User.findByPk(this.params.userId)
  }

  private buildPolicy(user: User) {
    return new UsersPolicy(this.currentUser, user)
  }
}

export default DirectorySyncController
