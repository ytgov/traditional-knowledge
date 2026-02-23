import http from "@/api/http-client"
import { type ArchiveItemShowView } from "@/api/archive-items-api"
import { SecurityLevel } from "@/api/archive-items-api"

export type ArchiveItemCreationAttributes = {
  title: string
  description: string | null
  sharingPurpose: string | null
  confidentialityReceipt: boolean
  yukonFirstNations: string[]
  securityLevel: SecurityLevel
  tags: string[]
} & {
  archiveItemCategoriesAttributes: {
    categoryId: number
  }[]
}

export const archiveItemsApi = {
  async create(
    informationSharingAgreementId: number,
    attributes: Partial<ArchiveItemCreationAttributes>,
    files: File[]
  ): Promise<{
    archiveItem: ArchiveItemShowView
  }> {
    const { data } = await http.post(
      `/api/information-sharing-agreements/${informationSharingAgreementId}/archive-items`,
      {
        ...attributes,
        archiveItemFiles: files,
      }
    )
    return data
  },
}

export default archiveItemsApi
