import { type Request, type Response, type NextFunction } from "express"
import { isNil } from "lodash"

import logger from "@/utils/logger"
import { InformationSharingAgreement } from "@/models"
import { InformationSharingAgreementPolicy } from "@/policies"
import {
  CreateService,
  UpdateService,
  DocumentGeneratorService,
} from "@/services/information-sharing-agreements"
import { IndexSerializer, ShowSerializer } from "@/serializers/information-sharing-agreements"
import BaseController from "@/controllers/base-controller"

export class InformationSharingAgreementsController extends BaseController<InformationSharingAgreement> {
  static get downloadFile() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const controllerInstance = new this(req, res, next)
      return controllerInstance.downloadFile().catch(next)
    }
  }

  static get generateDocument() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const controllerInstance = new this(req, res, next)
      return controllerInstance.generateDocument().catch(next)
    }
  }

  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder()

      const scopedInformationSharingAgreements = InformationSharingAgreementPolicy.applyScope(
        scopes,
        this.currentUser
      )

      const totalCount = await scopedInformationSharingAgreements.count({ where })
      const informationSharingAgreements = await scopedInformationSharingAgreements.findAll({
        where,
        order,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedInformationSharingAgreements = IndexSerializer.perform(
        informationSharingAgreements
      )
      return this.response.json({
        informationSharingAgreements: serializedInformationSharingAgreements,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching information sharing agreements: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching information sharing agreements: ${error}`,
      })
    }
  }

  async show() {
    try {
      const informationSharingAgreement = await this.loadInformationSharingAgreement()
      if (isNil(informationSharingAgreement)) {
        return this.response.status(404).json({
          message: "Information sharing agreement not found",
        })
      }

      const policy = this.buildPolicy(informationSharingAgreement)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this information sharing agreement",
        })
      }

      const serializedInformationSharingAgreement = ShowSerializer.perform(
        informationSharingAgreement
      )
      return this.response.json({
        informationSharingAgreement: serializedInformationSharingAgreement,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching information sharing agreement: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching information sharing agreement: ${error}`,
      })
    }
  }

  async create() {
    try {
      const newInformationSharingAgreement = await this.buildInformationSharingAgreement()
      const policy = this.buildPolicy(newInformationSharingAgreement)
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create information sharing agreements",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      // Debug logging
      logger.info("File upload debug - request body keys:", Object.keys(this.request.body))
      logger.info("File upload debug - fileName:", this.request.body.fileName)
      logger.info("File upload debug - fileSize:", this.request.body.fileSize)
      logger.info("File upload debug - fileData present:", !!this.request.body.fileData)
      logger.info("File upload debug - fileData length:", this.request.body.fileData?.length)
      logger.info("File upload debug - permitted keys:", Object.keys(permittedAttributes))
      logger.info("File upload debug - permitted fileData present:", !!permittedAttributes.fileData)

      const informationSharingAgreement = await CreateService.perform(
        permittedAttributes,
        this.currentUser
      )

      const serializedInformationSharingAgreement = ShowSerializer.perform(
        informationSharingAgreement
      )
      return this.response.status(201).json({
        informationSharingAgreement: serializedInformationSharingAgreement,
      })
    } catch (error) {
      logger.error(`Error creating information sharing agreement: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating information sharing agreement: ${error}`,
      })
    }
  }

  async update() {
    try {
      const informationSharingAgreement = await this.loadInformationSharingAgreement()
      if (isNil(informationSharingAgreement)) {
        return this.response.status(404).json({
          message: "Information sharing agreement not found",
        })
      }

      const policy = this.buildPolicy(informationSharingAgreement)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this information sharing agreement",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      // Debug logging
      logger.info("File upload debug (update) - request body keys:", Object.keys(this.request.body))
      logger.info("File upload debug (update) - fileName:", this.request.body.fileName)
      logger.info("File upload debug (update) - fileSize:", this.request.body.fileSize)
      logger.info("File upload debug (update) - fileData present:", !!this.request.body.fileData)
      logger.info("File upload debug (update) - fileData length:", this.request.body.fileData?.length)
      logger.info("File upload debug (update) - permitted keys:", Object.keys(permittedAttributes))
      logger.info("File upload debug (update) - permitted fileData present:", !!permittedAttributes.fileData)

      await UpdateService.perform(
        informationSharingAgreement,
        permittedAttributes,
        this.currentUser
      )

      const serializedInformationSharingAgreement = ShowSerializer.perform(
        informationSharingAgreement
      )
      return this.response.json({
        informationSharingAgreement: serializedInformationSharingAgreement,
        policy,
      })
    } catch (error) {
      logger.error(`Error updating information sharing agreement: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error updating information sharing agreement: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const informationSharingAgreement = await this.loadInformationSharingAgreement()
      if (isNil(informationSharingAgreement)) {
        return this.response.status(404).json({
          message: "Information sharing agreement not found",
        })
      }

      const policy = this.buildPolicy(informationSharingAgreement)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this information sharing agreement",
        })
      }

      await informationSharingAgreement.destroy()
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting information sharing agreement: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error deleting information sharing agreement: ${error}`,
      })
    }
  }

  async downloadFile() {
    try {
      const informationSharingAgreement = await this.loadInformationSharingAgreement()
      if (isNil(informationSharingAgreement)) {
        return this.response.status(404).json({
          message: "Information sharing agreement not found",
        })
      }

      const policy = this.buildPolicy(informationSharingAgreement)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this information sharing agreement",
        })
      }

      if (isNil(informationSharingAgreement.fileData) || isNil(informationSharingAgreement.fileName)) {
        return this.response.status(404).json({
          message: "No file attached to this information sharing agreement",
        })
      }

      this.response.setHeader(
        "Content-Disposition",
        `attachment;filename="${informationSharingAgreement.fileName}"`
      )
      this.response.setHeader(
        "Content-Type",
        informationSharingAgreement.fileMimeType ?? "application/octet-stream"
      )
      return this.response.send(informationSharingAgreement.fileData)
    } catch (error) {
      logger.error(`Error downloading file: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error downloading file: ${error}`,
      })
    }
  }

  async generateDocument() {
    try {
      const informationSharingAgreement = await this.loadInformationSharingAgreement()
      if (isNil(informationSharingAgreement)) {
        return this.response.status(404).json({
          message: "Information sharing agreement not found",
        })
      }

      const policy = this.buildPolicy(informationSharingAgreement)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this information sharing agreement",
        })
      }

      // Generate the document
      const documentBuffer = await DocumentGeneratorService.perform(informationSharingAgreement)

      // Set response headers for download
      const filename = `ISA_${informationSharingAgreement.identifier || informationSharingAgreement.id}.docx`
      this.response.setHeader("Content-Disposition", `attachment;filename="${filename}"`)
      this.response.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )

      return this.response.send(documentBuffer)
    } catch (error) {
      logger.error(`Error generating document: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error generating document: ${error}`,
      })
    }
  }

  private async loadInformationSharingAgreement() {
    return InformationSharingAgreement.findByPk(this.params.informationSharingAgreementId, {
      include: ["creator", "sharingGroup", "receivingGroup", "accessGrants"],
    })
  }

  private async buildInformationSharingAgreement() {
    const informationSharingAgreement = InformationSharingAgreement.build(this.request.body)
    return informationSharingAgreement
  }

  private buildPolicy(informationSharingAgreement: InformationSharingAgreement) {
    return new InformationSharingAgreementPolicy(this.currentUser, informationSharingAgreement)
  }
}

export default InformationSharingAgreementsController
