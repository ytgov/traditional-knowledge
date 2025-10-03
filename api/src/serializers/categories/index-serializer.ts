import { isNil, isUndefined, pick } from "lodash"

import { Category } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"
import RetentionIndexSerializer, {
  RetentionIndexView,
} from "@/serializers/retentions/index-serializer"

export type CategoryIndexView = Pick<Category, "id" | "name" | "description" | "retentionId"> & {
  retention?: RetentionIndexView | null
}

export class IndexSerializer extends BaseSerializer<Category> {
  perform(): CategoryIndexView {
    if (isNil(this.record.retentionId)) {
      return {
        ...pick(this.record, ["id", "name", "description", "retentionId"]),
        retention: null,
      }
    }

    if (isUndefined(this.record.retention)) {
      throw new Error("Retention must be eager loaded for detailed view")
    }

    return {
      ...pick(this.record, ["id", "name", "description", "retentionId"]),
      retention: RetentionIndexSerializer.perform(this.record.retention),
    }
  }
}

export default IndexSerializer
