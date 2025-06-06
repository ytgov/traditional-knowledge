import { isNil, isUndefined } from "lodash"

import logger from "@/utils/logger"
import { Group, User, UserGroup } from "@/models"
import { UserGroupPolicy } from "@/policies"
import { CreateService, DestroyService } from "@/services/user-groups"
import BaseController from "@/controllers/base-controller"

export class UserGroupsController extends BaseController<UserGroup> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder()

      const scopedUserGroups = UserGroupPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedUserGroups.count({ where })
      const userGroups = await scopedUserGroups.findAll({
        where,
        order,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
        include: ["user"],
      })
      return this.response.json({
        userGroups,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching user groups: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching user groups: ${error}`,
      })
    }
  }

  async show() {
    try {
      const userGroup = await this.loadUserGroup()
      if (isNil(userGroup)) {
        return this.response.status(404).json({
          message: "User group not found",
        })
      }

      const policy = this.buildPolicy(userGroup)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this user group",
        })
      }

      return this.response.json({
        userGroup,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching user group: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching user group: ${error}`,
      })
    }
  }

  async create() {
    try {
      const newUserGroup = await this.buildUserGroup()
      const policy = this.buildPolicy(newUserGroup)
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create user groups",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)

      if (isUndefined(newUserGroup.user)) {
        throw new Error("Expected user association to be preloaded")
      }

      if (isUndefined(newUserGroup.group)) {
        throw new Error("Expected group association to be preloaded")
      }

      const userGroup = await CreateService.perform(
        permittedAttributes,
        newUserGroup.user,
        newUserGroup.group,
        this.currentUser
      )
      return this.response.status(201).json({
        userGroup,
      })
    } catch (error) {
      logger.error(`Error creating user group: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating user group: ${error}`,
      })
    }
  }

  async update() {
    try {
      const userGroup = await this.loadUserGroup()
      if (isNil(userGroup)) {
        return this.response.status(404).json({
          message: "User group not found",
        })
      }

      const policy = this.buildPolicy(userGroup)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this user group",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      await userGroup.update(permittedAttributes)
      return this.response.json({
        userGroup,
      })
    } catch (error) {
      logger.error(`Error updating user group: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error updating user group: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const userGroup = await this.loadUserGroup()
      if (isNil(userGroup)) {
        return this.response.status(404).json({
          message: "User group not found",
        })
      }

      const policy = this.buildPolicy(userGroup)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this user group",
        })
      }

      await DestroyService.perform(userGroup, this.currentUser)
      return this.response.status(204).send({ message: "User group was deleted" })
    } catch (error) {
      logger.error(`Error deleting user group: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error deleting user group: ${error}`,
      })
    }
  }

  private async loadUserGroup() {
    return UserGroup.findByPk(this.params.userGroupId, {
      include: ["user", "group"],
    })
  }

  private async buildUserGroup() {
    const userGroup = UserGroup.build(this.request.body)

    const user = await User.findByPk(userGroup.userId, {
      rejectOnEmpty: true,
    })

    userGroup.user = user

    const group = await Group.findByPk(userGroup.groupId, {
      rejectOnEmpty: true,
    })

    userGroup.group = group

    return userGroup
  }

  private buildPolicy(group: UserGroup) {
    return new UserGroupPolicy(this.currentUser, group)
  }
}

export default UserGroupsController
