import { pick } from "lodash"

import { ExternalOrganization } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type ExternalOrganizationShowView = Pick<
  ExternalOrganization,
  "id" | "name" | "createdAt" | "updatedAt"
>

export class ShowSerializer extends BaseSerializer<ExternalOrganization> {
  perform(): ExternalOrganizationShowView {
    return {
      ...pick(this.record, ["id", "name", "createdAt", "updatedAt"]),
    }
  }
}

export default ShowSerializer
