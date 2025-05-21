import { Attributes } from "@sequelize/core"
import { isNil } from "lodash"

import { User, InformationSharingAgreementAccessGrant } from "@/models"
import BaseService from "@/services/base-service"

export type InformationSharingAgreementAccessGrantCreationAttributes = Partial<
  Attributes<InformationSharingAgreementAccessGrant>
>

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

    const informationSharingAgreementAccessGrant =
      await InformationSharingAgreementAccessGrant.create({
        ...optionalAttributes,
        creatorId: this.currentUser.id,
        informationSharingAgreementId,
        groupId,
      })

    return informationSharingAgreementAccessGrant
  }
}

export default CreateService
