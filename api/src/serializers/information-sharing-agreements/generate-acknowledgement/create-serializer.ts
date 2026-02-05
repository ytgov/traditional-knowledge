import { pick } from "lodash"

import { InformationSharingAgreement } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type InformationSharingAgreementAsAcknowledgement = Pick<InformationSharingAgreement, "title"> & {
  identifier: string
}

export class CreateSerializer extends BaseSerializer<InformationSharingAgreement> {
  perform(): InformationSharingAgreementAsAcknowledgement {
    return {
      ...pick(this.record, ["title"]),
      identifier: this.record.id.toString(),
    }
  }
}

export default CreateSerializer
