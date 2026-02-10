import GenericStatePolicy from "@/policies/information-sharing-agreements/generic-state-policy"

export class SignedStatePolicy extends GenericStatePolicy {
  show(): boolean {
    if (this.user.isSystemAdmin) return true
    if (this.record.hasAccessGrantFor(this.user.id)) return true

    return false
  }

  update(): boolean {
    if (this.user.isSystemAdmin) return true
    if (this.user.isAdminForInformationSharingAgreement(this.record.id)) return true

    return false
  }

  destroy(): boolean {
    if (this.user.isSystemAdmin) return true
    if (this.user.isAdminForInformationSharingAgreement(this.record.id)) return true

    return false
  }
}

export default SignedStatePolicy
