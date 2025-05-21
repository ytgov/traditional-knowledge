import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"
import { ArchiveItemAudit, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class ArchiveItemAuditsPolicy extends PolicyFactory(ArchiveItemAudit) {
  show(): boolean {
    if (this.user.isSystemAdmin) return true
    if (this.user.id === this.record.userId) return true

    return false
  }

  create(): boolean {
    return false
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

  permittedAttributesForCreate(): Path[] {
    return []
  }

  static policyScope(user: User): FindOptions<Attributes<ArchiveItemAudit>> {
    if (user.isSystemAdmin) return ALL_RECORDS_SCOPE

    return {
      include: [
        {
          association: "archiveItem",
          where: {
            userId: user.id,
          },
        },
      ],
    }
  }
}

export default ArchiveItemAuditsPolicy
