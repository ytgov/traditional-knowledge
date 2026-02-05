import { isNil } from "lodash"

import logger from "@/utils/logger"

import BaseController from "@/controllers/base-controller"
import { User } from "@/models"
import { DeactivationPolicy } from "@/policies/users"
import { Users } from "@/serializers"
import { ActivateService, DeactivateService } from "@/services/users"

export class DeactivationController extends BaseController {
  async create() {
    try {
      const user = await this.loadUser()
      if (isNil(user)) {
        return this.response.status(404).json({
          message: "User not found",
        })
      }

      const policy = this.buildPolicy(user)
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to deactivate this user",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const updatedUser = await DeactivateService.perform(
        user,
        permittedAttributes,
        this.currentUser
      )
      const serializedUser = Users.ShowSerializer.perform(updatedUser)
      return this.response.json({
        user: serializedUser,
        policy,
      })
    } catch (error) {
      logger.error(`Failed to deactivate user: ${error}`, { error })
      return this.response.status(422).json({
        message: `Failed to deactivate user: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const user = await this.loadUser()
      if (isNil(user)) {
        return this.response.status(404).json({
          message: "User not found",
        })
      }

      const policy = this.buildPolicy(user)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to activate this user",
        })
      }

      const updatedUser = await ActivateService.perform(user, this.currentUser)
      const serializedUser = Users.ShowSerializer.perform(updatedUser)
      return this.response.json({
        user: serializedUser,
        policy,
      })
    } catch (error) {
      logger.error(`Failed to activate user: ${error}`, { error })
      return this.response.status(422).json({
        message: `Failed to activate user: ${error}`,
      })
    }
  }

  private async loadUser(): Promise<User | null> {
    return User.findByPk(this.params.userId)
  }

  private buildPolicy(user: User): DeactivationPolicy {
    return new DeactivationPolicy(this.currentUser, user)
  }
}
