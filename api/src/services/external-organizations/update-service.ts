import { Attributes } from "@sequelize/core"

import { ExternalOrganization, User } from "@/models"
import BaseService from "@/services/base-service"

export type ExternalOrganizationUpdateAttributes = Partial<Attributes<ExternalOrganization>>

export class UpdateService extends BaseService {
  constructor(
    private externalOrganization: ExternalOrganization,
    private attributes: ExternalOrganizationUpdateAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<ExternalOrganization> {
    return this.externalOrganization.update(this.attributes)
  }
}

export default UpdateService
