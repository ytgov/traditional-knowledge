import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.uuid("active_directory_identifier").nullable()
  })

  await knex.raw(/* sql */ `
    UPDATE users
    SET
      active_directory_identifier = TRY_CAST(external_directory_identifier AS uniqueidentifier)
    WHERE
      external_directory_identifier IS NOT NULL
  `)

  await knex.schema.alterTable("users", (table) => {
    table.unique("active_directory_identifier", {
      indexName: "users_active_directory_identifier_unique",
      predicate: knex.whereNotNull("active_directory_identifier").whereNull("deleted_at"),
    })

    table.dropIndex("external_directory_identifier", "users_external_directory_identifier_unique")
    table.dropColumn("external_directory_identifier")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.string("external_directory_identifier", 255).nullable()
  })

  await knex.raw(/* sql */ `
    UPDATE users
    SET
      external_directory_identifier = CAST(active_directory_identifier AS VARCHAR(255))
    WHERE
      active_directory_identifier IS NOT NULL
  `)

  await knex.schema.alterTable("users", (table) => {
    table.unique("external_directory_identifier", {
      indexName: "users_external_directory_identifier_unique",
      predicate: knex.whereNotNull("external_directory_identifier").whereNull("deleted_at"),
    })

    table.dropIndex("active_directory_identifier", "users_active_directory_identifier_unique")
    table.dropColumn("active_directory_identifier")
  })
}
