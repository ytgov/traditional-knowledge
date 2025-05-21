import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import cache from "@/db/cache-client"

import db, { ArchiveItem, ArchiveItemFile, User } from "@/models"
import BaseService from "@/services/base-service"
import { ArchiveItemStatus } from "@/models/archive-item"
import { FileStorageService } from "@/services/file-storage-service"

export type ArchiveItemCreationAttributes = Partial<CreationAttributes<ArchiveItem>> & {
  files: File[] | null
  currentUser: User
}

export class CreateService extends BaseService {
  constructor(private attributes: ArchiveItemCreationAttributes) {
    super()
  }

  async perform(): Promise<ArchiveItem> {
    const { title, securityLevel, ...optionalAttributes } = this.attributes

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
    if (isNil(title)) {
      throw new Error("Title is required")
    }

    return db.transaction(async (transaction) => {
      const archiveItem = await ArchiveItem.create(
        {
          ...optionalAttributes,
          isDecision: false,
          title,
          status,
          securityLevel,
          userId: this.attributes.currentUser?.id,
        },
        { transaction }
      )

      if (!isNil(this.attributes.files)) {
        const service = new FileStorageService()
        const folderKey = service.makeKey()
        const cacheClient = await cache.getClient()

        for (const file of this.attributes.files) {
          const fileKey = `${folderKey}/${service.makeKey()}`
          const pdfKey = `${folderKey}/${service.makeKey()}`

          const sourceFile = await ArchiveItemFile.create(
            {
              archiveItemId: archiveItem.id,
              originalFileName: file.name,
              originalFileSize: file.size,
              originalMimeType: file.type,
              originalKey: fileKey,
            },
            { transaction }
          )

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

      return archiveItem
    })
  }
}

export default CreateService
