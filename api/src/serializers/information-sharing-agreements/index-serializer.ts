import { pick } from "lodash"

import { formatDate } from "@/utils/formatters"

import { InformationSharingAgreement } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type AgreementIndexView = Pick<
  InformationSharingAgreement,
  | "id"
  | "creatorId"
  | "sharingGroupId"
  | "sharingGroupContactId"
  | "receivingGroupId"
  | "receivingGroupContactId"
  | "status"
  | "title"
  | "createdAt"
  | "updatedAt"
> & {
  startDate: string | null
  endDate: string | null
}

export class IndexSerializer extends BaseSerializer<InformationSharingAgreement> {
  perform(): AgreementIndexView {
    const { startDate, endDate } = this.record
    const formattedStartDate = formatDate(startDate)
    const formattedEndDate = formatDate(endDate)
    return {
      ...pick(this.record, [
        "id",
        "creatorId",
        "sharingGroupId",
        "sharingGroupContactId",
        "receivingGroupId",
        "receivingGroupContactId",
        "status",
        "title",
        "createdAt",
        "updatedAt",
      ]),
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    }
  }
}

export default IndexSerializer
