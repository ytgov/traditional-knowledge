import { Op } from "@sequelize/core"
import { createIndexDecorator } from "@sequelize/core/decorators-legacy"

export const UserExternalDirectoryIdentifierUniqueIndex = createIndexDecorator(
  "users-external-directory-identifier-unique",
  {
    name: "users_external_directory_identifier_unique",
    unique: true,
    where: {
      externalDirectoryIdentifier: {
        [Op.isNot]: null,
      },
      deletedAt: null,
    },
    msg: "External directory identifier must be unique.",
  }
)

export default UserExternalDirectoryIdentifierUniqueIndex
