import { isNil, pick } from "lodash"

import { Group, User } from "@/models"
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
  | "categories"
  | "sources"
  | "userPermissions"
  | "deactivatedAt"
  | "createdAt"
  | "updatedAt"
> & {
  isActive: boolean
} & {
  adminGroups?: Group[]
}

export class ShowSerializer extends BaseSerializer<User> {
  perform(): UserShowView {
    // TODO: serialize nested associations with appropriate serializers.
    const { adminGroups } = this.record
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
        "categories",
        "sources",
        "userPermissions",
        "deactivatedAt",
        "createdAt",
        "updatedAt",
      ]),
      isActive: isNil(this.record.deactivatedAt),
      adminGroups,
    }
  }
}

export default ShowSerializer
