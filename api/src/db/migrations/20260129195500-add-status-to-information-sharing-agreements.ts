import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("information_sharing_agreements", (table) => {
    table.string("status").notNullable().defaultTo("draft")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("information_sharing_agreements", (table) => {
    table.dropColumn("status")
  })
}
