import { API_BASE_URL } from "@/config"
import http from "@/api/http-client"

export const signedConfidentialityReceiptApi = {
  downloadPath(informationSharingAgreementId: number) {
    return `${API_BASE_URL}/api/downloads/information-sharing-agreements/${informationSharingAgreementId}/signed-confidentiality-receipt`
  },

  async create(informationSharingAgreementId: number): Promise<Blob> {
    const path = signedConfidentialityReceiptApi.downloadPath(informationSharingAgreementId)
    const { data } = await http.post(path, undefined, {
      responseType: "blob",
    })
    return data
  },
}

export default signedConfidentialityReceiptApi
