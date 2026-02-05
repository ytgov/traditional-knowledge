import { Attributes, FindOptions } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"

import { ExternalOrganization, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class ExternalOrganizationPolicy extends PolicyFactory(ExternalOrganization) {
  show(): boolean {
    return true
  }

  create(): boolean {
    if (this.user.isSystemAdmin) return true

    return false
  }

  update(): boolean {
    if (this.user.isSystemAdmin) return true

    return false
  }

  destroy(): boolean {
    if (this.user.isSystemAdmin) return true

    return false
  }

  permittedAttributes(): Path[] {
    return ["name"]
  }

  permittedAttributesForCreate(): Path[] {
    return [...this.permittedAttributes()]
  }

  static policyScope(_user: User): FindOptions<Attributes<ExternalOrganization>> {
    return ALL_RECORDS_SCOPE
  }
}
