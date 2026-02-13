import { isNil, isUndefined, pick } from "lodash"

import { formatDate } from "@/utils/formatters"
import { Attachments } from "@/serializers"

import { Attachment, InformationSharingAgreement } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type InformationSharingAgreementAsShow = Pick<
  InformationSharingAgreement,
  | "id"
  | "creatorId"
  | "externalGroupId"
  | "externalGroupContactId"
  | "internalGroupId"
  | "internalGroupContactId"
  | "internalGroupSecondaryContactId"
  | "status"
  | "identifier"
  | "externalGroupInfo"
  | "internalGroupInfo"
  | "externalGroupContactName"
  | "internalGroupContactName"
  | "externalGroupContactTitle"
  | "internalGroupContactTitle"
  | "signedById"
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
  signedAt: string | null
  // Associations
  signedAcknowledgement: Attachments.AsReference | null
}

export class ShowSerializer extends BaseSerializer<InformationSharingAgreement> {
  perform(): InformationSharingAgreementAsShow {
    const { signedAcknowledgement } = this.record
    if (isUndefined(signedAcknowledgement)) {
      throw new Error("Expected signed acknowledgement association to be preloaded.")
    }

    const { startDate, endDate, signedAt } = this.record
    const formattedStartDate = formatDate(startDate)
    const formattedEndDate = formatDate(endDate)
    const formattedSignedAt = formatDate(signedAt)

    const serializedSignedAcknowledgement =
      this.serializeSignedAcknowledgement(signedAcknowledgement)

    return {
      ...pick(this.record, [
        "id",
        "creatorId",
        "externalGroupId",
        "externalGroupContactId",
        "internalGroupId",
        "internalGroupContactId",
        "internalGroupSecondaryContactId",
        "status",
        "identifier",
        "externalGroupInfo",
        "internalGroupInfo",
        "externalGroupContactName",
        "internalGroupContactName",
        "externalGroupContactTitle",
        "internalGroupContactTitle",
        "signedById",
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
      signedAt: formattedSignedAt,
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
