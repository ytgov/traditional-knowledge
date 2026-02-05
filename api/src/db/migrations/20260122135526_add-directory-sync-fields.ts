import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.string("external_directory_identifier").nullable()
    table.specificType("last_sync_success_at", "DATETIME2(0)").nullable()
    table.specificType("last_sync_failure_at", "DATETIME2(0)").nullable()

    table.unique("external_directory_identifier", {
      indexName: "users_external_directory_identifier_unique",
      predicate: knex.whereNotNull("external_directory_identifier").whereNull("deleted_at"),
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.dropIndex("external_directory_identifier", "users_external_directory_identifier_unique")

    table.dropColumn("external_directory_identifier")
    table.dropColumn("last_sync_success_at")
    table.dropColumn("last_sync_failure_at")
  })
}
