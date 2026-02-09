import { type Attributes, type FindOptions, Op, sql } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"
import { InformationSharingAgreement, User } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"

export class InformationSharingAgreementPolicy extends PolicyFactory(InformationSharingAgreement) {
  show(): boolean {
    if (this.record.isDraft() && this.user.id === this.record.creatorId) return true
    if (!this.record.isDraft() && this.user.isSystemAdmin) return true
    if (!this.record.isDraft() && this.record.hasAccessGrantFor(this.user.id)) {
      return true
    }

    return false
  }

  create(): boolean {
    return true
  }

  update(): boolean {
    if (this.record.isDraft() && this.user.id === this.record.creatorId) return true
    if (!this.record.isDraft() && this.user.isSystemAdmin) return true
    if (!this.record.isDraft() && this.user.isAdminForInformationSharingAgreement(this.record.id)) {
      return true
    }

    return false
  }

  destroy(): boolean {
    if (this.record.isDraft() && this.user.id === this.record.creatorId) return true
    if (!this.record.isDraft() && this.user.isSystemAdmin) return true
    if (!this.record.isDraft() && this.user.isAdminForInformationSharingAgreement(this.record.id)) {
      return true
    }

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
      "startDate",
      "endDate",
    ]
  }

  permittedAttributesForCreate(): Path[] {
    return ["sharingGroupId", "receivingGroupId", ...this.permittedAttributes()]
  }

  static policyScope(user: User): FindOptions<Attributes<InformationSharingAgreement>> {
    if (user.isSystemAdmin) {
      return {
        where: {
          [Op.or]: [
            {
              creatorId: user.id,
              status: InformationSharingAgreement.Status.DRAFT,
            },
            {
              status: {
                [Op.ne]: InformationSharingAgreement.Status.DRAFT,
              },
            },
          ],
        },
      }
    }

    const agreementsWithAccessGrantsQuery = sql`
      (
        SELECT
          information_sharing_agreement_id
        FROM
          information_sharing_agreement_access_grants
        WHERE
          user_id = :userId
      )
    `
    return {
      where: {
        [Op.or]: [
          {
            creatorId: user.id,
            status: InformationSharingAgreement.Status.DRAFT,
          },
          {
            status: {
              [Op.ne]: InformationSharingAgreement.Status.DRAFT,
            },
            id: {
              [Op.in]: agreementsWithAccessGrantsQuery,
            },
          },
        ],
      },
      replacements: {
        userId: user.id,
      },
    }
  }
}

export default InformationSharingAgreementPolicy
