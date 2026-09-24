import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("information_sharing_agreements", (table) => {
    table.dropColumn("detail_level")
    table.dropColumn("detail_notes")
    table.dropColumn("formats")
    table.dropColumn("credit_lines")
    table.dropColumn("credit_notes")
    table.dropColumn("expiration_actions")
    table.dropColumn("expiration_notes")
    table.dropColumn("breach_actions")
    table.dropColumn("breach_notes")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("information_sharing_agreements", (table) => {
    table.string("detail_level", 250)
    table.text("detail_notes")
    table.string("formats", 500)
    table.string("credit_lines", 500)
    table.text("credit_notes")
    table.string("expiration_actions", 500)
    table.text("expiration_notes")
    table.string("breach_actions", 500)
    table.text("breach_notes")
  })
}
