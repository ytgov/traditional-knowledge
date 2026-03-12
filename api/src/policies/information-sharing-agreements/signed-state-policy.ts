import { isNil } from "lodash"

import GenericStatePolicy from "@/policies/information-sharing-agreements/generic-state-policy"

export class SignedStatePolicy extends GenericStatePolicy {
  show(): boolean {
    if (this.user.id === this.record.creatorId) return true
    if (this.user.isSystemAdmin) return true
    if (this.isMemberOfInternalGroup()) return true
    if (this.isMemberOfExternalGroup()) return true

    return false
  }

  update(): boolean {
    return false
  }

  destroy(): boolean {
    return false
  }

  private isMemberOfInternalGroup(): boolean {
    const { internalGroupId } = this.record
    if (isNil(internalGroupId)) return false

    return this.user.isMemberOfGroup(internalGroupId)
  }

  private isMemberOfExternalGroup(): boolean {
    const { externalGroupId } = this.record
    if (isNil(externalGroupId)) return false

    return this.user.isMemberOfGroup(externalGroupId)
  }
}

export default SignedStatePolicy
