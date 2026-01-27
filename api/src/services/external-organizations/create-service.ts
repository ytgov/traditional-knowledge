import { Attributes } from "@sequelize/core"
import { isNil } from "lodash"

import { ExternalOrganization, User } from "@/models"
import BaseService from "@/services/base-service"

export type ExternalOrganizationCreationAttributes = Partial<Attributes<ExternalOrganization>>

export class CreateService extends BaseService {
  constructor(
    private attributes: ExternalOrganizationCreationAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<ExternalOrganization> {
    const { name, ...optionalAttributes } = this.attributes

    if (isNil(name)) {
      throw new Error("Organization name is required")
    }

    const externalOrganization = await ExternalOrganization.create({
      ...optionalAttributes,
      name,
    })
    return externalOrganization
  }
}

export default CreateService
