import { isUndefined, pick } from "lodash"

import { ArchiveItem } from "@/models"
import { InformationSharingAgreementAccessGrants, Users } from "@/serializers"
import CategoryIndexSerializer, {
  CategoryIndexView,
} from "@/serializers/categories/index-serializer"
import { type InformationSharingAgreementAccessGrantShowView } from "@/serializers/information-sharing-agreement-access-grants/show-serializer"
import BaseSerializer from "@/serializers/base-serializer"
import { type UserReferenceView } from "@/serializers/users/reference-serializer"

export type ArchiveItemShowView = Pick<
  ArchiveItem,
  | "id"
  | "isDecision"
  | "userId"
  | "title"
  | "description"
  | "summary"
  | "sharingPurpose"
  | "confidentialityReceipt"
  | "yukonFirstNations"
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
  categories?: CategoryIndexView[]
}

export class ShowSerializer extends BaseSerializer<ArchiveItem> {
  perform(): ArchiveItemShowView {
    const { user, informationSharingAgreementAccessGrants, categories } = this.record
    if (isUndefined(user)) {
      throw new Error("Expected user association to be preloaded")
    }

    if (isUndefined(informationSharingAgreementAccessGrants)) {
      throw new Error(
        "Expected informationSharingAgreementAccessGrants association to be preloaded"
      )
    }

    if (isUndefined(categories)) {
      throw new Error("Expected categories association to be preloaded")
    }

    const serializedUser = Users.ReferenceSerializer.perform(user)
    const serializedInformationSharingAgreementAccessGrants =
      InformationSharingAgreementAccessGrants.ShowSerializer.perform(
        informationSharingAgreementAccessGrants
      )
    const serializedCategories = categories.map((category) =>
      CategoryIndexSerializer.perform(category)
    )
    return {
      ...pick(this.record, [
        "id",
        "isDecision",
        "userId",
        "title",
        "description",
        "summary",
        "sharingPurpose",
        "confidentialityReceipt",
        "yukonFirstNations",
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
      categories: serializedCategories,
    }
  }
}

export default ShowSerializer
