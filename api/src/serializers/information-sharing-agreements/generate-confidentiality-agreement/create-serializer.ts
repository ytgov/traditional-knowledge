import { isUndefined } from "lodash"

import { InformationSharingAgreement } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type InformationSharingAgreementAsConfidentialityAgreement = {
  "external_group_contact.external_organization.name": string
  "information_sharing_agreement.purpose": string
  "information_sharing_agreement.department_branch_unit_hierarchy": string
  "information_sharing_agreement.authorized_application": string
  "internal_group_contact.display_name": string
  "internal_group_contact.title": string
  "internal_group_contact.branch": string
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

    const departmentBranchUnitHierarchy = this.buildDepartmentBranchUnitHierarchy(
      this.record.accessLevelDepartmentRestriction,
      this.record.accessLevelBranchRestriction,
      this.record.accessLevelUnitRestriction
    )

    return {
      "external_group_contact.external_organization.name": externalOrganization.name,
      "information_sharing_agreement.purpose": purposeOrFallback,
      "information_sharing_agreement.department_branch_unit_hierarchy": departmentBranchUnitHierarchy,
      "information_sharing_agreement.authorized_application": authorizedApplicationOrFallback,
      "internal_group_contact.display_name": internalGroupContact.displayName,
      "internal_group_contact.title": internalGroupContact.title ?? "",
      "internal_group_contact.branch": internalGroupContact.branch ?? "",
    }
  }

  private buildDepartmentBranchUnitHierarchy(
    department: string | null,
    branch: string | null,
    unit: string | null
  ): string {
    return [department, branch, unit].filter(Boolean).join(", ")
  }
}

export default CreateSerializer
