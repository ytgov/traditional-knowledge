import { Op, type Attributes, type FindOptions } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"
import { InformationSharingAgreement, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class InformationSharingAgreementPolicy extends PolicyFactory(InformationSharingAgreement) {
  show(): boolean {
    if (this.user.isSystemAdmin) return true
    if (this.record.hasAccessGrantFor(this.user.id)) return true

    return false
  }

  create(): boolean {
    if (this.user.isSystemAdmin) return true
    if (this.user.isGroupAdminOf(this.record.sharingGroupId)) return true

    return false
  }

  update(): boolean {
    if (this.user.isAdminForInformationSharingAgreement(this.record.id)) return true

    return false
  }

  destroy(): boolean {
    if (this.user.isAdminForInformationSharingAgreement(this.record.id)) return true

    return false
  }

  permittedAttributes(): Path[] {
    return [
      "sharingGroupContactId",
      "receivingGroupContactId",
      "title",
      "description",
      "startDate",
      "endDate",
    ]
  }

  permittedAttributesForCreate(): Path[] {
    return ["sharingGroupId", "receivingGroupId", ...this.permittedAttributes()]
  }

  static policyScope(user: User): FindOptions<Attributes<InformationSharingAgreement>> {
    if (user.isSystemAdmin) {
      return ALL_RECORDS_SCOPE
    }

    // TODO: Allow users to view agreements that they have an associated information sharing agreement access grant for.
    return {
      where: {
        [Op.or]: [
          {
            creatorId: user.id,
          },
          {
            sharingGroupContactId: user.id,
          },
          {
            receivingGroupContactId: user.id,
          },
        ],
      },
    }
  }
}

export default InformationSharingAgreementPolicy
