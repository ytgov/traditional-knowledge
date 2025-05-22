import { Factory } from "fishery"

import { UserGroup } from "@/models"
import { nestedSaveAndAssociateIfNew } from "@/factories/helpers"
import userFactory from "@/factories/user-factory"
import groupFactory from "@/factories/group-factory"

export const userGroupFactory = Factory.define<UserGroup>(({ associations, onCreate }) => {
  onCreate(async (userGroup) => {
    try {
      await nestedSaveAndAssociateIfNew(userGroup)
      return userGroup
    } catch (error) {
      console.error(error)
      throw new Error(
        `Could not create UserGroup with attributes: ${JSON.stringify(userGroup.dataValues, null, 2)}`
      )
    }
  })

  const user =
    associations.user ??
    userFactory.build({
      id: undefined,
    })

  const group =
    associations.group ??
    groupFactory.build({
      id: undefined,
    })

  const creator =
    associations.creator ??
    userFactory.build({
      id: undefined,
    })

  const userGroup = UserGroup.build({
    userId: user.id,
    groupId: group.id,
    creatorId: creator.id,
  })
  userGroup.user = user
  userGroup.group = group
  userGroup.creator = creator
  return userGroup
})

export default userGroupFactory
