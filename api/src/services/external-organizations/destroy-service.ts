import { ExternalOrganization, type User } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  constructor(
    private externalOrganization: ExternalOrganization,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<void> {
    await this.externalOrganization.destroy()
  }
}

export default DestroyService
