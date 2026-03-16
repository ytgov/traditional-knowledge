import { pick } from "lodash"

import { formatDate } from "@/utils/formatters"

import { type PolicyAsReference } from "@/policies/base-policy"
import { InformationSharingAgreement, type User } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"
import { InformationSharingAgreementPolicy } from "@/policies"

export type InformationSharingAgreementAsIndex = Pick<
  InformationSharingAgreement,
  | "id"
  | "creatorId"
  | "externalGroupId"
  | "externalGroupContactId"
  | "internalGroupId"
  | "internalGroupContactId"
  | "status"
  | "title"
  | "createdAt"
  | "updatedAt"
> & {
  startDate: string | null
  endDate: string | null
} & {
  policy: PolicyAsReference
}

export class IndexSerializer extends BaseSerializer<InformationSharingAgreement> {
  constructor(
    protected record: InformationSharingAgreement,
    protected currentUser: User
  ) {
    super(record)
  }

  perform(): InformationSharingAgreementAsIndex {
    const { startDate, endDate } = this.record
    const formattedStartDate = formatDate(startDate)
    const formattedEndDate = formatDate(endDate)

    const serializedPolicy = this.serializePolicy(this.record, this.currentUser)
    return {
      ...pick(this.record, [
        "id",
        "creatorId",
        "externalGroupId",
        "externalGroupContactId",
        "internalGroupId",
        "internalGroupContactId",
        "status",
        "title",
        "createdAt",
        "updatedAt",
      ]),
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      policy: serializedPolicy,
    }
  }

  private serializePolicy(
    record: InformationSharingAgreement,
    currentUser: User
  ): PolicyAsReference {
    return new InformationSharingAgreementPolicy(currentUser, record).toJSON()
  }
}

export default IndexSerializer
