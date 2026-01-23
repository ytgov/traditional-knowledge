import { isNil, isUndefined, pick } from "lodash"

import { User } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"
import { Groups, InformationSharingAgreementAccessGrants } from "@/serializers"

export type UserAsShow = Pick<
  User,
  | "id"
  | "externalDirectoryIdentifier"
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
  | "deactivationReason"
  | "emailNotificationsEnabled"
  | "lastSyncSuccessAt"
  | "lastSyncFailureAt"
  | "lastActiveAt"
  | "createdAt"
  | "updatedAt"
> & {
  isActive: boolean
} & {
  adminGroups: Groups.AsReference[]
  adminInformationSharingAgreementAccessGrants: InformationSharingAgreementAccessGrants.AsReference[]
}

export class ShowSerializer extends BaseSerializer<User> {
  perform(): UserAsShow {
    const { adminGroups, adminInformationSharingAgreementAccessGrants } = this.record
    if (isUndefined(adminGroups)) {
      throw new Error("Expected adminGroups association to be preloaded")
    }

    const serializedAdminGroups = Groups.ReferenceSerializer.perform(adminGroups)

    if (isUndefined(adminInformationSharingAgreementAccessGrants)) {
      throw new Error(
        "Expected adminInformationSharingAgreementAccessGrants association to be preloaded"
      )
    }

    const serializedAdminInformationSharingAgreementAccessGrants =
      InformationSharingAgreementAccessGrants.ReferenceSerializer.perform(
        adminInformationSharingAgreementAccessGrants
      )

    const isActive = isNil(this.record.deactivatedAt)

    return {
      ...pick(this.record, [
        "id",
        "externalDirectoryIdentifier",
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
        "deactivationReason",
        "emailNotificationsEnabled",
        "lastSyncSuccessAt",
        "lastSyncFailureAt",
        "lastActiveAt",
        "createdAt",
        "updatedAt",
      ]),
      isActive,
      adminGroups: serializedAdminGroups,
      adminInformationSharingAgreementAccessGrants:
        serializedAdminInformationSharingAgreementAccessGrants,
    }
  }
}

export default ShowSerializer
