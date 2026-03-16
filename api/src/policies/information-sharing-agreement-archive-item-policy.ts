import { type Attributes, type FindOptions } from "@sequelize/core"
import { isNil, isUndefined } from "lodash"

import { type Path } from "@/utils/deep-pick"
import { InformationSharingAgreementArchiveItem, User, type InformationSharingAgreement } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"
import InformationSharingAgreementPolicy from "@/policies/information-sharing-agreement-policy"

export class InformationSharingAgreementArchiveItemPolicy extends PolicyFactory(
  InformationSharingAgreementArchiveItem
) {
  show(): boolean {
    if (this.informationSharingAgreementPolicy.show()) return true

    return false
  }

  create(): boolean {
    if (this.user.id === this.informationSharingAgreement.creatorId) return true
    if (this.user.isSystemAdmin) return true
    if (this.isAdminOfInternalGroup()) return true
    if (this.isAdminOfExternalGroup()) return true

    return false
  }

  update(): boolean {
    if (this.user.id === this.informationSharingAgreement.creatorId) return true
    if (this.user.isSystemAdmin) return true
    if (this.isAdminOfInternalGroup()) return true
    if (this.isAdminOfExternalGroup()) return true

    return false
  }

  destroy(): boolean {
    if (this.user.id === this.informationSharingAgreement.creatorId) return true
    if (this.user.isSystemAdmin) return true
    if (this.isAdminOfInternalGroup()) return true
    if (this.isAdminOfExternalGroup()) return true

    return false
  }

  permittedAttributes(): Path[] {
    return []
  }

  permittedAttributesForCreate(): Path[] {
    return ["informationSharingAgreementId", "archiveItemId", ...this.permittedAttributes()]
  }

  static policyScope(user: User): FindOptions<Attributes<InformationSharingAgreementArchiveItem>> {
    return {
      include: [
        {
          association: "informationSharingAgreement",
          attributes: ["id"],
          ...InformationSharingAgreementPolicy.policyScope(user),
          required: true,
        },
      ],
    }
  }

  private get informationSharingAgreementPolicy(): InformationSharingAgreementPolicy {
    const { informationSharingAgreement } = this.record
    if (isUndefined(informationSharingAgreement)) {
      throw new Error("Expected information sharing agreement association to be pre-loaded")
    }

    return new InformationSharingAgreementPolicy(this.user, informationSharingAgreement)
  }

  private isAdminOfInternalGroup(): boolean {
    const { internalGroupId } = this.informationSharingAgreement
    if (isNil(internalGroupId)) return false

    return this.user.isGroupAdminOf(internalGroupId)
  }

  private isAdminOfExternalGroup(): boolean {
    const { externalGroupId } = this.informationSharingAgreement
    if (isNil(externalGroupId)) return false

    return this.user.isGroupAdminOf(externalGroupId)
  }

  private get informationSharingAgreement(): InformationSharingAgreement {
    const { informationSharingAgreement } = this.record
    if (isUndefined(informationSharingAgreement)) {
      throw new Error("Expected information sharing agreement association to be pre-loaded")
    }

    return informationSharingAgreement
  }
}

export default InformationSharingAgreementArchiveItemPolicy
