import { isNil, pick } from "lodash"

import { User } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type UserIndexView = Pick<
  User,
  | "id"
  | "createdById"
  | "email"
  | "auth0Subject"
  | "activeDirectoryIdentifier"
  | "isExternal"
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
  | "yukonFirstNation"
  | "lastSyncSuccessAt"
  | "lastSyncFailureAt"
  | "deactivatedAt"
  | "deactivationReason"
  | "lastActiveAt"
  | "emailNotificationsEnabled"
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
        "createdById",
        "email",
        "auth0Subject",
        "activeDirectoryIdentifier",
        "isExternal",
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
        "yukonFirstNation",
        "lastSyncSuccessAt",
        "lastSyncFailureAt",
        "deactivatedAt",
        "deactivationReason",
        "lastActiveAt",
        "emailNotificationsEnabled",
        "createdAt",
        "updatedAt",
      ]),
      isActive: isNil(this.record.deactivatedAt),
    }
  }
}

export default IndexSerializer
