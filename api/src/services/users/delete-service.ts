import db, { User, UserGroup } from "@/models"
import BaseService from "@/services/base-service"

export class DestroyService extends BaseService {
  private user: User
  private currentUser: User

  constructor(user: User, currentUser: User) {
    super()
    this.user = user
    this.currentUser = currentUser
  }

  async perform() {
    return db.transaction(async () => {
      await UserGroup.destroy({
        where: {
          userId: this.user.id,
        },
      })

      await this.user.destroy()
    })
  }
}

export default DestroyService
