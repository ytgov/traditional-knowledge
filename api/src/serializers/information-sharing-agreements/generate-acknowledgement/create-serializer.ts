import { truncate } from "lodash"

import { InformationSharingAgreement } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

const IDENTIFIER_MAX_LENGTH = 80

export type InformationSharingAgreementAsAcknowledgement = {
  identifier: string
}

export class CreateSerializer extends BaseSerializer<InformationSharingAgreement> {
  perform(): InformationSharingAgreementAsAcknowledgement {
    const { id, title } = this.record
    const identifier = this.buildIdentifier(id, title)
    return {
      identifier,
    }
  }

  private buildIdentifier(id: number, title: string): string {
    const suffix = ` - ISA#${id}`
    const titleMaxLength = IDENTIFIER_MAX_LENGTH - suffix.length
    const truncatedTitle = truncate(title, {
      length: titleMaxLength,
    })
    return `${truncatedTitle}${suffix}`
  }
}

export default CreateSerializer
