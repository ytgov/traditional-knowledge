import { Notification } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"

export class ReadPolicy extends PolicyFactory(Notification) {
  create(): boolean {
    if (this.record.userId === this.user.id) return true

    return false
  }

  destroy(): boolean {
    if (this.record.userId === this.user.id) return true

    return false
  }
}

export default ReadPolicy
