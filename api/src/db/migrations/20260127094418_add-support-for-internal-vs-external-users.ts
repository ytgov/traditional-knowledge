import { Knex } from "knex"
import { isNil } from "lodash"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.boolean("is_external").notNullable().defaultTo(false)
    table.string("phone_number", 50).nullable()
    table.integer("created_by_id").nullable()

    table.foreign("created_by_id").references("users.id")
  })

  let systemUser = await knex("users")
    .select("id")
    .where("email", "system.user@yukon.ca")
    .first<{ id: number }>()

  if (isNil(systemUser)) {
    ;[systemUser] = await knex("users")
      .insert({
        email: "system.user@yukon.ca",
        auth0_subject: "NO_LOGIN_system.user@yukon.ca",
        first_name: "System",
        last_name: "User",
        display_name: "System User",
        roles: "system_admin",
        title: "System User",
        department: "System Users",
        is_external: false,
      })
      .returning<{ id: number }[]>(["id"])
  }

  const systemUserId: number = systemUser.id

  await knex("users").whereNull("created_by_id").update({
    created_by_id: systemUserId,
  })

  await knex.schema.alterTable("users", (table) => {
    table.integer("created_by_id").notNullable().alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.dropForeign(["created_by_id"])
    table.dropColumn("is_external")
    table.dropColumn("phone_number")
    table.dropColumn("created_by_id")
  })
}
