import { Op } from "@sequelize/core"
import { createIndexDecorator } from "@sequelize/core/decorators-legacy"

export const UserActiveDirectoryIdentifierUniqueIndex = createIndexDecorator(
  "users-active-directory-identifier-unique",
  {
    name: "users_active_directory_identifier_unique",
    unique: true,
    where: {
      activeDirectoryIdentifier: {
        [Op.isNot]: null,
      },
      deletedAt: null,
    },
    msg: "Active directory identifier must be unique.",
  }
)

export default UserActiveDirectoryIdentifierUniqueIndex
