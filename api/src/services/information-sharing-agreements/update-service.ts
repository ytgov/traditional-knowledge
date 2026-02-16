import { Attributes } from "@sequelize/core"
import { isNil } from "lodash"

import db, { InformationSharingAgreement, User, UserGroup } from "@/models"
import BaseService from "@/services/base-service"
import { UserGroups } from "@/services"

export type InformationSharingAgreementUpdateAttributes = Partial<
  Attributes<InformationSharingAgreement>
>

export class UpdateService extends BaseService {
  constructor(
    private informationSharingAgreement: InformationSharingAgreement,
    private attributes: InformationSharingAgreementUpdateAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<InformationSharingAgreement> {
    const {
      externalGroupContactId: oldExternalGroupContactId,
      internalGroupContactId: oldInternalGroupContactId,
      internalGroupSecondaryContactId: oldInternalGroupSecondaryContactId,
    } = this.informationSharingAgreement

    return db.transaction(async () => {
      await this.informationSharingAgreement.update(this.attributes)

      const {
        externalGroupId,
        internalGroupId,
        externalGroupContactId: newExternalGroupContactId,
        internalGroupContactId: newInternalGroupContactId,
        internalGroupSecondaryContactId: newInternalGroupSecondaryContactId,
      } = this.informationSharingAgreement

      if (!isNil(externalGroupId)) {
        await this.syncGroupAdmin(
          externalGroupId,
          oldExternalGroupContactId,
          newExternalGroupContactId
        )
      }

      if (!isNil(internalGroupId)) {
        await this.syncGroupAdmin(
          internalGroupId,
          oldInternalGroupContactId,
          newInternalGroupContactId
        )
        await this.syncGroupAdmin(
          internalGroupId,
          oldInternalGroupSecondaryContactId,
          newInternalGroupSecondaryContactId
        )
      }

      return this.informationSharingAgreement.reload({
        include: ["accessGrants", "signedAcknowledgement"],
      })
    })
  }

  private async syncGroupAdmin(
    groupId: number,
    oldContactId: number | null,
    newContactId: number | null
  ): Promise<void> {
    if (oldContactId === newContactId) return

    if (!isNil(oldContactId)) {
      await this.removeGroupAdmin(oldContactId, groupId)
    }

    if (!isNil(newContactId)) {
      await this.addGroupAdmin(newContactId, groupId)
    }
  }

  private async removeGroupAdmin(userId: number, groupId: number): Promise<void> {
    await UserGroup.findEach(
      {
        where: {
          userId,
          groupId,
        },
        include: ["user", "group"],
      },
      async (userGroup) => {
        await UserGroups.DestroyService.perform(userGroup, this.currentUser)
      }
    )
  }

  private async addGroupAdmin(userId: number, groupId: number): Promise<void> {
    await UserGroups.CreateService.perform(
      {
        userId,
        groupId,
        isAdmin: true,
      },
      this.currentUser
    )
  }
}

export default UpdateService
