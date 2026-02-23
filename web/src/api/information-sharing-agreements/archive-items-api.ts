import http from "@/api/http-client"
import { type ArchiveItemShowView } from "@/api/archive-items-api"
import { SecurityLevel } from "@/api/archive-items-api"

export type ArchiveItemCreationAttributes = {
  title: string
  description: string | null
  summary: string | null
  sharingPurpose: string | null
  confidentialityReceipt: boolean
  yukonFirstNations: string[] | null
  securityLevel: SecurityLevel
  tags: string[] | null
} & {
  filesAttributes: File[] | null
  // categoryIds: number[] | null
}

export const archiveItemsApi = {
  async create(
    informationSharingAgreementId: number,
    attributes: Partial<ArchiveItemCreationAttributes>
  ): Promise<{
    archiveItem: ArchiveItemShowView
  }> {
    const { data } = await http.post(
      `/api/information-sharing-agreements/${informationSharingAgreementId}/archive-items`,
      attributes
    )
    return data
  },
}

export default archiveItemsApi
