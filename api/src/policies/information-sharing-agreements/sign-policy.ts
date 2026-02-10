import { InformationSharingAgreement } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"

export class SignPolicy extends PolicyFactory(InformationSharingAgreement) {
  create(): boolean {
    if (!this.record.isDraft()) return false

    if (this.user.id === this.record.creatorId) return true
    if (this.user.isSystemAdmin) return true
    if (this.record.hasAccessGrantFor(this.user.id)) return true

    return false
  }
}
