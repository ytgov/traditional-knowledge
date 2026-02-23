import { type CreationAttributes } from "@sequelize/core"
import { isEmpty, isNil } from "lodash"

import type { ExpressFormDataFile } from "@/utils/express-form-data-types"

import db, {
  ArchiveItem,
  InformationSharingAgreement,
  InformationSharingAgreementArchiveItem,
  User,
} from "@/models"
import BaseService from "@/services/base-service"

export type ArchiveItemCreationAttributes = Partial<CreationAttributes<ArchiveItem>>
export type ArchiveItemFiles = Record<
  string,
  ExpressFormDataFile | ExpressFormDataFile[] | undefined
>

export class CreateService extends BaseService {
  constructor(
    private informationSharingAgreement: InformationSharingAgreement,
    private attributes: ArchiveItemCreationAttributes,
    private files: ArchiveItemFiles,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<ArchiveItem> {
    const {
      title,
      status,
      isDecision,
      confidentialityReceipt,
      securityLevel,
      ...optionalAttributes
    } = this.attributes

    if (isNil(title) || isEmpty(title)) {
      throw new Error("Title is required")
    }

    if (isNil(confidentialityReceipt) || confidentialityReceipt !== true) {
      throw new Error("Confidentiality receipt is required, and must be true")
    }

    if (isNil(securityLevel)) {
      throw new Error("Security level is required")
    }

    // TODO: remove these from the model if they are unused by the UI.
    const isDecisionOrFallback = isDecision ?? false
    const statusOrFallback = status ?? ArchiveItem.Statuses.ACCEPTED

    return db.transaction(async () => {
      const archiveItem = await ArchiveItem.create({
        ...optionalAttributes,
        title,
        confidentialityReceipt,
        isDecision: isDecisionOrFallback,
        status: statusOrFallback,
        securityLevel,
      })

      await this.linkArchiveItemToInformationSharingAgreement(archiveItem.id)
      // TODO: handle file uploads
      // TODO: handle category assignments

      return archiveItem
    })
  }

  private async linkArchiveItemToInformationSharingAgreement(archiveItemId: number): Promise<void> {
    await InformationSharingAgreementArchiveItem.create({
      informationSharingAgreementId: this.informationSharingAgreement.id,
      archiveItemId: archiveItemId,
      creatorId: this.currentUser.id,
    })
  }
}

export default CreateService
