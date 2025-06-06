import { APPLICATION_NAME } from "@/config"

import { Group, User } from "@/models"
import ApplicationMailer from "@/mailers/application-mailer"

export class NotifyUserOfMembershipMailer extends ApplicationMailer {
  constructor(
    private group: Group,
    private user: User
  ) {
    super(__filename)
  }

  async perform() {
    if (!this.user.emailNotificationsEnabled) {
      return
    }

    const { name: groupName } = this.group
    const subject = `${APPLICATION_NAME}: You have been added to a group`

    const data = {
      groupName,
    }

    return this.mail({ to: this.user.email, subject }, data)
  }
}

export default NotifyUserOfMembershipMailer
