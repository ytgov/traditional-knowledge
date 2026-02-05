import { type Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.integer("external_organization_id").nullable()
    table.foreign("external_organization_id").references("external_organizations.id")
  })

  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("yukon_first_nation")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.string("yukon_first_nation", 100).nullable()
  })

  await knex.schema.alterTable("users", (table) => {
    table.dropForeign(["external_organization_id"])
    table.dropColumn("external_organization_id")
  })
}
