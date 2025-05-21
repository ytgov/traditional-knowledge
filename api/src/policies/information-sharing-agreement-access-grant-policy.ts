import { Op, type Attributes, type FindOptions } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"
import { InformationSharingAgreementAccessGrant, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class InformationSharingAgreementAccessGrantPolicy extends PolicyFactory(
  InformationSharingAgreementAccessGrant
) {
  show(): boolean {
    // TODO: add ability for information sharing agreement owners to view access grants
    if (this.record.userId === this.user.id) return true

    return false
  }

  create(): boolean {
    // TODO: add ability for information sharing agreement owners to create access grants

    return false
  }

  update(): boolean {
    // TODO: add ability for information sharing agreement owners to update access grants

    return false
  }

  destroy(): boolean {
    // TODO: add ability for information sharing agreement owners to remove access grants

    return false
  }

  permittedAttributes(): Path[] {
    return ["accessLevel", "userId"]
  }

  permittedAttributesForCreate(): Path[] {
    return ["informationSharingAgreementId", "groupId", ...this.permittedAttributes()]
  }

  static policyScope(user: User): FindOptions<Attributes<InformationSharingAgreementAccessGrant>> {
    if (user.isSystemAdmin) return ALL_RECORDS_SCOPE

    return {
      where: {
        [Op.or]: [
          { creatorId: user.id },
          { userId: user.id },
          // TODO: implement group access
        ],
      },
    }
  }
}

export default InformationSharingAgreementAccessGrantPolicy
