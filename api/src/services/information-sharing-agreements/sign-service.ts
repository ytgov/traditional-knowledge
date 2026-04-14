import { DateTime } from "luxon"
import { isNil, truncate } from "lodash"

import db, { Attachment, InformationSharingAgreement, User } from "@/models"
import BaseService from "@/services/base-service"
import { Attachments, InformationSharingAgreements } from "@/services"

export type SignServiceAttributes = Partial<
  Omit<InformationSharingAgreement, "signedAcknowledgement" | "signedConfidentialityReceipt">
> &
  Partial<{
    signedAcknowledgement: {
      path: string
    }
    signedConfidentialityReceipt: {
      path: string
    }
  }>

export class SignService extends BaseService {
  constructor(
    private informationSharingAgreement: InformationSharingAgreement,
    private attributes: SignServiceAttributes,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<InformationSharingAgreement> {
    if (!this.informationSharingAgreement.isDraft()) {
      throw new Error("Only draft agreements can be signed.")
    }

    const { signedAcknowledgement } = this.attributes
    if (isNil(signedAcknowledgement)) {
      throw new Error("A signed acknowledgement file is required.")
    }

    const { path: signedAcknowledgementFilePath } = signedAcknowledgement

    const { confidentialityType } = this.informationSharingAgreement
    const isConfidentialityTypeAcceptedInConfidence =
      confidentialityType ===
      InformationSharingAgreement.ConfidentialityTypes.ACCEPTED_IN_CONFIDENCE

    const { signedConfidentialityReceipt } = this.attributes
    let signedConfidentialityReceiptFilePath: string | null = null
    if (isConfidentialityTypeAcceptedInConfidence) {
      if (isNil(signedConfidentialityReceipt)) {
        throw new Error(
          "A signed confidentiality receipt is required when the agreement is accepted in confidence."
        )
      }

      signedConfidentialityReceiptFilePath = signedConfidentialityReceipt.path
    }

    const { title } = this.informationSharingAgreement
    const safeTitle = this.buildSafeTitle(title)
    const acknowledgementFileName = this.buildAcknowledgementFileName(safeTitle)

    return db.transaction(async () => {
      await Attachments.UpsertService.perform(
        signedAcknowledgementFilePath,
        acknowledgementFileName,
        {
          targetId: this.informationSharingAgreement.id,
          targetType: Attachment.TargetTypes.InformationSharingAgreement,
          associationName: "signedAcknowledgement",
        }
      )

      if (!isNil(signedConfidentialityReceiptFilePath)) {
        const confidentialityAgreementFileName =
          this.buildConfidentialityAgreementFileName(safeTitle)
        await Attachments.UpsertService.perform(
          signedConfidentialityReceiptFilePath,
          confidentialityAgreementFileName,
          {
            targetId: this.informationSharingAgreement.id,
            targetType: Attachment.TargetTypes.InformationSharingAgreement,
            associationName: "signedConfidentialityReceipt",
          }
        )
      }

      await this.informationSharingAgreement.update({
        status: InformationSharingAgreement.Status.SIGNED,
        signedById: this.currentUser.id,
        signedAt: new Date(),
      })

      await this.createGroups(this.informationSharingAgreement, this.currentUser)

      return this.informationSharingAgreement.reload({
        include: ["accessGrants", "signedAcknowledgement"],
      })
    })
  }

  private async createGroups(
    informationSharingAgreement: InformationSharingAgreement,
    currentUser: User
  ): Promise<void> {
    await InformationSharingAgreements.CreateGroupsService.perform(
      informationSharingAgreement,
      currentUser
    )
  }

  private buildAcknowledgementFileName(safeTitle: string): string {
    const date = DateTime.now().toFormat("yyyy-MM-dd")
    return `Signed Acknowledgement, ${safeTitle}, ${date}`
  }

  private buildConfidentialityAgreementFileName(safeTitle: string): string {
    const date = DateTime.now().toFormat("yyyy-MM-dd")
    return `Signed Confidentiality Receipt, ${safeTitle}, ${date}`
  }

  private buildSafeTitle(title: string): string {
    return truncate(title, {
      length: 60,
      separator: /,? +/,
      omission: "",
    })
  }
}

export default SignService
