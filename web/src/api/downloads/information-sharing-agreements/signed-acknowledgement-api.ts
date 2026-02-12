import { API_BASE_URL } from "@/config"
import http from "@/api/http-client"

export const signedAcknowledgementApi = {
  downloadPath(informationSharingAgreementId: number) {
    return `${API_BASE_URL}/api/downloads/information-sharing-agreements/${informationSharingAgreementId}/signed-acknowledgement`
  },

  async create(informationSharingAgreementId: number): Promise<Blob> {
    const path = signedAcknowledgementApi.downloadPath(informationSharingAgreementId)
    const { data } = await http.post(path, undefined, {
      responseType: "blob",
    })
    return data
  },
}

export default signedAcknowledgementApi
