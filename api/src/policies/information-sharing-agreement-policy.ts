import { type Attributes, type FindOptions, Op, sql } from "@sequelize/core"

import { type Path } from "@/utils/deep-pick"
import { InformationSharingAgreement, User } from "@/models"
import { BasePolicy, PolicyFactory } from "@/policies/base-policy"
import {
  DraftStatePolicy,
  GenericStatePolicy,
  SignedStatePolicy,
} from "@/policies/information-sharing-agreements"

export class InformationSharingAgreementPolicy extends PolicyFactory(InformationSharingAgreement) {
  show(): boolean {
    return this.policyByState.show()
  }

  create(): boolean {
    return true
  }

  update(): boolean {
    return this.policyByState.update()
  }

  destroy(): boolean {
    return this.policyByState.destroy()
  }

  permittedAttributes(): Path[] {
    return this.policyByState.permittedAttributes()
  }

  permittedAttributesForCreate(): Path[] {
    return this.policyByState.permittedAttributesForCreate()
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

  protected get policyByState(): BasePolicy<InformationSharingAgreement> {
    switch (this.record.status) {
      case InformationSharingAgreement.Status.DRAFT:
        return new DraftStatePolicy(this.user, this.record)
      case InformationSharingAgreement.Status.SIGNED:
        return new SignedStatePolicy(this.user, this.record)
      default:
        return new GenericStatePolicy(this.user, this.record)
    }
  }
}

export default InformationSharingAgreementPolicy
