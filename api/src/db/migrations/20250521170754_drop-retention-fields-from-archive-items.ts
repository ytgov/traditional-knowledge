import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("archive_items", (table) => {
    table.dropIndex(["calculated_expire_date"], "archive_items_calculated_expire_date")
    table.dropIndex(["override_expire_date"], "archive_items_override_expire_date")

    table.dropColumn("retention_name")
    table.dropColumn("calculated_expire_date")
    table.dropColumn("override_expire_date")
    table.dropColumn("expire_action")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("archive_items", (table) => {
    table.string("retention_name", 255).notNullable()
    table.specificType("calculated_expire_date", "DATETIME2(0)").notNullable()
    table.specificType("override_expire_date", "DATETIME2(0)")
    table.string("expire_action", 255).notNullable()

    table.index(["calculated_expire_date"], "archive_items_calculated_expire_date")
    table.index(["override_expire_date"], "archive_items_override_expire_date")
  })
}
