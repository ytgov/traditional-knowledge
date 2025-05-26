import http from "@/api/http-client"
import {
  type FiltersOptions,
  type Policy,
  type QueryOptions,
  type WhereOptions,
} from "@/api/base-api"

export type InformationSharingAgreementArchiveItem = {
  id: number
  informationSharingAgreementId: number
  archiveItemId: number
  creatorId: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type InformationSharingAgreementArchiveItemWhereOptions = WhereOptions<
  InformationSharingAgreementArchiveItem,
  "id" | "informationSharingAgreementId" | "archiveItemId" | "creatorId"
>

export type InformationSharingAgreementArchiveItemFiltersOptions = FiltersOptions<{
  search: string | string[]
}>

export type InformationSharingAgreementArchiveItemQueryOptions = QueryOptions<
  InformationSharingAgreementArchiveItemWhereOptions,
  InformationSharingAgreementArchiveItemFiltersOptions
>

export const informationSharingAgreementArchiveItemsApi = {
  async list(params: InformationSharingAgreementArchiveItemQueryOptions = {}): Promise<{
    informationSharingAgreementArchiveItems: InformationSharingAgreementArchiveItem[]
    totalCount: number
  }> {
    const { data } = await http.get("/api/information-sharing-agreement-archive-items", {
      params,
    })
    return data
  },

  async get(informationSharingAgreementArchiveItemId: number): Promise<{
    informationSharingAgreementArchiveItem: InformationSharingAgreementArchiveItem
    policy: Policy
  }> {
    const { data } = await http.get(
      `/api/information-sharing-agreement-archive-items/${informationSharingAgreementArchiveItemId}`
    )
    return data
  },

  async create(attributes: Partial<InformationSharingAgreementArchiveItem>): Promise<{
    informationSharingAgreementArchiveItem: InformationSharingAgreementArchiveItem
  }> {
    const { data } = await http.post("/api/information-sharing-agreement-archive-items", attributes)
    return data
  },

  async update(
    informationSharingAgreementArchiveItemId: number,
    attributes: Partial<InformationSharingAgreementArchiveItem>
  ): Promise<{
    informationSharingAgreementArchiveItem: InformationSharingAgreementArchiveItem
  }> {
    const { data } = await http.patch(
      `/api/information-sharing-agreement-archive-items/${informationSharingAgreementArchiveItemId}`,
      attributes
    )
    return data
  },

  async delete(informationSharingAgreementArchiveItemId: number): Promise<void> {
    const { data } = await http.delete(
      `/api/information-sharing-agreement-archive-items/${informationSharingAgreementArchiveItemId}`
    )
    return data
  },
}

export default informationSharingAgreementArchiveItemsApi
