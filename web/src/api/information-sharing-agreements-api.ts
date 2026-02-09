import { API_BASE_URL } from "@/config"
import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"
import { type AttachmentAsReference } from "@/api/attachments-api"

export enum InformationSharingAgreementAccessLevels {
  INTERNAL = "internal",
  PROTECTED_AND_LIMITED = "protected_and_limited",
  CONFIDENTIAL_AND_RESTRICTED = "confidential_and_restricted",
}

export enum InformationSharingAgreementExpirationConditions {
  COMPLETION_OF_PURPOSE = "completion_of_purpose",
  EXPIRATION_DATE = "expiration_date",
  UNDETERMINED_WITH_DEFAULT_EXPIRATION = "undetermined_with_default_expiration",
}

export enum InformationSharingAgreementConfidentialityType {
  ACCORDANCE = "ACCORDANCE",
  ACCEPTED_IN_CONFIDENCE = "ACCEPTED_IN_CONFIDENCE",
}

export enum InformationSharingAgreementStatuses {
  DRAFT = "draft",
  SIGNED = "signed",
  CLOSED = "closed",
}

/** Keep in sync with api/src/models/information-sharing-agreement.ts */
export type InformationSharingAgreement = {
  id: number
  creatorId: number
  sharingGroupId: number | null
  sharingGroupContactId: number | null
  receivingGroupId: number | null
  receivingGroupContactId: number | null
  receivingGroupSecondaryContactId: number | null
  status: InformationSharingAgreementStatuses
  identifier: string | null
  sharingGroupInfo: string | null
  receivingGroupInfo: string | null
  sharingGroupContactName: string | null
  receivingGroupContactName: string | null
  sharingGroupContactTitle: string | null
  receivingGroupContactTitle: string | null
  signedById: number | null
  signedAt: string | null
  title: string
  description: string | null
  purpose: string | null
  detailLevel: string | null
  detailNotes: string | null
  formats: string | null
  accessLevel: InformationSharingAgreementAccessLevels | null
  accessLevelDepartmentRestriction: string | null
  accessLevelBranchRestriction: string | null
  accessLevelUnitRestriction: string | null
  hasAdditionalAccessRestrictions: boolean | null
  additionalAccessRestrictions: string | null
  expirationCondition: InformationSharingAgreementExpirationConditions | null
  confidentialityType: InformationSharingAgreementConfidentialityType | null
  authorizedApplication: string | null
  creditLines: string | null
  creditNotes: string | null
  expirationActions: string | null
  expirationNotes: string | null
  breachActions: string | null
  breachNotes: string | null
  disclosureNotes: string | null
  startDate: string | null
  endDate: string | null
  createdAt: string
  updatedAt: string
}

/** Keep in sync with api/src/serializers/information-sharing-agreements/index-serializer.ts */
export type InformationSharingAgreementAsIndex = Pick<
  InformationSharingAgreement,
  | "id"
  | "creatorId"
  | "sharingGroupId"
  | "sharingGroupContactId"
  | "receivingGroupId"
  | "receivingGroupContactId"
  | "status"
  | "title"
  | "createdAt"
  | "updatedAt"
> & {
  startDate: string | null
  endDate: string | null
}

/** Keep in sync with api/src/serializers/information-sharing-agreements/show-serializer.ts */
export type InformationSharingAgreementAsShow = Pick<
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
  signedAcknowledgement: AttachmentAsReference | null
}

export type InformationSharingAgreementPolicy = Policy

export type InformationSharingAgreementWhereOptions = WhereOptions<
  InformationSharingAgreement,
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
  | "signedById"
  | "signedAt"
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
  | "startDate"
  | "endDate"
>

export type InformationSharingAgreementFiltersOptions = FiltersOptions<{
  search: string | string[]
  notAssociatedWithArchiveItem: number
}>

export type InformationSharingAgreementQueryOptions = QueryOptions<
  InformationSharingAgreementWhereOptions,
  InformationSharingAgreementFiltersOptions
>

export const informationSharingAgreementsApi = {
  generateAcknowledgementPath(informationSharingAgreementId: number) {
    return `${API_BASE_URL}/api/information-sharing-agreements/${informationSharingAgreementId}/generate-acknowledgement?format=docx`
  },

  async list(params: InformationSharingAgreementQueryOptions = {}): Promise<{
    informationSharingAgreements: InformationSharingAgreementAsIndex[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/information-sharing-agreements", {
      params,
    })
    return data
  },
  async get(informationSharingAgreementId: number): Promise<{
    informationSharingAgreement: InformationSharingAgreementAsShow
    policy: InformationSharingAgreementPolicy
  }> {
    const { data } = await http.get(
      `/api/information-sharing-agreements/${informationSharingAgreementId}`
    )
    return data
  },
  async create(attributes: Partial<InformationSharingAgreement>): Promise<{
    informationSharingAgreement: InformationSharingAgreementAsShow
  }> {
    const { data } = await http.post("/api/information-sharing-agreements", attributes)
    return data
  },
  async update(
    informationSharingAgreementId: number,
    attributes: Partial<InformationSharingAgreement>
  ): Promise<{
    informationSharingAgreement: InformationSharingAgreementAsShow
  }> {
    const { data } = await http.patch(
      `/api/information-sharing-agreements/${informationSharingAgreementId}`,
      attributes
    )
    return data
  },
  async delete(informationSharingAgreementId: number): Promise<void> {
    const { data } = await http.delete(
      `/api/information-sharing-agreements/${informationSharingAgreementId}`
    )
    return data
  },

  // Stateful Actions
  async sign(
    informationSharingAgreementId: number,
    signedAcknowledgement: File
  ): Promise<{
    informationSharingAgreement: InformationSharingAgreementAsShow
  }> {
    const formData = new FormData()
    formData.append("signedAcknowledgement", signedAcknowledgement)
    const { data } = await http.post(
      `/api/information-sharing-agreements/${informationSharingAgreementId}/sign`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    return data
  },
  async revertToDraft(informationSharingAgreementId: number): Promise<{
    informationSharingAgreement: InformationSharingAgreementAsShow
  }> {
    const { data } = await http.post(
      `/api/information-sharing-agreements/${informationSharingAgreementId}/revert-to-draft`
    )
    return data
  },
}

export default informationSharingAgreementsApi
