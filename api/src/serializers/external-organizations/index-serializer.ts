import { pick } from "lodash"

import { ExternalOrganization } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type ExternalOrganizationIndexView = Pick<
  ExternalOrganization,
  "id" | "name" | "createdAt" | "updatedAt"
>

export class IndexSerializer extends BaseSerializer<ExternalOrganization> {
  perform(): ExternalOrganizationIndexView {
    return {
      ...pick(this.record, ["id", "name", "createdAt", "updatedAt"]),
    }
  }
}

export default IndexSerializer
