import { createIndexDecorator } from "@sequelize/core/decorators-legacy"

export const UserGroupUniqueIndex = createIndexDecorator("user-groups-user-id-group-id-unique", {
  name: "user_groups_user_id_group_id_unique",
  unique: true,
  where: {
    deletedAt: null,
  },
  msg: "User group combination must be unique",
})

export default UserGroupUniqueIndex
