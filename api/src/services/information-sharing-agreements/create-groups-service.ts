import { isNil, truncate } from "lodash"
import { DateTime } from "luxon"

import db, { InformationSharingAgreement, User } from "@/models"
import BaseService from "@/services/base-service"
import { Groups } from "@/services"

export class CreateGroupsService extends BaseService {
  constructor(
    private informationSharingAgreement: InformationSharingAgreement,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<void> {
    const {
      id: informationSharingAgreementId,
      sharingGroupContactId,
      receivingGroupContactId,
      signedAt,
    } = this.informationSharingAgreement

    if (isNil(sharingGroupContactId)) {
      throw new Error("Sharing group contact ID must be present to ensure groups")
    }
    if (isNil(receivingGroupContactId)) {
      throw new Error("Receiving group contact ID must be present to ensure groups")
    }

    if (isNil(signedAt)) {
      throw new Error("Signed date must be present to ensure groups")
    }

    const sharingGroupContactHeirarchy =
      await this.buildSharingGroupContactHeirarchy(sharingGroupContactId)
    const receivingGroupContactHeirarchy =
      await this.buildReceivingGroupContactHeirarchy(receivingGroupContactId)

    const signedDate = this.formatSignedDate(signedAt)
    const sharingGroupName = this.buildGroupName(
      informationSharingAgreementId,
      sharingGroupContactHeirarchy,
      signedDate
    )
    const receivingGroupName = this.buildGroupName(
      informationSharingAgreementId,
      receivingGroupContactHeirarchy,
      signedDate
    )

    return db.transaction(async () => {
      const _newSharingGroup = await Groups.CreateService.perform(
        { name: sharingGroupName },
        this.currentUser
      )
      const _newReceivingGroup = await Groups.CreateService.perform(
        { name: receivingGroupName },
        this.currentUser
      )
    })
  }

  private async buildSharingGroupContactHeirarchy(sharingGroupContactId: number): Promise<string> {
    const sharingGroupContact = await User.findByPk(sharingGroupContactId)
    if (isNil(sharingGroupContact)) {
      throw new Error("Sharing group contact not found")
    }

    return sharingGroupContact.department ?? "UNKNOWN"
  }

  private async buildReceivingGroupContactHeirarchy(
    receivingGroupContactId: number
  ): Promise<string> {
    const receivingGroupContact = await User.findByPk(receivingGroupContactId, {
      include: ["externalOrganization"],
    })
    if (isNil(receivingGroupContact)) {
      throw new Error("Receiving group contact not found")
    }

    const { externalOrganization } = receivingGroupContact
    if (isNil(externalOrganization)) {
      throw new Error("Receiving group contact is missing its associated external organization")
    }

    return externalOrganization.name
  }

  private formatSignedDate(signedAt: Date): string {
    return DateTime.fromJSDate(signedAt).toFormat("yyyy-MM-dd")
  }

  private buildGroupName(
    informationSharingAgreementId: number,
    groupName: string,
    signedDate: string
  ): string {
    const prefix = `ISA#${informationSharingAgreementId}-`
    const suffix = `-${signedDate}`
    const groupNameMaxLength = 100 - prefix.length - suffix.length
    const truncatedGroupName = truncate(groupName, {
      length: groupNameMaxLength,
      omission: "",
    })
    return `${prefix}${truncatedGroupName}${suffix}`
  }
}

export default CreateGroupsService
