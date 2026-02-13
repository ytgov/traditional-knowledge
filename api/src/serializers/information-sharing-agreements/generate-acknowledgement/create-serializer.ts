import { isNil, isUndefined, truncate } from "lodash"
import { DateTime } from "luxon"

import { InformationSharingAgreement } from "@/models"
import {
  InformationSharingAgreementAccessLevels,
  InformationSharingAgreementConfidentialityType,
  InformationSharingAgreementExpirationConditions,
} from "@/models/information-sharing-agreement"
import BaseSerializer from "@/serializers/base-serializer"

const IDENTIFIER_MAX_LENGTH = 80

export type InformationSharingAgreementAsAcknowledgement = {
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
  department_branch_unit_hierarchy: string
  has_additional_access_restrictions: boolean
  additional_access_restrictions: string
  "confidentiality_type.is_accordance": boolean
  "confidentiality_type.is_accepted_in_confidence": boolean
  authorized_application: string
}

export class CreateSerializer extends BaseSerializer<InformationSharingAgreement> {
  perform(): InformationSharingAgreementAsAcknowledgement {
    const { externalGroupContact, internalGroupContact, internalGroupSecondaryContact } =
      this.record
    if (isUndefined(externalGroupContact)) {
      throw new Error("Expected externalGroupContact association to be preloaded")
    }

    const { externalOrganization } = externalGroupContact
    if (isUndefined(externalOrganization)) {
      throw new Error("Expected externalOrganization association to be preloaded")
    }

    if (isUndefined(internalGroupContact)) {
      throw new Error("Expected internalGroupContact association to be preloaded")
    }

    if (isUndefined(internalGroupSecondaryContact)) {
      throw new Error("Expected internalGroupSecondaryContact association to be preloaded")
    }

    const { id, title, purpose, expirationCondition, endDate } = this.record
    const identifier = this.buildIdentifier(id, title)

    const secondaryContactNameAndTitle = this.buildNameAndTitle(
      internalGroupSecondaryContact.displayName,
      internalGroupSecondaryContact.title
    )
    const secondaryContactDepartmentBranchUnitHierarchy = this.buildDepartmentBranchUnitHierarchy(
      internalGroupSecondaryContact.department,
      internalGroupSecondaryContact.branch,
      internalGroupSecondaryContact.unit
    )

    const isCompletionOfPurpose = this.isCompletionOfPurpose(expirationCondition)
    const isExpirationDate = this.isExpirationDate(expirationCondition)
    const isUndeterminedWithDefaultExpiration =
      this.isUndeterminedWithDefaultExpiration(expirationCondition)
    const formattedEndDate = this.formatEndDate(endDate)

    const purposeOrFallback = purpose ?? "Not specified"

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
    const authorizedApplicationOrFallback = authorizedApplication ?? "Not specified"

    return {
      identifier,
      purpose: purposeOrFallback,
      "external_group_contact.external_organization.name": externalOrganization.name,
      "external_group_contact.display_name": externalGroupContact.displayName,
      "external_group_contact.title": externalGroupContact.title ?? "",
      "external_group_contact.email": externalGroupContact.email,
      "external_group_contact.phone": externalGroupContact.phoneNumber ?? "",
      "internal_group_contact.display_name": internalGroupContact.displayName,
      "internal_group_contact.title": internalGroupContact.title ?? "",
      "internal_group_contact.department": internalGroupContact.department ?? "",
      "internal_group_contact.branch": internalGroupContact.branch ?? "",
      "internal_group_contact.phone": internalGroupContact.phoneNumber ?? "",
      "internal_group_contact.email": internalGroupContact.email,
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
      department_branch_unit_hierarchy: departmentBranchUnitHierarchy,
      has_additional_access_restrictions: this.record.hasAdditionalAccessRestrictions ?? false,
      additional_access_restrictions: this.record.additionalAccessRestrictions ?? "",
      "confidentiality_type.is_accordance": isAccordance,
      "confidentiality_type.is_accepted_in_confidence": isAcceptedInConfidence,
      authorized_application: authorizedApplicationOrFallback,
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
    return [displayName, title].filter(Boolean).join(", ")
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
