import { faker } from "@faker-js/faker"
import { Factory } from "fishery"

import { InformationSharingAgreement } from "@/models"
import { nestedSaveAndAssociateIfNew } from "@/factories/helpers"
import userFactory from "@/factories/user-factory"

export const informationSharingAgreementFactory = Factory.define<InformationSharingAgreement>(
  ({ sequence, params, associations, onCreate }) => {
    onCreate(async (agreement) => {
      try {
        await nestedSaveAndAssociateIfNew(agreement)
        return agreement
      } catch (error) {
        console.error(error)
        throw new Error(
          `Could not create InformationSharingAgreement with attributes: ${JSON.stringify(agreement.dataValues, null, 2)}`
        )
      }
    })

    const creator =
      associations.creator ??
      userFactory.build({
        id: params.creatorId,
      })

    const sentence = faker.lorem.sentence()
    const title = `${sentence}-${sequence}`

    const agreement = InformationSharingAgreement.build({
      title,
      creatorId: creator.id,
    })

    agreement.creator = creator

    return agreement
  }
)

export default informationSharingAgreementFactory
