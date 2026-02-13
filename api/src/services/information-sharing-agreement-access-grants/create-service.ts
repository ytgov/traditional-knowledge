import { Attributes } from "@sequelize/core"
import { isNil } from "lodash"

import {
  User,
  InformationSharingAgreementAccessGrant,
  InformationSharingAgreement,
  UserGroup,
} from "@/models"
import BaseService from "@/services/base-service"

export type InformationSharingAgreementAccessGrantCreationAttributes = Partial<
  Attributes<InformationSharingAgreementAccessGrant>
>

// TODO: consider nesting access grant creation under the /information-sharing-agreements namespace?
export class CreateService extends BaseService {
  constructor(
    private attributes: InformationSharingAgreementAccessGrantCreationAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<InformationSharingAgreementAccessGrant> {
    const { informationSharingAgreementId, groupId, ...optionalAttributes } = this.attributes

    if (isNil(informationSharingAgreementId)) {
      throw new Error("Information sharing agreement id is required")
    }

    if (isNil(groupId)) {
      throw new Error("Group id is required")
    }

    // TODO: Consider if these should be model level validations?
    const informationSharingAgreement = await this.loadInformationSharingAgreement(
      informationSharingAgreementId
    )
    const { externalGroupId, internalGroupId } = informationSharingAgreement

    if (!isNil(externalGroupId) && !isNil(internalGroupId)) {
      await this.assertGroupIdIsValidInformationSharingAgreementGroup(
        groupId,
        externalGroupId,
        internalGroupId
      )

      const { userId } = this.attributes
      if (!isNil(userId)) {
        await this.assertUserIdIsValidInformationSharingAgreementGroupMember(
          userId,
          externalGroupId,
          internalGroupId
        )
      }
    }

    const informationSharingAgreementAccessGrant =
      await InformationSharingAgreementAccessGrant.create({
        ...optionalAttributes,
        creatorId: this.currentUser.id,
        informationSharingAgreementId,
        groupId,
      })

    return informationSharingAgreementAccessGrant
  }

  private async assertGroupIdIsValidInformationSharingAgreementGroup(
    groupId: number,
    externalGroupId: number,
    internalGroupId: number
  ): Promise<void> {
    if (groupId !== externalGroupId && groupId !== internalGroupId) {
      throw new Error(
        "Group id must match either the information sharing agreement's external group id or internal group id"
      )
    }
  }

  private async assertUserIdIsValidInformationSharingAgreementGroupMember(
    userId: number,
    externalGroupId: number,
    internalGroupId: number
  ): Promise<void> {
    const userGroupCount = await UserGroup.count({
      where: {
        userId,
        groupId: [externalGroupId, internalGroupId],
      },
    })
    if (userGroupCount === 0) {
      throw new Error(
        "User must be a member of either the information sharing agreement's external group or internal group"
      )
    }
  }

  private async loadInformationSharingAgreement(
    informationSharingAgreementId: number
  ): Promise<InformationSharingAgreement> {
    const informationSharingAgreement = await InformationSharingAgreement.findByPk(
      informationSharingAgreementId,
      {
        rejectOnEmpty: true,
      }
    )
    return informationSharingAgreement
  }
}

export default CreateService
