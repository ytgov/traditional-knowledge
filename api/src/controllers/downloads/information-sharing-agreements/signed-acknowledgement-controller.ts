import { isNil } from "lodash"

import logger from "@/utils/logger"
import { Attachment, InformationSharingAgreement } from "@/models"
import { AttachmentTargetTypes } from "@/models/attachment"
import { InformationSharingAgreementPolicy } from "@/policies"
import BaseController from "@/controllers/base-controller"

export class SignedAcknowledgementController extends BaseController<InformationSharingAgreement> {
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
          message: "You are not authorized to download this signed acknowledgement.",
        })
      }

      const attachment = await this.loadAttachment(informationSharingAgreement)
      if (isNil(attachment)) {
        return this.response.status(404).json({
          message: "No signed acknowledgement file found.",
        })
      }

      this.response.setHeader("Content-Disposition", `attachment;filename="${attachment.name}"`)
      this.response.setHeader("Content-Type", attachment.mimeType)
      return this.response.send(attachment.content)
    } catch (error) {
      logger.error(`Failed to download signed acknowledgement: ${error}`, { error })
      return this.response.status(400).json({
        message: `Failed to download signed acknowledgement: ${error}`,
      })
    }
  }

  private async loadInformationSharingAgreement(): Promise<InformationSharingAgreement | null> {
    return InformationSharingAgreement.findByPk(this.params.informationSharingAgreementId, {
      include: ["accessGrants"],
    })
  }

  private buildPolicy(
    informationSharingAgreement: InformationSharingAgreement
  ): InformationSharingAgreementPolicy {
    return new InformationSharingAgreementPolicy(this.currentUser, informationSharingAgreement)
  }

  private async loadAttachment(informationSharingAgreement: InformationSharingAgreement) {
    return Attachment.withScope("withContent").findOne({
      where: {
        targetId: informationSharingAgreement.id,
        targetType: AttachmentTargetTypes.InformationSharingAgreement,
      },
    })
  }
}

export default SignedAcknowledgementController
