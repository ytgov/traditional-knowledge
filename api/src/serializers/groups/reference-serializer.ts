import { pick } from "lodash"

import { Group } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type GroupAsReference = Pick<Group, "id" | "name" | "acronym" | "description" | "isExternal">

export class ReferenceSerializer extends BaseSerializer<Group> {
  perform(): GroupAsReference {
    return {
      ...pick(this.record, ["id", "name", "acronym", "description", "isExternal"]),
    }
  }
}

export default ReferenceSerializer
