import { type Attributes } from "@sequelize/core"
import { isNil } from "lodash"

import db, { User, InformationSharingAgreementAccessGrant, UserGroup } from "@/models"
import BaseService from "@/services/base-service"
import { UserGroups } from "@/services"

export type InformationSharingAgreementAccessGrantCreationAttributes = Partial<
  Attributes<InformationSharingAgreementAccessGrant>
>

// TODO: consider nesting access grant creation under the /information-sharing-agreements namespace?
export class CreateService extends BaseService {
  constructor(
    private attributes: InformationSharingAgreementAccessGrantCreationAttributes,
    private currentUser: User,
    private options: {
      skipUserGroupCreation?: boolean
    } = {}
  ) {
    super()
  }

  async perform(): Promise<InformationSharingAgreementAccessGrant> {
    const { informationSharingAgreementId, groupId, userId, ...optionalAttributes } =
      this.attributes

    if (isNil(informationSharingAgreementId)) {
      throw new Error("Information sharing agreement id is required")
    }

    if (isNil(groupId)) {
      throw new Error("Group id is required")
    }

    if (isNil(userId)) {
      throw new Error("User id is required")
    }

    return db.transaction(async () => {
      const informationSharingAgreementAccessGrant =
        await InformationSharingAgreementAccessGrant.create({
          ...optionalAttributes,
          creatorId: this.currentUser.id,
          informationSharingAgreementId,
          groupId,
          userId,
        })

      if (!this.options.skipUserGroupCreation) {
        await this.ensureUserGroupMembership(userId, groupId)
      }

      return informationSharingAgreementAccessGrant
    })
  }

  private async ensureUserGroupMembership(userId: number, groupId: number): Promise<void> {
    const existingUserGroup = await UserGroup.findOne({
      where: {
        userId,
        groupId,
      },
    })
    if (existingUserGroup) return

    await UserGroups.CreateService.perform({ userId, groupId }, this.currentUser, {
      skipAccessGrantCreation: true,
    })
  }
}

export default CreateService
