import { Attributes, QueryTypes } from "@sequelize/core"

import db, { InformationSharingAgreement, User } from "@/models"
import BaseService from "@/services/base-service"
import { EnsureAdminAccessService } from "@/services/information-sharing-agreements/admin-access-grants-service"

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
    return db.transaction(async () => {
      console.log("UpdateService - attributes being passed to update:", {
        hasFileData: "fileData" in this.attributes,
        fileDataValue: this.attributes.fileData,
        fileDataType: typeof this.attributes.fileData,
        fileName: this.attributes.fileName,
      })

      // Handle fileData specially - SQL Server has issues with null BLOB values
      const updateAttributes = { ...this.attributes }
      if ("fileData" in updateAttributes && updateAttributes.fileData === null) {
        console.log("UpdateService - fileData is null, using raw query to clear it")
        // Update other fields first
        const { fileData, ...otherAttributes } = updateAttributes
        await this.informationSharingAgreement.update(otherAttributes)

        // Use raw query to set BLOB to NULL with proper SQL Server syntax
        await db.query(
          `UPDATE [information_sharing_agreements]
           SET [file_data] = CONVERT(VARBINARY(MAX), NULL),
               [updated_at] = GETUTCDATE()
           WHERE [id] = :id`,
          {
            replacements: { id: this.informationSharingAgreement.id },
            type: QueryTypes.UPDATE,
          }
        )

        // Reload to get the updated values
        await this.informationSharingAgreement.reload()
      } else {
        await this.informationSharingAgreement.update(updateAttributes)
      }

      if (
        this.informationSharingAgreement.sharingGroupId &&
        this.informationSharingAgreement.sharingGroupContactId &&
        this.informationSharingAgreement.receivingGroupId &&
        this.informationSharingAgreement.receivingGroupContactId
      ) {
        await this.ensureAdminAccessGrants(
          this.informationSharingAgreement.id,
          this.informationSharingAgreement.sharingGroupId,
          this.informationSharingAgreement.sharingGroupContactId,
          this.informationSharingAgreement.receivingGroupId,
          this.informationSharingAgreement.receivingGroupContactId,
          this.currentUser
        )
      }

      return this.informationSharingAgreement
    })
  }

  private async ensureAdminAccessGrants(
    informationSharingAgreementId: number,
    sharingGroupId: number,
    sharingGroupContactId: number,
    receivingGroupId: number,
    receivingGroupContactId: number,
    currentUser: User
  ) {
    await EnsureAdminAccessService.perform(
      informationSharingAgreementId,
      sharingGroupId,
      sharingGroupContactId,
      receivingGroupId,
      receivingGroupContactId,
      currentUser
    )
  }
}

export default UpdateService
