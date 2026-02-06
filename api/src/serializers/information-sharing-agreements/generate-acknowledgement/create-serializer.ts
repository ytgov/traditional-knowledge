import { isNil, isUndefined, truncate } from "lodash"
import { DateTime } from "luxon"

import { InformationSharingAgreement } from "@/models"
import { InformationSharingAgreementExpirationConditions } from "@/models/information-sharing-agreement"
import BaseSerializer from "@/serializers/base-serializer"

const IDENTIFIER_MAX_LENGTH = 80

export type InformationSharingAgreementAsAcknowledgement = {
  identifier: string
  "sharing_group_contact.external_organization.name": string
  "sharing_group_contact.display_name": string
  "sharing_group_contact.title": string
  "sharing_group_contact.email": string
  "sharing_group_contact.phone": string
  "receiving_group_contact.display_name": string
  "receiving_group_contact.title": string
  "receiving_group_contact.department": string
  "receiving_group_contact.branch": string
  "receiving_group_contact.phone": string
  "receiving_group_contact.email": string
  "expiration_condition.is_completion_of_purpose": boolean
  "expiration_condition.is_expiration_date": boolean
  "expiration_condition.is_undetermined_with_default_expiration": boolean
  end_date: string
}

export class CreateSerializer extends BaseSerializer<InformationSharingAgreement> {
  perform(): InformationSharingAgreementAsAcknowledgement {
    const { sharingGroupContact, receivingGroupContact } = this.record
    if (isUndefined(sharingGroupContact)) {
      throw new Error("Expected sharingGroupContact association to be preloaded")
    }

    const { externalOrganization } = sharingGroupContact
    if (isUndefined(externalOrganization)) {
      throw new Error("Expected externalOrganization association to be preloaded")
    }

    if (isUndefined(receivingGroupContact)) {
      throw new Error("Expected receivingGroupContact association to be preloaded")
    }

    const { id, title, expirationCondition, endDate } = this.record
    const identifier = this.buildIdentifier(id, title)

    const isCompletionOfPurpose = this.isCompletionOfPurpose(expirationCondition)
    const isExpirationDate = this.isExpirationDate(expirationCondition)
    const isUndeterminedWithDefaultExpiration =
      this.isUndeterminedWithDefaultExpiration(expirationCondition)
    const formattedEndDate = this.formatEndDate(endDate)

    return {
      identifier,
      "sharing_group_contact.external_organization.name": externalOrganization.name,
      "sharing_group_contact.display_name": sharingGroupContact.displayName,
      "sharing_group_contact.title": sharingGroupContact.title ?? "",
      "sharing_group_contact.email": sharingGroupContact.email,
      "sharing_group_contact.phone": sharingGroupContact.phoneNumber ?? "",
      "receiving_group_contact.display_name": receivingGroupContact.displayName,
      "receiving_group_contact.title": receivingGroupContact.title ?? "",
      "receiving_group_contact.department": receivingGroupContact.department ?? "",
      "receiving_group_contact.branch": receivingGroupContact.branch ?? "",
      "receiving_group_contact.phone": receivingGroupContact.phoneNumber ?? "",
      "receiving_group_contact.email": receivingGroupContact.email,
      "expiration_condition.is_completion_of_purpose": isCompletionOfPurpose,
      "expiration_condition.is_expiration_date": isExpirationDate,
      "expiration_condition.is_undetermined_with_default_expiration":
        isUndeterminedWithDefaultExpiration,
      end_date: formattedEndDate,
    }
  }

  private buildIdentifier(id: number, title: string): string {
    const suffix = ` - ISA#${id}`
    const titleMaxLength = IDENTIFIER_MAX_LENGTH - suffix.length
    const truncatedTitle = truncate(title, {
      length: titleMaxLength,
    })
    return `${truncatedTitle}${suffix}`
  }

  private isCompletionOfPurpose(
    expirationCondition: InformationSharingAgreementExpirationConditions | null
  ): boolean {
    return (
      expirationCondition === InformationSharingAgreement.ExpirationConditions.COMPLETION_OF_PURPOSE
    )
  }

  private isExpirationDate(
    expirationCondition: InformationSharingAgreementExpirationConditions | null
  ): boolean {
    return expirationCondition === InformationSharingAgreement.ExpirationConditions.EXPIRATION_DATE
  }

  private isUndeterminedWithDefaultExpiration(
    expirationCondition: InformationSharingAgreementExpirationConditions | null
  ): boolean {
    return (
      expirationCondition ===
      InformationSharingAgreement.ExpirationConditions.UNDETERMINED_WITH_DEFAULT_EXPIRATION
    )
  }

  private formatEndDate(endDate: Date | null | undefined): string {
    if (isNil(endDate)) {
      return "Not specified"
    }

    const date = DateTime.fromJSDate(endDate)
    if (!date.isValid) {
      return "Not specified"
    }

    return date.toFormat("MM/dd/yyyy")
  }
}

export default CreateSerializer
