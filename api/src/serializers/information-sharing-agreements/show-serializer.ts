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
  | "status"
  | "identifier"
  | "sharingGroupInfo"
  | "receivingGroupInfo"
  | "sharingGroupContactName"
  | "receivingGroupContactName"
  | "sharingGroupContactTitle"
  | "receivingGroupContactTitle"
  | "sharingGroupSignedBy"
  | "receivingGroupSignedBy"
  | "title"
  | "description"
  | "purpose"
  | "detailLevel"
  | "detailNotes"
  | "formats"
  | "accessLevel"
  | "accessLevelDepartmentRestriction"
  | "accessLevelBranchRestriction"
  | "accessLevelUnitRestriction"
  | "hasAdditionalAccessRestrictions"
  | "additionalAccessRestrictions"
  | "expirationCondition"
  | "confidentialityType"
  | "authorizedApplication"
  | "creditLines"
  | "creditNotes"
  | "expirationActions"
  | "expirationNotes"
  | "breachActions"
  | "breachNotes"
  | "disclosureNotes"
  | "fileName"
  | "fileMimeType"
  | "fileSize"
  | "createdAt"
  | "updatedAt"
> & {
  startDate: string | null
  endDate: string | null
  sharingGroupSignedDate: string | null
  receivingGroupSignedDate: string | null
}

export class ShowSerializer extends BaseSerializer<InformationSharingAgreement> {
  perform(): AgreementShowView {
    const { startDate, endDate, sharingGroupSignedDate, receivingGroupSignedDate } = this.record
    const formattedStartDate = formatDate(startDate)
    const formattedEndDate = formatDate(endDate)
    const formattedSharingGroupSignedDate = sharingGroupSignedDate
      ? formatDate(sharingGroupSignedDate)
      : null
    const formattedReceivingGroupSignedDate = receivingGroupSignedDate
      ? formatDate(receivingGroupSignedDate)
      : null

    return {
      ...pick(this.record, [
        "id",
        "creatorId",
        "sharingGroupId",
        "sharingGroupContactId",
        "receivingGroupId",
        "receivingGroupContactId",
        "status",
        "identifier",
        "sharingGroupInfo",
        "receivingGroupInfo",
        "sharingGroupContactName",
        "receivingGroupContactName",
        "sharingGroupContactTitle",
        "receivingGroupContactTitle",
        "sharingGroupSignedBy",
        "receivingGroupSignedBy",
        "title",
        "description",
        "purpose",
        "detailLevel",
        "detailNotes",
        "formats",
        "accessLevel",
        "accessLevelDepartmentRestriction",
        "accessLevelBranchRestriction",
        "accessLevelUnitRestriction",
        "hasAdditionalAccessRestrictions",
        "additionalAccessRestrictions",
        "expirationCondition",
        "confidentialityType",
        "authorizedApplication",
        "creditLines",
        "creditNotes",
        "expirationActions",
        "expirationNotes",
        "breachActions",
        "breachNotes",
        "disclosureNotes",
        "fileName",
        "fileMimeType",
        "fileSize",
        "createdAt",
        "updatedAt",
      ]),
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      sharingGroupSignedDate: formattedSharingGroupSignedDate,
      receivingGroupSignedDate: formattedReceivingGroupSignedDate,
    }
  }
}

export default ShowSerializer
