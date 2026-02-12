import { isNil } from "lodash"

import db, { Group, InformationSharingAgreement, UserGroup, User } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyGroupsService extends BaseService {
  constructor(
    private informationSharingAgreement: InformationSharingAgreement,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<void> {
    const { externalGroupId, internalGroupId } = this.informationSharingAgreement
    if (isNil(externalGroupId)) {
      throw new Error("External group ID is required")
    }

    if (isNil(internalGroupId)) {
      throw new Error("Internal group ID is required")
    }

    return db.transaction(async () => {
      await UserGroup.destroy({
        where: {
          groupId: [externalGroupId, internalGroupId],
        },
      })
      await Group.destroy({
        where: {
          id: [externalGroupId, internalGroupId],
        },
      })
    })
  }
}

export default DestroyGroupsService
