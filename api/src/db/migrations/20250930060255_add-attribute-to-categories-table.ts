import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("categories", (table) => {
    table.integer("retention_id").nullable()
    table.foreign("retention_id").references("id").inTable("retentions")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("categories", (table) => {
    table.dropForeign("retention_id")
    table.dropColumn("retention_id")
  })
}
