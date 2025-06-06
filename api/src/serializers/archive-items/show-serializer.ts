import { isUndefined, pick } from "lodash"

import { ArchiveItem } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"
import { InformationSharingAgreementAccessGrants, Users } from "@/serializers"
import { type UserReferenceView } from "@/serializers/users/reference-serializer"
import { type InformationSharingAgreementAccessGrantShowView } from "@/serializers/information-sharing-agreement-access-grants/show-serializer"

export type ArchiveItemShowView = Pick<
  ArchiveItem,
  | "id"
  | "isDecision"
  | "userId"
  | "title"
  | "description"
  | "summary"
  | "status"
  | "securityLevel"
  | "tags"
  | "submittedAt"
  | "files"
  | "createdAt"
  | "updatedAt"
> & {
  user?: UserReferenceView
  informationSharingAgreementAccessGrants?: InformationSharingAgreementAccessGrantShowView[]
}

export class ShowSerializer extends BaseSerializer<ArchiveItem> {
  perform(): ArchiveItemShowView {
    const { user, informationSharingAgreementAccessGrants } = this.record
    if (isUndefined(user)) {
      throw new Error("Expected user association to be preloaded")
    }

    if (isUndefined(informationSharingAgreementAccessGrants)) {
      throw new Error(
        "Expected informationSharingAgreementAccessGrants association to be preloaded"
      )
    }

    const serializedUser = Users.ReferenceSerializer.perform(user)
    const serializedInformationSharingAgreementAccessGrants =
      InformationSharingAgreementAccessGrants.ShowSerializer.perform(
        informationSharingAgreementAccessGrants
      )
    return {
      ...pick(this.record, [
        "id",
        "isDecision",
        "userId",
        "title",
        "description",
        "summary",
        "status",
        "securityLevel",
        "tags",
        "submittedAt",
        "files",
        "createdAt",
        "updatedAt",
      ]),
      user: serializedUser,
      informationSharingAgreementAccessGrants: serializedInformationSharingAgreementAccessGrants,
    }
  }
}

export default ShowSerializer
