import { Path } from "@/utils/deep-pick"
import { User } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"

export class DeactivationPolicy extends PolicyFactory(User) {
  create(): boolean {
    if (this.user.isSystemAdmin) return true

    return false
  }

  destroy(): boolean {
    if (this.user.isSystemAdmin) return true

    return false
  }

  permittedAttributesForCreate(): Path[] {
    return ["deactivationReason"]
  }
}
