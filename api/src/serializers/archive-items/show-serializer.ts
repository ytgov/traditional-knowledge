import { pick } from "lodash"

import { ArchiveItem } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"
import { ReferenceSerializer } from "@/serializers/users"
import { UserReferenceView } from "@/serializers/users/reference-serializer"

export type ArchiveItemShowView = Pick<
  ArchiveItem,
  | "id"
  | "retentionName"
  | "isDecision"
  | "calculatedExpireDate"
  | "overrideExpireDate"
  | "expireAction"
  | "sourceId"
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
}

export class ShowSerializer extends BaseSerializer<ArchiveItem> {
  perform(): ArchiveItemShowView {
    return {
      ...pick(this.record, [
        "id",
        "retentionName",
        "isDecision",
        "calculatedExpireDate",
        "overrideExpireDate",
        "expireAction",
        "sourceId",
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
      user: this.record.user ? ReferenceSerializer.perform(this.record.user) : undefined,
    }
  }
}

export default ShowSerializer
