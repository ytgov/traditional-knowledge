import { isNil } from "lodash"
import { DateTime } from "luxon"

import logger from "@/utils/logger"
import quickStartBufferStream from "@/utils/quick-start-buffer-stream"

import { InformationSharingAgreement } from "@/models"
import { InformationSharingAgreementPolicy } from "@/policies"
import { CreateService } from "@/services/information-sharing-agreements/generate-acknowledgement"

import BaseController from "@/controllers/base-controller"

export class GenerateAcknowledgementController extends BaseController<InformationSharingAgreement> {
  async create() {
    try {
      const informationSharingAgreement = await this.loadInformationSharingAgreement()
      if (isNil(informationSharingAgreement)) {
        return this.response.status(404).json({
          message: "Information sharing agreement not found.",
        })
      }

      const policy = this.buildPolicy(informationSharingAgreement)
      if (!policy.show()) {
        return this.response.status(403).json({
          message:
            "You are not authorized to download this information sharing agreement acknowledgement template.",
        })
      }

      if (this.query.format !== "docx") {
        return this.response.status(400).json({
          message: "Invalid format. Only docx is supported.",
        })
      }

      const fileName = this.buildFileName(informationSharingAgreement)
      const mimeType = this.buildMimeType()
      this.response.setHeader("Content-Disposition", `attachment;filename="${fileName}"`)
      this.response.setHeader("Content-Type", mimeType)

      return quickStartBufferStream(this.response, mimeType, async () => {
        return CreateService.perform(informationSharingAgreement, this.currentUser)
      })
    } catch (error) {
      logger.error(
        `Failed to download information sharing agreement acknowledgement template: ${error}`,
        { error }
      )
      return this.response.status(400).json({
        message: `Failed to download information sharing agreement acknowledgement template: ${error}`,
      })
    }
  }

  private buildFileName(informationSharingAgreement: InformationSharingAgreement) {
    const { id, title } = informationSharingAgreement
    const currentDateTime = DateTime.now().toFormat("yyyy-MM-dd")
    const displayName = `${title} - ${id}`
    return `Acknowledgement, ${displayName}, ${currentDateTime}.docx`
  }

  private buildMimeType() {
    // TODO: Should we support HTML or PDF versions?
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  }

  private async loadInformationSharingAgreement(): Promise<InformationSharingAgreement | null> {
    return InformationSharingAgreement.findByPk(this.params.informationSharingAgreementId, {
      include: [
        "accessGrants",
        {
          association: "sharingGroupContact",
          include: ["externalOrganization"],
        },
        "receivingGroupContact",
      ],
    })
  }

  private buildPolicy(informationSharingAgreement: InformationSharingAgreement) {
    return new InformationSharingAgreementPolicy(this.currentUser, informationSharingAgreement)
  }
}

export default GenerateAcknowledgementController
