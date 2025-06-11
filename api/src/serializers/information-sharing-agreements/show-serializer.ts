import { pick } from "lodash"

import { formatDate } from "@/utils/formatters"

import { InformationSharingAgreement } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type AgreementShowView = Pick<
  InformationSharingAgreement,
  | "id"
  | "creatorId"
  | "sharingGroupId"
  | "sharingGroupContactId"
  | "receivingGroupId"
  | "receivingGroupContactId"
  | "title"
  | "description"
  | "createdAt"
  | "updatedAt"
> & {
  startDate: string
  endDate: string
}

export class ShowSerializer extends BaseSerializer<InformationSharingAgreement> {
  perform(): AgreementShowView {
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
        "title",
        "description",
        "createdAt",
        "updatedAt",
      ]),
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    }
  }
}

export default ShowSerializer
