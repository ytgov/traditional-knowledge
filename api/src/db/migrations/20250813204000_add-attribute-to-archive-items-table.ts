import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("archive_items", (table) => {
    table.text("sharing_purpose").notNullable().defaultTo("n/a")
    table.boolean("confidentiality_receipt").notNullable().defaultTo(false)
    table.integer("retention_id").notNullable().defaultTo(1)
    table.integer("category_id").notNullable().defaultTo(1)
    table.string("yukon_first_nation", 255).notNullable().defaultTo("n/a")

    table.foreign("retention_id").references("id").inTable("retentions")
    table.foreign("category_id").references("id").inTable("categories")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("archive_items", (table) => {
    table.dropColumn("sharing_purpose")
    table.dropColumn("confidentiality_receipt")
    table.dropColumn("retention")
    table.dropColumn("categories")
    table.dropColumn("yukon_first_nation")
  })
}
