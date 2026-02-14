import db, { Group, UserGroup, User } from "@/models"
import BaseService from "@/services/base-service"
import { UserGroups } from "@/services"

export class DestroyService extends BaseService {
  constructor(
    private group: Group,
    private currentUser: User
  ) {
    super()
  }

  async perform() {
    return db.transaction(async () => {
      await this.cleanupUserGroups()
      await this.group.destroy()
    })
  }

  private async cleanupUserGroups() {
    await UserGroup.findEach(
      {
        where: {
          groupId: this.group.id,
        },
        include: ["user", "group"],
      },
      async (userGroup) => {
        await UserGroups.DestroyService.perform(userGroup, this.currentUser)
      }
    )
  }
}

export default DestroyService
