import { pick } from "lodash"

import { Attachment } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type AttachmentAsReference = Pick<
  Attachment,
  "id" | "targetId" | "targetType" | "name" | "size" | "mimeType" | "sha256Checksum" | "createdAt"
>

export class ReferenceSerializer extends BaseSerializer<Attachment> {
  perform(): AttachmentAsReference {
    return pick(this.record, [
      "id",
      "targetId",
      "targetType",
      "name",
      "size",
      "mimeType",
      "sha256Checksum",
      "createdAt",
    ])
  }
}

export default ReferenceSerializer
