import { Op } from "@sequelize/core"

import { APPLICATION_NAME } from "@/config"

import { Group, User } from "@/models"
import ApplicationMailer from "@/mailers/application-mailer"

export class NotifyAdminsOfAddedUserMailer extends ApplicationMailer {
  constructor(
    private group: Group,
    private user: User,
    private currentUser: User
  ) {
    super(__filename)
  }

  async perform() {
    const { name: groupName } = this.group
    const subject = `${APPLICATION_NAME}: User was added to a group`

    await this.group.reload({ include: ["adminUsers"] })

    const groupAdmins = this.group.adminUsers ?? []

    const excludedUserIds = groupAdmins.map((user) => user.id)
    excludedUserIds.push(this.currentUser.id)

    const systemAdmins = await User.findAll({
      where: {
        roles: {
          [Op.like]: `%${User.Roles.SYSTEM_ADMIN}%`,
        } as { [Op.like]: string },
        id: {
          [Op.notIn]: excludedUserIds,
        },
      },
    })

    const to = this.buildTo([...systemAdmins, ...groupAdmins])

    const { firstName, lastName } = this.user

    const data = {
      groupName,
      firstName,
      lastName,
    }

    return this.mail({ to, subject }, data)
  }
}

export default NotifyAdminsOfAddedUserMailer
