import { pick } from "lodash"

import { Group } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type GroupShowView = Pick<
  Group,
  "id" | "name" | "acronym" | "description" | "isHost" | "creatorId" | "createdAt" | "updatedAt"
>

export class ShowSerializer extends BaseSerializer<Group> {
  perform(): GroupShowView {
    return {
      ...pick(this.record, [
        "id",
        "name",
        "acronym",
        "description",
        "isHost",
        "creatorId",
        "createdAt",
        "updatedAt",
      ]),
    }
  }
}

export default ShowSerializer
