import { pick } from "lodash"

import { InformationSharingAgreementAccessGrant } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type InformationSharingAgreementAccessGrantAsReference = Pick<
  InformationSharingAgreementAccessGrant,
  "id" | "informationSharingAgreementId" | "groupId" | "userId" | "accessLevel" | "creatorId"
>

export class ReferenceSerializer extends BaseSerializer<InformationSharingAgreementAccessGrant> {
  perform(): InformationSharingAgreementAccessGrantAsReference {
    return {
      ...pick(this.record, [
        "id",
        "informationSharingAgreementId",
        "groupId",
        "userId",
        "accessLevel",
        "creatorId",
      ]),
    }
  }
}

export default ReferenceSerializer
