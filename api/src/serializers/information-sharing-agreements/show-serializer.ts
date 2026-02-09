import { isNil, isUndefined, pick } from "lodash"

import { formatDate } from "@/utils/formatters"
import { Attachments } from "@/serializers"

import { Attachment, InformationSharingAgreement } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type AgreementShowAsShow = Pick<
  InformationSharingAgreement,
  | "id"
  | "creatorId"
  | "sharingGroupId"
  | "sharingGroupContactId"
  | "receivingGroupId"
  | "receivingGroupContactId"
  | "receivingGroupSecondaryContactId"
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
  | "createdAt"
  | "updatedAt"
> & {
  startDate: string | null
  endDate: string | null
  sharingGroupSignedDate: string | null
  receivingGroupSignedDate: string | null
  // Associations
  signedAcknowledgement: Attachments.AsReference | null
}

export class ShowSerializer extends BaseSerializer<InformationSharingAgreement> {
  perform(): AgreementShowAsShow {
    const { signedAcknowledgement } = this.record
    if (isUndefined(signedAcknowledgement)) {
      throw new Error("Expected signed acknowledgement association to be preloaded.")
    }

    const { startDate, endDate, sharingGroupSignedDate, receivingGroupSignedDate } = this.record
    const formattedStartDate = formatDate(startDate)
    const formattedEndDate = formatDate(endDate)
    const formattedSharingGroupSignedDate = formatDate(sharingGroupSignedDate)
    const formattedReceivingGroupSignedDate = formatDate(receivingGroupSignedDate)

    const serializedSignedAcknowledgement =
      this.serializeSignedAcknowledgement(signedAcknowledgement)

    return {
      ...pick(this.record, [
        "id",
        "creatorId",
        "sharingGroupId",
        "sharingGroupContactId",
        "receivingGroupId",
        "receivingGroupContactId",
        "receivingGroupSecondaryContactId",
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
        "createdAt",
        "updatedAt",
      ]),
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      sharingGroupSignedDate: formattedSharingGroupSignedDate,
      receivingGroupSignedDate: formattedReceivingGroupSignedDate,
      signedAcknowledgement: serializedSignedAcknowledgement,
    }
  }

  private serializeSignedAcknowledgement(
    signedAcknowledgement: Attachment | null
  ): Attachments.AsReference | null {
    if (isNil(signedAcknowledgement)) return null

    return Attachments.ReferenceSerializer.perform(signedAcknowledgement)
  }
}

export default ShowSerializer
