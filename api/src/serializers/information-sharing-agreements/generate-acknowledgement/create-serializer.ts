import { InformationSharingAgreement } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type InformationSharingAgreementAsAcknowledgement = Pick<
  InformationSharingAgreement,
  "title"
> & {
  identifier: string
}

export class CreateSerializer extends BaseSerializer<InformationSharingAgreement> {
  perform(): InformationSharingAgreementAsAcknowledgement {
    const { id, title } = this.record
    const identifier = `${title} - ISA#${id}`
    return {
      title,
      identifier,
    }
  }
}

export default CreateSerializer
