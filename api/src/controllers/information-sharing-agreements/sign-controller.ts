import { isNil } from "lodash"

import logger from "@/utils/logger"

import { InformationSharingAgreement } from "@/models"
import { SignPolicy } from "@/policies/information-sharing-agreements"
import { SignService } from "@/services/information-sharing-agreements"
import { type SignServiceAttributes } from "@/services/information-sharing-agreements/sign-service"
import { ShowSerializer } from "@/serializers/information-sharing-agreements"
import BaseController from "@/controllers/base-controller"

export class SignController extends BaseController<InformationSharingAgreement> {
  async create() {
    try {
      const informationSharingAgreement = await this.loadInformationSharingAgreement()
      if (isNil(informationSharingAgreement)) {
        return this.response.status(404).json({
          message: "Information sharing agreement not found.",
        })
      }

      const policy = this.buildPolicy(informationSharingAgreement)
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to sign this information sharing agreement.",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate<SignServiceAttributes>(
        this.request.body
      )
      const updatedInformationSharingAgreement = await SignService.perform(
        informationSharingAgreement,
        permittedAttributes,
        this.currentUser
      )
      const serializedInformationSharingAgreement = ShowSerializer.perform(
        updatedInformationSharingAgreement
      )
      return this.response.status(201).json({
        informationSharingAgreement: serializedInformationSharingAgreement,
      })
    } catch (error) {
      logger.error(`Failed to sign information sharing agreement: ${error}`, { error })
      return this.response.status(422).json({
        message: `Failed to sign information sharing agreement: ${error}`,
      })
    }
  }

  private async loadInformationSharingAgreement(): Promise<InformationSharingAgreement | null> {
    return InformationSharingAgreement.findByPk(this.params.informationSharingAgreementId, {
      include: ["accessGrants"],
    })
  }

  private buildPolicy(informationSharingAgreement: InformationSharingAgreement) {
    return new SignPolicy(this.currentUser, informationSharingAgreement)
  }
}

export default SignController
