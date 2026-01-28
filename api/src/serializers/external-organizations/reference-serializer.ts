import { pick } from "lodash"

import { ExternalOrganization } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type ExternalOrganizationAsReference = Pick<
  ExternalOrganization,
  "id" | "name" | "createdAt" | "updatedAt"
>

export class ReferenceSerializer extends BaseSerializer<ExternalOrganization> {
  perform(): ExternalOrganizationAsReference {
    return {
      ...pick(this.record, ["id", "name", "createdAt", "updatedAt"]),
    }
  }
}

export default ReferenceSerializer
