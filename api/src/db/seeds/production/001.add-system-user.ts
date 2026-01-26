import { Knex } from "knex"
import { isNil } from "lodash"

import logger from "@/utils/logger"
import { User } from "@/models"

export async function seed(_knex: Knex): Promise<void> {
  const usersAttributes = [
    {
      email: "system.user@yukon.ca",
      auth0Subject: "00000000-0000-0000-0000-000000000000",
      firstName: "System",
      lastName: "User",
      displayName: "System User",
      roles: [User.Roles.SYSTEM_ADMIN],
      title: "System User",
      department: "System Users",
    },
  ]
  for (const attributes of usersAttributes) {
    let user = await User.findOne({
      where: {
        email: attributes.email,
      },
    })
    if (isNil(user)) {
      user = await User.create(attributes)
      logger.info("System user created:", user.dataValues)
    } else {
      await user.update(attributes)
      logger.info("System user updated:", user.dataValues)
    }
  }
}
