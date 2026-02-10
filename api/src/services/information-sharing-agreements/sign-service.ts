import { DateTime } from "luxon"
import { truncate } from "lodash"

import db, { Attachment, InformationSharingAgreement, User } from "@/models"
import BaseService from "@/services/base-service"
import { Attachments } from "@/services"

export class SignService extends BaseService {
  constructor(
    private informationSharingAgreement: InformationSharingAgreement,
    private signedAcknowledgementFilePath: string,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<InformationSharingAgreement> {
    if (!this.informationSharingAgreement.isDraft()) {
      throw new Error("Only draft agreements can be signed.")
    }

    const fileName = this.buildFileName()

    return db.transaction(async () => {
      await Attachments.UpsertService.perform(this.signedAcknowledgementFilePath, fileName, {
        targetId: this.informationSharingAgreement.id,
        targetType: Attachment.TargetTypes.InformationSharingAgreement,
        associationName: "signedAcknowledgement",
      })

      await this.informationSharingAgreement.update({
        status: InformationSharingAgreement.Status.SIGNED,
        signedById: this.currentUser.id,
        signedAt: new Date(),
      })

      return this.informationSharingAgreement
    })
  }

  private buildFileName(): string {
    const { title } = this.informationSharingAgreement
    const safeTitle = truncate(title, {
      length: 60,
      separator: /,? +/,
      omission: "",
    })
    const date = DateTime.now().toFormat("yyyy-MM-dd")
    return `Signed Acknowledgement, ${safeTitle}, ${date}`
  }
}

export default SignService
