import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import cache from "@/db/cache-client"

import db, { ArchiveItem, ArchiveItemCategory, ArchiveItemFile, User } from "@/models"
import BaseService from "@/services/base-service"
import { ArchiveItemStatus } from "@/models/archive-item"
import { FileStorageService } from "@/services/file-storage-service"

export type ArchiveItemCreationAttributes = Partial<CreationAttributes<ArchiveItem>> & {
  files: File[] | null
  categoryIds: number[] | null
}

export class CreateService extends BaseService {
  constructor(
    private attributes: ArchiveItemCreationAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<ArchiveItem> {
    const {
      title,
      securityLevel,
      sharingPurpose,
      confidentialityReceipt,
      yukonFirstNations,
      ...optionalAttributes
    } = this.attributes

    const status = ArchiveItemStatus.ACCEPTED

    if (isNil(title)) {
      throw new Error("Title is required")
    }
    if (isNil(status)) {
      throw new Error("Status is required")
    }
    if (isNil(securityLevel)) {
      throw new Error("Security level is required")
    }
    if (isNil(sharingPurpose)) {
      throw new Error("Sharing Purpose is required")
    }
    if (isNil(confidentialityReceipt)) {
      throw new Error("Confidentiality Receipt is required")
    }
    if (isNil(yukonFirstNations)) {
      throw new Error("Sharing Purpose is required")
    }

    return db.transaction(async () => {
      const archiveItem = await ArchiveItem.create({
        ...optionalAttributes,
        isDecision: false,
        title,
        status,
        securityLevel,
        sharingPurpose,
        confidentialityReceipt: Boolean(confidentialityReceipt),
        yukonFirstNations,
        userId: this.currentUser.id,
      })

      if (!isNil(this.attributes.categoryIds)) {
        for (const categoryId of this.attributes.categoryIds) {
          await ArchiveItemCategory.create({
            archiveItemId: archiveItem.id,
            categoryId: parseInt(`${categoryId}`),
            setByUserId: this.currentUser.id,
          })
        }
      }

      if (!isNil(this.attributes.files)) {
        const service = new FileStorageService()
        const folderKey = service.makeKey()
        const cacheClient = await cache.getClient()

        for (const file of this.attributes.files) {
          const fileKey = `${folderKey}/${service.makeKey()}`
          const pdfKey = `${folderKey}/${service.makeKey()}`

          const sourceFile = await ArchiveItemFile.create({
            archiveItemId: archiveItem.id,
            originalFileName: file.name,
            originalFileSize: file.size,
            originalMimeType: file.type,
            originalKey: fileKey,
          })

          // eslint-disable-next-line
          const uploadResp = await service.uploadFile(fileKey, (file as any).path)

          await cacheClient.setValueNoExpire(`CONVERT_${pdfKey}`, JSON.stringify(sourceFile))

          //const toConvert = await cacheClient.getKeysByPattern(`CONVERT_`)
          //console.log(toConvert)
          // this returns the values currently in the Cache that need to be converted

          if (uploadResp.errorCode) {
            throw Error("File upload error")
          }
        }
      }

      return archiveItem.reload({
        include: [
          "files",
          "user",
          { association: "categories", through: { attributes: [] } },
          {
            association: "informationSharingAgreementAccessGrants",
            through: {
              // NOTE: suppressing through model attributes as their names are too long
              attributes: [],
            },
          },
        ],
      })
    })
  }
}

export default CreateService
