import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("information_sharing_agreements", (table) => {
    table.string("expiration_condition", 100).nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("information_sharing_agreements", (table) => {
    table.dropColumn("expiration_condition")
  })
}
