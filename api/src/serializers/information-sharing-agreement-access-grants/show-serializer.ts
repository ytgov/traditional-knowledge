import { pick } from "lodash"

import { InformationSharingAgreementAccessGrant } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type InformationSharingAgreementAccessGrantShowView = Pick<
  InformationSharingAgreementAccessGrant,
  | "id"
  | "informationSharingAgreementId"
  | "groupId"
  | "userId"
  | "accessLevel"
  | "creatorId"
  | "createdAt"
  | "updatedAt"
>

export class ShowSerializer extends BaseSerializer<InformationSharingAgreementAccessGrant> {
  perform(): InformationSharingAgreementAccessGrantShowView {
    return {
      ...pick(this.record, [
        "id",
        "informationSharingAgreementId",
        "groupId",
        "userId",
        "accessLevel",
        "creatorId",
        "createdAt",
        "updatedAt",
      ]),
    }
  }
}

export default ShowSerializer
