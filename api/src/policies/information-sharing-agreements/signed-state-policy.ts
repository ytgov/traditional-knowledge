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
    if (this.user.id === this.record.creatorId) return true
    if (this.user.isSystemAdmin) return true
    if (this.isAdminOfInternalGroup()) return true
    if (this.isAdminOfExternalGroup()) return true

    return false
  }

  destroy(): boolean {
    if (this.user.id === this.record.creatorId) return true
    if (this.user.isSystemAdmin) return true
    if (this.isAdminOfInternalGroup()) return true
    if (this.isAdminOfExternalGroup()) return true

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

  private isAdminOfInternalGroup(): boolean {
    const { internalGroupId } = this.record
    if (isNil(internalGroupId)) return false

    return this.user.isGroupAdminOf(internalGroupId)
  }

  private isAdminOfExternalGroup(): boolean {
    const { externalGroupId } = this.record
    if (isNil(externalGroupId)) return false

    return this.user.isGroupAdminOf(externalGroupId)
  }
}

export default SignedStatePolicy
