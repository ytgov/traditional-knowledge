import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("archive_item_categories", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("archive_item_id").notNullable()
    table.integer("category_id").notNullable()
    table.integer("set_by_user_id").nullable()

    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")

    table.unique(["archive_item_id", "category_id"], {
      indexName: "archive_item_categories_unique",
      predicate: knex.whereNull("deleted_at"),
    })

    table.foreign("archive_item_id").references("id").inTable("archive_items")

    table.foreign("category_id").references("id").inTable("categories")

    table.foreign("set_by_user_id").references("id").inTable("users")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("archive_item_categories")
}
