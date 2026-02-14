import { isNil } from "lodash"

import db, { Group, InformationSharingAgreement, User } from "@/models"
import BaseService from "@/services/base-service"
import { Groups } from "@/services"

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
      await Group.findEach(
        {
          where: {
            id: [externalGroupId, internalGroupId],
          },
        },
        async (group) => {
          await Groups.DestroyService.perform(group, this.currentUser)
        }
      )
    })
  }
}

export default DestroyGroupsService
