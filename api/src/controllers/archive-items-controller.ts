import { isNil } from "lodash"

import logger from "@/utils/logger"
import { ArchiveItem, ArchiveItemAudit } from "@/models"
import { ArchiveItemsPolicy } from "@/policies"
import { CreateService } from "@/services/archive-items"
import { IndexSerializer, ShowSerializer } from "@/serializers/archive-items"
import BaseController from "@/controllers/base-controller"

export class ArchiveItemsController extends BaseController<ArchiveItem> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes(["ArchiveItemsOnly", "withArchiveItemFileCounts"])
      const scopedItems = ArchiveItemsPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedItems.count({ where })
      const archiveItems = await scopedItems.findAll({
        where,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
        include: ["user"],
      })

      const serializedItems = IndexSerializer.perform(archiveItems)
      return this.response.json({
        archiveItems: serializedItems,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching archive items: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching archive items: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create items",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const archiveItem = await CreateService.perform(
        {
          ...permittedAttributes,
          files: this.request.body.files,
        },
        this.currentUser
      )

      // TODO: move to /services/archive-items/create-service.ts
      await ArchiveItemAudit.create({
        archiveItemId: archiveItem.id,
        action: "Created",
        userId: this.currentUser.id,
        description: `${this.currentUser.displayName} created item`,
      })

      const serializedArchiveItem = ShowSerializer.perform(archiveItem)

      return this.response.status(201).json({
        archiveItem: serializedArchiveItem,
      })
    } catch (error) {
      logger.error(`Error creating archive item: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating archive item: ${error}`,
      })
    }
  }

  async show() {
    try {
      const archiveItem = await this.loadArchiveItem()
      if (isNil(archiveItem)) {
        return this.response.status(404).json({
          message: "Archive item not found",
        })
      }

      const policy = this.buildPolicy(archiveItem)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this item",
        })
      }

      // TODO: move to /services/archive-items/show-service.ts
      await ArchiveItemAudit.create({
        archiveItemId: archiveItem.id,
        action: "Viewed Metadata",
        userId: this.currentUser.id,
        description: `${this.currentUser.displayName} viewed metadata`,
      })

      const serializedArchiveItem = ShowSerializer.perform(archiveItem)

      return this.response.json({
        archiveItem: serializedArchiveItem,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching item: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching item: ${error}`,
      })
    }
  }

  private async loadArchiveItem() {
    const item = await ArchiveItem.findByPk(this.params.id, {
      include: ["files", "user", "informationSharingAgreementAccessGrants"],
    })
    if (isNil(item)) return null

    return item
  }

  private buildPolicy(archiveItem: ArchiveItem = ArchiveItem.build()) {
    return new ArchiveItemsPolicy(this.currentUser, archiveItem)
  }
}

export default ArchiveItemsController
