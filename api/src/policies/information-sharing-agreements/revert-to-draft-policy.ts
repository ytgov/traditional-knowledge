import { isUndefined } from "lodash"

import { InformationSharingAgreement } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"

export class RevertToDraftPolicy extends PolicyFactory(InformationSharingAgreement) {
  create(): boolean {
    if (!this.record.isSigned()) return false

    if (isUndefined(this.record.informationSharingAgreementArchiveItems)) {
      throw new Error(
        "Expected informationSharingAgreementArchiveItems association to be pre-loaded."
      )
    }

    if (this.record.informationSharingAgreementArchiveItems.length > 0) return false

    if (this.user.id === this.record.creatorId) return true
    if (this.user.isSystemAdmin) return true

    return false
  }
}
