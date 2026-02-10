import { isUndefined } from "lodash"

import db, {
  Attachment,
  InformationSharingAgreement,
  User,
  InformationSharingAgreementArchiveItem,
} from "@/models"
import { AttachmentTargetTypes } from "@/models/attachment"
import BaseService from "@/services/base-service"

export class RevertToDraftService extends BaseService {
  constructor(
    private informationSharingAgreement: InformationSharingAgreement,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<InformationSharingAgreement> {
    if (!this.informationSharingAgreement.isSigned()) {
      throw new Error("Only signed agreements can be reverted to draft.")
    }

    const { informationSharingAgreementArchiveItems } = this.informationSharingAgreement
    if (isUndefined(informationSharingAgreementArchiveItems)) {
      throw new Error(
        "Expected informationSharingAgreementArchiveItems association to be pre-loaded."
      )
    }
    this.assertNoArchiveItemsLinked(informationSharingAgreementArchiveItems)

    return db.transaction(async () => {
      await Attachment.destroy({
        where: {
          targetId: this.informationSharingAgreement.id,
          targetType: AttachmentTargetTypes.InformationSharingAgreement,
          associationName: "signedAcknowledgement",
        },
      })
      await this.informationSharingAgreement.update({
        status: InformationSharingAgreement.Status.DRAFT,
        signedById: null,
        signedAt: null,
      })
      return this.informationSharingAgreement
    })
  }

  private assertNoArchiveItemsLinked(
    informationSharingAgreementArchiveItems: InformationSharingAgreementArchiveItem[]
  ): void {
    if (informationSharingAgreementArchiveItems.length > 0) {
      throw new Error("Cannot revert to draft because archive items are linked to this agreement.")
    }
  }
}

export default RevertToDraftService
