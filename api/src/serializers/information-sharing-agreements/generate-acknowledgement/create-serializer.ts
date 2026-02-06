import { isNil, isUndefined, truncate } from "lodash"
import { DateTime } from "luxon"

import { InformationSharingAgreement } from "@/models"
import {
  InformationSharingAgreementAccessLevels,
  InformationSharingAgreementExpirationConditions,
} from "@/models/information-sharing-agreement"
import BaseSerializer from "@/serializers/base-serializer"

const IDENTIFIER_MAX_LENGTH = 80

export type InformationSharingAgreementAsAcknowledgement = {
  identifier: string
  purpose: string
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
  "access_level.is_internal": boolean
  "access_level.is_protected_and_limited": boolean
  "access_level.is_confidential_and_restricted": boolean
  department_branch_unit_hierarchy: string
  has_additional_access_restrictions: boolean
  additional_access_restrictions: string
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

    const { id, title, purpose, expirationCondition, endDate } = this.record
    const identifier = this.buildIdentifier(id, title)

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

    return {
      identifier,
      purpose: purposeOrFallback,
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
      "access_level.is_internal": isInternal,
      "access_level.is_protected_and_limited": isProtectedAndLimited,
      "access_level.is_confidential_and_restricted": isConfidentialAndRestricted,
      department_branch_unit_hierarchy: departmentBranchUnitHierarchy,
      has_additional_access_restrictions: this.record.hasAdditionalAccessRestrictions ?? false,
      additional_access_restrictions: this.record.additionalAccessRestrictions ?? "",
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
