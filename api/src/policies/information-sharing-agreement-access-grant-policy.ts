import { Op, type Attributes, type FindOptions } from "@sequelize/core"
import { isUndefined } from "lodash"

import { type Path } from "@/utils/deep-pick"
import { InformationSharingAgreement, InformationSharingAgreementAccessGrant, User } from "@/models"
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
    if (this.hasAdminAccess(this.user.id)) return true

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

  private hasAdminAccess(userId: number): boolean {
    const { accessGrants } = this.informationSharingAgreement
    if (isUndefined(accessGrants)) {
      throw new Error("Expected access grants association to be pre-loaded.")
    }

    return accessGrants.some(
      (accessGrant) =>
        accessGrant.userId === userId &&
        accessGrant.accessLevel === InformationSharingAgreementAccessGrant.AccessLevels.ADMIN
    )
  }

  private get informationSharingAgreement(): InformationSharingAgreement {
    const { informationSharingAgreement } = this.record
    if (isUndefined(informationSharingAgreement)) {
      throw new Error("Expected information sharing agreement association to be pre-loaded.")
    }

    return informationSharingAgreement
  }
}

export default InformationSharingAgreementAccessGrantPolicy
