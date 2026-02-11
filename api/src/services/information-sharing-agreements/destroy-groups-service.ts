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
    const { sharingGroupId, receivingGroupId } = this.informationSharingAgreement
    if (isNil(sharingGroupId)) {
      throw new Error("Sharing group ID is required")
    }

    if (isNil(receivingGroupId)) {
      throw new Error("Receiving group ID is required")
    }

    return db.transaction(async () => {
      await UserGroup.destroy({
        where: {
          groupId: [sharingGroupId, receivingGroupId],
        },
      })
      await Group.destroy({
        where: {
          id: [sharingGroupId, receivingGroupId],
        },
      })
    })
  }
}

export default DestroyGroupsService
