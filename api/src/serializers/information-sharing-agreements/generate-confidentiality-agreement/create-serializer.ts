import { isEmpty, isUndefined } from "lodash"

import { InformationSharingAgreement } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type InformationSharingAgreementAsConfidentialityAgreement = {
  "external_group_contact.external_organization.name": string
  "information_sharing_agreement.purpose": string
  "information_sharing_agreement.authorized_application": string
  "internal_group_contact.department": string
  "internal_group_contact.branch_unit_hierarchy": string
  "internal_group_contact.display_name": string
  "internal_group_contact.title": string
  has_internal_group_contact_branch_or_unit: boolean
}

export class CreateSerializer extends BaseSerializer<InformationSharingAgreement> {
  perform(): InformationSharingAgreementAsConfidentialityAgreement {
    const { externalGroupContact, internalGroupContact } = this.record
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

    const { purpose, authorizedApplication } = this.record
    const purposeOrFallback = purpose ?? ""
    const authorizedApplicationOrFallback = authorizedApplication ?? ""

    const internalGroupContactDepartment = internalGroupContact.department ?? ""
    const internalGroupContactBranchUnitHierarchy = this.buildBranchUnitHierarchy(
      internalGroupContact.branch,
      internalGroupContact.unit
    )
    const hasInternalGroupContactBranchOrUnit = !isEmpty(internalGroupContactBranchUnitHierarchy)

    return {
      "external_group_contact.external_organization.name": externalOrganization.name,
      "information_sharing_agreement.purpose": purposeOrFallback,
      "information_sharing_agreement.authorized_application": authorizedApplicationOrFallback,
      "internal_group_contact.department": internalGroupContactDepartment,
      "internal_group_contact.branch_unit_hierarchy": internalGroupContactBranchUnitHierarchy,
      "internal_group_contact.display_name": internalGroupContact.displayName,
      "internal_group_contact.title": internalGroupContact.title ?? "",
      has_internal_group_contact_branch_or_unit: hasInternalGroupContactBranchOrUnit,
    }
  }

  private buildBranchUnitHierarchy(branch: string | null, unit: string | null): string {
    return [branch, unit].filter(Boolean).join(", ")
  }
}

export default CreateSerializer
