import { type Attributes, type FindOptions } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"
import { InformationSharingAgreementAccessGrant, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class InformationSharingAgreementAccessGrantPolicy extends PolicyFactory(
  InformationSharingAgreementAccessGrant
) {
  show(): boolean {
    if (this.hasAnyAccess(this.user.id)) return true

    return false
  }

  create(): boolean {
    if (this.hasAdminAccess(this.user.id)) return true

    return false
  }

  update(): boolean {
    if (this.hasAdminAccess(this.user.id)) return true

    return false
  }

  destroy(): boolean {
    if (this.hasAdminAccess(this.user.id)) return true

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
      include: [
        {
          association: "siblings",
          where: {
            userId: user.id,
          },
        },
      ],
    }
  }

  private hasAdminAccess(userId: number): boolean {
    return this.record.selfAndSiblings.some(
      (accessGrant) =>
        accessGrant.userId === userId &&
        accessGrant.accessLevel === InformationSharingAgreementAccessGrant.AccessLevels.ADMIN
    )
  }

  private hasAnyAccess(userId: number): boolean {
    return this.record.selfAndSiblings.some((accessGrant) => accessGrant.userId === userId)
  }
}

export default InformationSharingAgreementAccessGrantPolicy
