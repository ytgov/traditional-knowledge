import { isUndefined } from "lodash"

import { InformationSharingAgreement } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"

export class RevertToDraftPolicy extends PolicyFactory(InformationSharingAgreement) {
  create(): boolean {
    if (!this.record.isSigned()) return false
    if (this.hasArchiveItems()) return false

    if (this.user.id === this.record.creatorId) return true
    if (this.user.isSystemAdmin) return true
    if (this.record.hasAccessGrantFor(this.user.id)) return true

    return false
  }

  private hasArchiveItems(): boolean {
    const { informationSharingAgreementArchiveItems } = this.record
    if (isUndefined(informationSharingAgreementArchiveItems)) {
      throw new Error(
        "Expected informationSharingAgreementArchiveItems association to be pre-loaded."
      )
    }

    return informationSharingAgreementArchiveItems.length > 0
  }
}
