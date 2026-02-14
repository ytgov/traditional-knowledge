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
      const externalGroup = await this.createExternalGroup(
        informationSharingAgreementId,
        externalGroupContactId,
        signedAt
      )
      const internalGroup = await this.createInternalGroup(
        informationSharingAgreementId,
        internalGroupContactId,
        signedAt
      )

      await this.informationSharingAgreement.update({
        externalGroupId: externalGroup.id,
        internalGroupId: internalGroup.id,
      })

      await this.addExternalGroupAdmin(externalGroupContactId, externalGroup)
      await this.addInternalGroupAdmins(
        internalGroupContactId,
        internalGroupSecondaryContactId,
        internalGroup
      )
    })
  }

  private async createExternalGroup(
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
    return Groups.CreateService.perform(
      {
        name: externalGroupName,
        isExternal: true,
      },
      this.currentUser
    )
  }

  private async createInternalGroup(
    informationSharingAgreementId: number,
    internalGroupContactId: number,
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
    return Groups.CreateService.perform(
      {
        name: internalGroupName,
        isExternal: false,
      },
      this.currentUser
    )
  }

  private async addExternalGroupAdmin(
    externalGroupContactId: number,
    externalGroup: Group
  ): Promise<void> {
    const externalGroupContact = await User.findByPk(externalGroupContactId)
    if (isNil(externalGroupContact)) {
      throw new Error("External group contact not found")
    }

    await this.addGroupAdmin(externalGroupContact, externalGroup)
  }

  private async addInternalGroupAdmins(
    internalGroupContactId: number,
    internalGroupSecondaryContactId: number | null,
    internalGroup: Group
  ): Promise<void> {
    const internalGroupContact = await User.findByPk(internalGroupContactId)
    if (isNil(internalGroupContact)) {
      throw new Error("Internal group contact not found")
    }

    await this.addGroupAdmin(internalGroupContact, internalGroup)

    if (!isNil(internalGroupSecondaryContactId)) {
      const internalGroupSecondaryContact = await User.findByPk(internalGroupSecondaryContactId)
      if (!isNil(internalGroupSecondaryContact)) {
        await this.addGroupAdmin(internalGroupSecondaryContact, internalGroup)
      }
    }
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
