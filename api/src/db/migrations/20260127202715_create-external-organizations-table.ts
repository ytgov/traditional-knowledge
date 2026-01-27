import { type Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("external_organizations", (table) => {
    table.increments("id").primary()
    table.string("name", 200).notNullable()
    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")

    table.unique("name", {
      indexName: "external_organizations_name_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("external_organizations")
}
