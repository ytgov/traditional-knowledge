import { isNil, truncate } from "lodash"
import { DateTime } from "luxon"

import db, { Group, InformationSharingAgreement, User } from "@/models"
import BaseService from "@/services/base-service"
import { Groups, UserGroups } from "@/services"

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
      receivingGroupSecondaryContactId,
      signedAt,
    } = this.informationSharingAgreement

    if (isNil(sharingGroupContactId)) {
      throw new Error("Sharing group contact ID must be present to create sharing group")
    }
    if (isNil(receivingGroupContactId)) {
      throw new Error("Receiving group contact ID must be present to create receiving group")
    }
    if (isNil(signedAt)) {
      throw new Error("Signed date must be present to create groups")
    }

    return db.transaction(async () => {
      await this.createSharingGroupAndAdmin(
        informationSharingAgreementId,
        sharingGroupContactId,
        signedAt
      )
      await this.createReceivingGroupAndAdmins(
        informationSharingAgreementId,
        receivingGroupContactId,
        receivingGroupSecondaryContactId,
        signedAt
      )
    })
  }

  private async createSharingGroupAndAdmin(
    informationSharingAgreementId: number,
    sharingGroupContactId: number,
    signedAt: Date
  ): Promise<Group> {
    const sharingGroupContact = await User.findByPk(sharingGroupContactId, {
      include: ["externalOrganization"],
    })
    if (isNil(sharingGroupContact)) {
      throw new Error("Sharing group contact not found")
    }

    if (sharingGroupContact.isExternal !== true) {
      throw new Error("Sharing group contact must be an external user")
    }

    if (isNil(sharingGroupContact.externalOrganization)) {
      throw new Error("Sharing group contact is missing its associated external organization")
    }

    const signedDate = this.formatSignedDate(signedAt)
    const sharingGroupName = this.buildGroupName(
      informationSharingAgreementId,
      sharingGroupContact.externalOrganization.name,
      signedDate
    )
    const sharingGroupAttributes = {
      name: sharingGroupName,
    }
    const sharingGroup = await Groups.CreateService.perform(
      sharingGroupAttributes,
      this.currentUser
    )

    await this.addGroupAdmin(sharingGroupContact, sharingGroup)

    return sharingGroup
  }

  private async createReceivingGroupAndAdmins(
    informationSharingAgreementId: number,
    receivingGroupContactId: number,
    receivingGroupSecondaryContactId: number | null,
    signedAt: Date
  ): Promise<Group> {
    const receivingGroupContact = await User.findByPk(receivingGroupContactId)
    if (isNil(receivingGroupContact)) {
      throw new Error("Receiving group contact not found")
    }

    if (receivingGroupContact.isExternal !== false) {
      throw new Error("Receiving group contact must be an internal user")
    }

    const signedDate = this.formatSignedDate(signedAt)
    const receivingGroupName = this.buildGroupName(
      informationSharingAgreementId,
      receivingGroupContact.department ?? "UNKNOWN",
      signedDate
    )
    const receivingGroupAttributes = {
      name: receivingGroupName,
    }
    const receivingGroup = await Groups.CreateService.perform(
      receivingGroupAttributes,
      this.currentUser
    )

    await this.addGroupAdmin(receivingGroupContact, receivingGroup)

    if (!isNil(receivingGroupSecondaryContactId)) {
      const receivingGroupSecondaryContact = await User.findByPk(receivingGroupSecondaryContactId)
      if (!isNil(receivingGroupSecondaryContact)) {
        await this.addGroupAdmin(receivingGroupSecondaryContact, receivingGroup)
      }
    }
    return receivingGroup
  }

  private async addGroupAdmin(user: User, group: Group): Promise<void> {
    await UserGroups.CreateService.perform(
      {
        userId: user.id,
        groupId: group.id,
        isAdmin: true,
      },
      this.currentUser
    )
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
