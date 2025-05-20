import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { ArchiveItem, User } from "@/models"
import { PolicyFactory } from "@/policies/base-policy"

export class ArchiveItemsPolicy extends PolicyFactory(ArchiveItem) {
  show(): boolean {
    if (this.user.id === this.record.userId) {
      return true
    }

    return false
  }

  create(): boolean {
    return true
  }

  update(): boolean {
    if (this.user.id === this.record.userId) return true

    return false
  }

  destroy(): boolean {
    if (this.user.id === this.record.userId) return true

    return false
  }

  permittedAttributes(): Path[] {
    const attributes: (keyof Attributes<ArchiveItem>)[] = [
      "retentionName",
      "calculatedExpireDate",
      "overrideExpireDate",
      "expireAction",
      "sourceId",
      "userId",
      "title",
      "description",
      "summary",
      "status",
      "securityLevel",
      "tags",
      "submittedAt",
    ]

    /* if (this.user.isSystemAdmin) {
      attributes.push("email", "roles", "deactivatedAt")
    } */

    return attributes
  }

  permittedAttributesForCreate(): Path[] {
    return [...this.permittedAttributes()]
  }

  static policyScope(user: User): FindOptions<Attributes<ArchiveItem>> {
    return {
      where: {
        userId: user.id,
      },
    }
  }
}

export default ArchiveItemsPolicy
