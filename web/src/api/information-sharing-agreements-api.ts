import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"

export type InformationSharingAgreement = {
  id: number
  creatorId: number
  sharingGroupId: number | null
  sharingGroupContactId: number | null
  receivingGroupId: number | null
  receivingGroupContactId: number | null
  identifier: string | null
  sharingGroupInfo: string | null
  receivingGroupInfo: string | null
  sharingGroupContactName: string | null
  receivingGroupContactName: string | null
  sharingGroupContactTitle: string | null
  receivingGroupContactTitle: string | null
  sharingGroupSignedBy: string | null
  receivingGroupSignedBy: string | null
  sharingGroupSignedDate: string | null
  receivingGroupSignedDate: string | null
  title: string
  description: string | null
  purpose: string | null
  detailLevel: string | null
  detailNotes: string | null
  formats: string | null
  accessLevels: string | null
  accessNotes: string | null
  confidentiality: string | null
  authorizedApplication: string | null
  creditLines: string | null
  creditNotes: string | null
  expirationActions: string | null
  expirationNotes: string | null
  breachActions: string | null
  breachNotes: string | null
  disclosureNotes: string | null
  fileName: string | null
  fileData: string | null
  fileMimeType: string | null
  fileSize: number | null
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
}

export type InformationSharingAgreementWhereOptions = WhereOptions<
  InformationSharingAgreement,
  | "creatorId"
  | "sharingGroupId"
  | "sharingGroupContactId"
  | "receivingGroupId"
  | "receivingGroupContactId"
  | "identifier"
  | "sharingGroupInfo"
  | "receivingGroupInfo"
  | "sharingGroupContactName"
  | "receivingGroupContactName"
  | "sharingGroupContactTitle"
  | "receivingGroupContactTitle"
  | "sharingGroupSignedBy"
  | "receivingGroupSignedBy"
  | "sharingGroupSignedDate"
  | "receivingGroupSignedDate"
  | "title"
  | "description"
  | "purpose"
  | "detailLevel"
  | "detailNotes"
  | "formats"
  | "accessLevels"
  | "accessNotes"
  | "confidentiality"
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
  async list(params: InformationSharingAgreementQueryOptions = {}): Promise<{
    informationSharingAgreements: InformationSharingAgreement[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/information-sharing-agreements", {
      params,
    })
    return data
  },
  async get(informationSharingAgreementId: number): Promise<{
    informationSharingAgreement: InformationSharingAgreement
    policy: Policy
  }> {
    const { data } = await http.get(
      `/api/information-sharing-agreements/${informationSharingAgreementId}`
    )
    return data
  },
  async create(attributes: Partial<InformationSharingAgreement>): Promise<{
    informationSharingAgreement: InformationSharingAgreement
  }> {
    const { data } = await http.post("/api/information-sharing-agreements", attributes)
    return data
  },
  async update(
    informationSharingAgreementId: number,
    attributes: Partial<InformationSharingAgreement>
  ): Promise<{
    informationSharingAgreement: InformationSharingAgreement
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
  async downloadFile(informationSharingAgreementId: number): Promise<Blob> {
    const { data } = await http.get(
      `/api/information-sharing-agreements/${informationSharingAgreementId}/file`,
      {
        responseType: "blob",
      }
    )
    return data
  },
  async generateDocument(informationSharingAgreementId: number): Promise<Blob> {
    const { data } = await http.get(
      `/api/information-sharing-agreements/${informationSharingAgreementId}/generate-document`,
      {
        responseType: "blob",
      }
    )
    return data
  },
}

export default informationSharingAgreementsApi
