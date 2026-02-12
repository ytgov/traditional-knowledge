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
      externalGroupContactId,
      internalGroupContactId,
      internalGroupSecondaryContactId,
      signedAt,
    } = this.informationSharingAgreement

    if (isNil(externalGroupContactId)) {
      throw new Error("External group contact ID must be present to create external group")
    }
    if (isNil(internalGroupContactId)) {
      throw new Error("Internal group contact ID must be present to create internal group")
    }
    if (isNil(signedAt)) {
      throw new Error("Signed date must be present to create groups")
    }

    return db.transaction(async () => {
      const externalGroup = await this.createExternalGroupAndAdmin(
        informationSharingAgreementId,
        externalGroupContactId,
        signedAt
      )
      const internalGroup = await this.createInternalGroupAndAdmins(
        informationSharingAgreementId,
        internalGroupContactId,
        internalGroupSecondaryContactId,
        signedAt
      )

      await this.informationSharingAgreement.update({
        externalGroupId: externalGroup.id,
        internalGroupId: internalGroup.id,
      })
    })
  }

  private async createExternalGroupAndAdmin(
    informationSharingAgreementId: number,
    externalGroupContactId: number,
    signedAt: Date
  ): Promise<Group> {
    const externalGroupContact = await User.findByPk(externalGroupContactId, {
      include: ["externalOrganization"],
    })
    if (isNil(externalGroupContact)) {
      throw new Error("External group contact not found")
    }

    if (externalGroupContact.isExternal !== true) {
      throw new Error("External group contact must be an external user")
    }

    if (isNil(externalGroupContact.externalOrganization)) {
      throw new Error("External group contact is missing its associated external organization")
    }

    const signedDate = this.formatSignedDate(signedAt)
    const externalGroupName = this.buildGroupName(
      informationSharingAgreementId,
      externalGroupContact.externalOrganization.name,
      signedDate
    )
    const externalGroupAttributes = {
      name: externalGroupName,
      isExternal: true,
    }
    const externalGroup = await Groups.CreateService.perform(
      externalGroupAttributes,
      this.currentUser
    )

    await this.addGroupAdmin(externalGroupContact, externalGroup)

    return externalGroup
  }

  private async createInternalGroupAndAdmins(
    informationSharingAgreementId: number,
    internalGroupContactId: number,
    internalGroupSecondaryContactId: number | null,
    signedAt: Date
  ): Promise<Group> {
    const internalGroupContact = await User.findByPk(internalGroupContactId)
    if (isNil(internalGroupContact)) {
      throw new Error("Internal group contact not found")
    }

    if (internalGroupContact.isExternal !== false) {
      throw new Error("Internal group contact must be an internal user")
    }

    const signedDate = this.formatSignedDate(signedAt)
    const internalGroupName = this.buildGroupName(
      informationSharingAgreementId,
      internalGroupContact.department ?? "UNKNOWN",
      signedDate
    )
    const internalGroupAttributes = {
      name: internalGroupName,
      isExternal: false,
    }
    const internalGroup = await Groups.CreateService.perform(
      internalGroupAttributes,
      this.currentUser
    )

    await this.addGroupAdmin(internalGroupContact, internalGroup)

    if (!isNil(internalGroupSecondaryContactId)) {
      const internalGroupSecondaryContact = await User.findByPk(internalGroupSecondaryContactId)
      if (!isNil(internalGroupSecondaryContact)) {
        await this.addGroupAdmin(internalGroupSecondaryContact, internalGroup)
      }
    }
    return internalGroup
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
