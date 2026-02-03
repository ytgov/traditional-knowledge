import { type Attributes, type FindOptions } from "@sequelize/core"

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
    //if (this.user.isGroupAdminOf(this.record.sharingGroupId)) return true

    return false
  }

  update(): boolean {
    if (this.user.isAdminForInformationSharingAgreement(this.record.id)) return true
    if (this.user.isSystemAdmin) return true

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
      "receivingGroupSecondaryContactId",
      "identifier",
      "sharingGroupInfo",
      "receivingGroupInfo",
      "sharingGroupContactName",
      "receivingGroupContactName",
      "sharingGroupContactTitle",
      "receivingGroupContactTitle",
      "sharingGroupSignedBy",
      "receivingGroupSignedBy",
      "sharingGroupSignedDate",
      "receivingGroupSignedDate",
      "title",
      "description",
      "purpose",
      "detailLevel",
      "detailNotes",
      "formats",
      "accessLevel",
      "accessLevelDepartmentRestriction",
      "accessLevelBranchRestriction",
      "accessLevelUnitRestriction",
      "hasAdditionalAccessRestrictions",
      "additionalAccessRestrictions",
      "confidentialityType",
      "authorizedApplication",
      "creditLines",
      "creditNotes",
      "expirationCondition",
      "expirationActions",
      "expirationNotes",
      "breachActions",
      "breachNotes",
      "disclosureNotes",
      "fileName",
      "fileData",
      "fileMimeType",
      "fileSize",
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

    return {
      include: [
        {
          association: "accessGrants",
          where: {
            userId: user.id,
          },
        },
      ],
    }
  }
}

export default InformationSharingAgreementPolicy
