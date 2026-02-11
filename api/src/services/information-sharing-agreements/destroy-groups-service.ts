import { isNil } from "lodash"

import { Group, InformationSharingAgreement, User } from "@/models"
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
    const existingGroupIds = [sharingGroupId, receivingGroupId].filter((id) => !isNil(id))
    await Group.destroy({
      where: {
        id: existingGroupIds,
      },
    })
  }
}

export default DestroyGroupsService
