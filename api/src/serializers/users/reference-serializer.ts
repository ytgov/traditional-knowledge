import { pick } from "lodash"

import { User } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type UserAsReference = Pick<
  User,
  | "id"
  | "email"
  | "firstName"
  | "lastName"
  | "displayName"
  | "title"
  | "department"
  | "division"
  | "branch"
  | "unit"
  | "emailNotificationsEnabled"
>

export class ReferenceSerializer extends BaseSerializer<User> {
  perform(): UserAsReference {
    return {
      ...pick(this.record, [
        "id",
        "email",
        "firstName",
        "lastName",
        "displayName",
        "title",
        "department",
        "division",
        "branch",
        "unit",
        "emailNotificationsEnabled",
      ]),
    }
  }
}

export default ReferenceSerializer
