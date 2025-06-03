import { isNil, pick } from "lodash"

import { Group, InformationSharingAgreementAccessGrant, User } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type UserShowView = Pick<
  User,
  | "id"
  | "email"
  | "firstName"
  | "lastName"
  | "displayName"
  | "roles"
  | "title"
  | "department"
  | "division"
  | "branch"
  | "unit"
  | "deactivatedAt"
  | "emailNotificationsEnabled"
  | "createdAt"
  | "updatedAt"
> & {
  isActive: boolean
} & {
  adminGroups?: Group[]
  adminInformationSharingAgreementAccessGrants?: InformationSharingAgreementAccessGrant[]
}

export class ShowSerializer extends BaseSerializer<User> {
  perform(): UserShowView {
    // TODO: serialize nested associations with appropriate serializers.
    const { adminGroups, adminInformationSharingAgreementAccessGrants } = this.record
    return {
      ...pick(this.record, [
        "id",
        "email",
        "firstName",
        "lastName",
        "displayName",
        "roles",
        "title",
        "department",
        "division",
        "branch",
        "unit",
        "deactivatedAt",
        "emailNotificationsEnabled",
        "createdAt",
        "updatedAt",
      ]),
      isActive: isNil(this.record.deactivatedAt),
      adminGroups,
      adminInformationSharingAgreementAccessGrants,
    }
  }
}

export default ShowSerializer
