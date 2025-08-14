import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("archive_items", (table) => {
    table.text("sharing_purpose").notNullable().defaultTo("n/a")
    table.boolean("confidentiality_receipt").notNullable().defaultTo(false)
    table.string("yukon_first_nations", 255).notNullable().defaultTo("n/a")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("archive_items", (table) => {
    table.dropColumn("sharing_purpose")
    table.dropColumn("confidentiality_receipt")
    table.dropColumn("yukon_first_nations")
  })
}
