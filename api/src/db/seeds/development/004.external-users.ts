import { Knex } from "knex"
import { isNil } from "lodash"

import logger from "@/utils/logger"
import { User, ExternalOrganization } from "@/models"

export async function seed(_knex: Knex): Promise<void> {
  const trondekHwechinOrganization = await ExternalOrganization.findOne({
    where: {
      name: "Tr'ondëk Hwëch'in",
    },
    rejectOnEmpty: true,
  })

  const externalUsersAttributes = [
    {
      email: "roberta.joseph@trondek.ca",
      auth0Subject: "NO_LOGIN_roberta.joseph@trondek.ca",
      firstName: "Roberta",
      lastName: "Joseph",
      displayName: "Chief Roberta Joseph",
      roles: [User.Roles.USER],
      title: "Chief",
      isExternal: true,
      externalOrganizationId: trondekHwechinOrganization.id,
      phoneNumber: "(867) 993-7100", // Tr'ondëk Hwëch'in Government main line
    },
  ]

  for (const attributes of externalUsersAttributes) {
    let user = await User.findOne({
      where: {
        email: attributes.email,
      },
    })
    if (isNil(user)) {
      user = await User.create(attributes)
      logger.debug("External user created:", { user: user.dataValues })
    } else {
      await user.update(attributes)
      logger.debug("External user updated:", { user: user.dataValues })
    }
  }
}
