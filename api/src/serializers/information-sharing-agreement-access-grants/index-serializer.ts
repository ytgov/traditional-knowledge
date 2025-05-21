import { pick } from "lodash"

import { InformationSharingAgreementAccessGrant } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type AccessGrantIndexView = Pick<
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

export class IndexSerializer extends BaseSerializer<InformationSharingAgreementAccessGrant> {
  perform(): AccessGrantIndexView {
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

export default IndexSerializer
