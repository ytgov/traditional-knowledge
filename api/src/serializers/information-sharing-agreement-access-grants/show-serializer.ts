import { pick } from "lodash"

import { InformationSharingAgreementAccessGrant } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type AccessGrantShowView = Pick<
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
  perform(): AccessGrantShowView {
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
