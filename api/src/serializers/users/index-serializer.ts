import { isNil, pick } from "lodash"

import { User } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type UserIndexView = Pick<
  User,
  | "id"
  | "email"
  | "auth0Subject"
  | "activeDirectoryIdentifier"
  | "isExternal"
  | "externalOrganizationId"
  | "firstName"
  | "lastName"
  | "displayName"
  | "roles"
  | "title"
  | "department"
  | "division"
  | "branch"
  | "unit"
  | "phoneNumber"
  | "lastSyncSuccessAt"
  | "lastSyncFailureAt"
  | "deactivatedAt"
  | "deactivationReason"
  | "lastActiveAt"
  | "emailNotificationsEnabled"
  | "creatorId"
  | "createdAt"
  | "updatedAt"
> & {
  isActive: boolean
}

export class IndexSerializer extends BaseSerializer<User> {
  perform(): UserIndexView {
    return {
      ...pick(this.record, [
        "id",
        "email",
        "auth0Subject",
        "activeDirectoryIdentifier",
        "isExternal",
        "externalOrganizationId",
        "firstName",
        "lastName",
        "displayName",
        "roles",
        "title",
        "department",
        "division",
        "branch",
        "unit",
        "phoneNumber",
        "lastSyncSuccessAt",
        "lastSyncFailureAt",
        "deactivatedAt",
        "deactivationReason",
        "lastActiveAt",
        "emailNotificationsEnabled",
        "creatorId",
        "createdAt",
        "updatedAt",
      ]),
      isActive: isNil(this.record.deactivatedAt),
    }
  }
}

export default IndexSerializer
