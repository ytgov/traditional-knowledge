import { type Path } from "@/utils/deep-pick"
import { InformationSharingAgreement } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"

export class GenericStatePolicy extends PolicyFactory(InformationSharingAgreement) {
  show(): boolean {
    return false
  }

  create(): boolean {
    throw new Error("Create is not dependent on state")
  }

  update(): boolean {
    return false
  }

  destroy(): boolean {
    return false
  }

  permittedAttributes(): Path[] {
    return []
  }
}

export default GenericStatePolicy
