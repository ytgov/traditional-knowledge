import { faker } from "@faker-js/faker"
import { Factory } from "fishery"

import { ExternalOrganization } from "@/models"
import { nestedSaveAndAssociateIfNew } from "@/tests/factories/helpers"

export const externalOrganizationFactory = Factory.define<ExternalOrganization>(
  ({ sequence, onCreate }) => {
    onCreate(async (externalOrganization) => {
      try {
        await nestedSaveAndAssociateIfNew(externalOrganization)
        return externalOrganization
      } catch (error) {
        console.error(error)
        throw new Error(
          `Could not create ExternalOrganization with attributes: ${JSON.stringify(
            externalOrganization.dataValues,
            null,
            2
          )}`
        )
      }
    })

    const companyName = faker.company.name()
    const name = `${companyName}-${sequence}`

    return ExternalOrganization.build({
      name,
    })
  }
)

export default externalOrganizationFactory
