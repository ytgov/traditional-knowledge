import { faker } from "@faker-js/faker"
import { Factory } from "fishery"

import acronymize from "@/utils/acronymize"

import { Group } from "@/models"
import { nestedSaveAndAssociateIfNew } from "@/factories/helpers"
import userFactory from "@/factories/user-factory"

export const groupFactory = Factory.define<Group>(({ sequence, associations, onCreate }) => {
  onCreate(async (group) => {
    try {
      await nestedSaveAndAssociateIfNew(group)
      return group
    } catch (error) {
      console.error(error)
      throw new Error(
        `Could not create Group with attributes: ${JSON.stringify(group.dataValues, null, 2)}`
      )
    }
  })

  const creator =
    associations.creator ??
    userFactory.build({
      id: undefined,
    })

  const companyName = faker.company.name()
  const name = `${companyName}-${sequence}`
  const acronym = acronymize(name)
  const group = Group.build({
    name,
    acronym,
    creatorId: creator.id,
  })
  group.creator = creator
  return group
})

export default groupFactory
