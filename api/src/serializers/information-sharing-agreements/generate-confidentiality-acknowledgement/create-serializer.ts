import { isEmpty, isNil, truncate } from "lodash"
import { DateTime } from "luxon"

import { InformationSharingAgreement } from "@/models"
import {
  InformationSharingAgreementAccessLevels,
  InformationSharingAgreementConfidentialityType,
  InformationSharingAgreementExpirationConditions,
} from "@/models/information-sharing-agreement"
import BaseSerializer from "@/serializers/base-serializer"

const IDENTIFIER_MAX_LENGTH = 80

/**
 * Drafts are incomplete by design, so every contact association is optional here.
 * Missing values render as a placeholder rather than failing the download.
 */
const NOT_SPECIFIED = "Not specified"

export type InformationSharingAgreementAsConfidentialityAcknowledgement = {
  identifier: string
  purpose: string
  "external_group_contact.external_organization.name": string
  "external_group_contact.display_name": string
  "external_group_contact.title": string
  "external_group_contact.email": string
  "external_group_contact.phone": string
  "internal_group_contact.display_name": string
  "internal_group_contact.title": string
  "internal_group_contact.department": string
  "internal_group_contact.branch": string
  "internal_group_contact.phone": string
  "internal_group_contact.email": string
  "internal_group_secondary_contact.name_and_title": string
  "internal_group_secondary_contact.department_branch_unit_hierarchy": string
  "internal_group_secondary_contact.email": string
  "internal_group_secondary_contact.phone": string
  "expiration_condition.is_completion_of_purpose": boolean
  "expiration_condition.is_expiration_date": boolean
  "expiration_condition.is_undetermined_with_default_expiration": boolean
  end_date: string
  "access_level.is_internal": boolean
  "access_level.is_protected_and_limited": boolean
  "access_level.is_confidential_and_restricted": boolean
  access_level_department_restriction: string
  department_branch_unit_hierarchy: string
  has_additional_access_restrictions: boolean
  additional_access_restrictions: string
  "confidentiality_type.is_accordance": boolean
  "confidentiality_type.is_accepted_in_confidence": boolean
  authorized_application: string
  disclosure_notes: string
}

export class CreateSerializer extends BaseSerializer<InformationSharingAgreement> {
  perform(): InformationSharingAgreementAsConfidentialityAcknowledgement {
    const { externalGroupContact, internalGroupContact, internalGroupSecondaryContact } =
      this.record
    const externalOrganization = externalGroupContact?.externalOrganization

    const { id, title, purpose, expirationCondition, endDate } = this.record
    const identifier = this.buildIdentifier(id, title)

    const secondaryContactNameAndTitle = this.buildNameAndTitle(
      internalGroupSecondaryContact?.displayName,
      internalGroupSecondaryContact?.title
    )
    const secondaryContactDepartmentBranchUnitHierarchy = this.buildDepartmentBranchUnitHierarchy(
      internalGroupSecondaryContact?.department ?? null,
      internalGroupSecondaryContact?.branch ?? null,
      internalGroupSecondaryContact?.unit ?? null
    )

    const isCompletionOfPurpose = this.isCompletionOfPurpose(expirationCondition)
    const isExpirationDate = this.isExpirationDate(expirationCondition)
    const isUndeterminedWithDefaultExpiration =
      this.isUndeterminedWithDefaultExpiration(expirationCondition)
    const formattedEndDate = this.formatEndDate(endDate)

    const purposeOrFallback = purpose ?? NOT_SPECIFIED

    const { accessLevel } = this.record
    const isInternal = this.isInternal(accessLevel)
    const isProtectedAndLimited = this.isProtectedAndLimited(accessLevel)
    const isConfidentialAndRestricted = this.isConfidentialAndRestricted(accessLevel)
    const departmentBranchUnitHierarchy = this.buildDepartmentBranchUnitHierarchy(
      this.record.accessLevelDepartmentRestriction,
      this.record.accessLevelBranchRestriction,
      this.record.accessLevelUnitRestriction
    )

    const { confidentialityType, authorizedApplication } = this.record
    const isAccordance = this.isAccordance(confidentialityType)
    const isAcceptedInConfidence = this.isAcceptedInConfidence(confidentialityType)
    const authorizedApplicationOrFallback = authorizedApplication ?? NOT_SPECIFIED

    return {
      identifier,
      purpose: purposeOrFallback,
      "external_group_contact.external_organization.name":
        externalOrganization?.name ?? NOT_SPECIFIED,
      "external_group_contact.display_name": externalGroupContact?.displayName ?? NOT_SPECIFIED,
      "external_group_contact.title": externalGroupContact?.title ?? "",
      "external_group_contact.email": externalGroupContact?.email ?? "",
      "external_group_contact.phone": externalGroupContact?.phoneNumber ?? "",
      "internal_group_contact.display_name": internalGroupContact?.displayName ?? NOT_SPECIFIED,
      "internal_group_contact.title": internalGroupContact?.title ?? "",
      "internal_group_contact.department": internalGroupContact?.department ?? "",
      "internal_group_contact.branch": internalGroupContact?.branch ?? "",
      "internal_group_contact.phone": internalGroupContact?.phoneNumber ?? "",
      "internal_group_contact.email": internalGroupContact?.email ?? "",
      "internal_group_secondary_contact.name_and_title": secondaryContactNameAndTitle,
      "internal_group_secondary_contact.department_branch_unit_hierarchy":
        secondaryContactDepartmentBranchUnitHierarchy,
      "internal_group_secondary_contact.email": internalGroupSecondaryContact?.email ?? "",
      "internal_group_secondary_contact.phone": internalGroupSecondaryContact?.phoneNumber ?? "",
      "expiration_condition.is_completion_of_purpose": isCompletionOfPurpose,
      "expiration_condition.is_expiration_date": isExpirationDate,
      "expiration_condition.is_undetermined_with_default_expiration":
        isUndeterminedWithDefaultExpiration,
      end_date: formattedEndDate,
      "access_level.is_internal": isInternal,
      "access_level.is_protected_and_limited": isProtectedAndLimited,
      "access_level.is_confidential_and_restricted": isConfidentialAndRestricted,
      access_level_department_restriction: this.record.accessLevelDepartmentRestriction ?? "",
      department_branch_unit_hierarchy: departmentBranchUnitHierarchy,
      has_additional_access_restrictions: this.record.hasAdditionalAccessRestrictions ?? false,
      additional_access_restrictions: this.record.additionalAccessRestrictions ?? "",
      "confidentiality_type.is_accordance": isAccordance,
      "confidentiality_type.is_accepted_in_confidence": isAcceptedInConfidence,
      authorized_application: authorizedApplicationOrFallback,
      disclosure_notes: this.record.disclosureNotes ?? "",
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

  private isInternal(accessLevel: InformationSharingAgreementAccessLevels | null): boolean {
    return accessLevel === InformationSharingAgreement.AccessLevels.INTERNAL
  }

  private isProtectedAndLimited(
    accessLevel: InformationSharingAgreementAccessLevels | null
  ): boolean {
    return accessLevel === InformationSharingAgreement.AccessLevels.PROTECTED_AND_LIMITED
  }

  private isConfidentialAndRestricted(
    accessLevel: InformationSharingAgreementAccessLevels | null
  ): boolean {
    return accessLevel === InformationSharingAgreement.AccessLevels.CONFIDENTIAL_AND_RESTRICTED
  }

  private buildNameAndTitle(
    displayName: string | undefined,
    title: string | null | undefined
  ): string {
    const nameAndTitle = [displayName, title].filter(Boolean).join(", ")
    if (isEmpty(nameAndTitle)) {
      return NOT_SPECIFIED
    }

    return nameAndTitle
  }

  private isAccordance(
    confidentialityType: InformationSharingAgreementConfidentialityType | null
  ): boolean {
    return confidentialityType === InformationSharingAgreement.ConfidentialityTypes.ACCORDANCE
  }

  private isAcceptedInConfidence(
    confidentialityType: InformationSharingAgreementConfidentialityType | null
  ): boolean {
    return (
      confidentialityType ===
      InformationSharingAgreement.ConfidentialityTypes.ACCEPTED_IN_CONFIDENCE
    )
  }

  private buildDepartmentBranchUnitHierarchy(
    accessLevelDepartmentRestriction: string | null,
    accessLevelBranchRestriction: string | null,
    accessLevelUnitRestriction: string | null
  ): string {
    return [
      accessLevelDepartmentRestriction,
      accessLevelBranchRestriction,
      accessLevelUnitRestriction,
    ]
      .filter(Boolean)
      .join(" / ")
  }
}

export default CreateSerializer
