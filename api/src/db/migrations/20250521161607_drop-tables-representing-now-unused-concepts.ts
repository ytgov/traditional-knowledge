import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("archive_items", (table) => {
    table.dropForeign("source_id")
    table.dropColumn("source_id")
  })

  await knex.schema.dropTable("user_permissions")
  await knex.schema.dropTable("source_categories")
  await knex.schema.dropTable("archive_item_categories")
  await knex.schema.dropTable("sources")
  await knex.schema.dropTable("categories")
  await knex.schema.dropTable("retentions")
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTable("retentions", function (table) {
    table.increments("id").notNullable().primary()
    table.string("name", 255).notNullable()
    table.text("description")
    table.boolean("is_default").notNullable().defaultTo(false)
    table.string("expire_schedule", 50).notNullable()
    table.string("expire_action", 255).notNullable()
    table.integer("retention_days")
    table.specificType("retention_date", "DATETIME2(0)")

    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")

    table.unique(["name"], {
      indexName: "retentions_name_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })

  await knex.schema.createTable("categories", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("retention_id").notNullable()
    table.string("name", 255).notNullable()
    table.text("description")

    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")

    table.foreign("retention_id").references("retentions.id")

    table.unique(["name"], {
      indexName: "categories_name_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })

  await knex.schema.createTable("sources", function (table) {
    table.increments("id").notNullable().primary()
    table.string("name", 255).notNullable()
    table.text("description")
    table.string("contact_email", 255)
    table.text("referrers")
    table.text("redirects")

    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")

    table.unique(["name"], {
      indexName: "sources_name_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })

  await knex.schema.createTable("archive_item_categories", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("archive_item_id").notNullable()
    table.integer("category_id").notNullable()

    table.integer("set_by_source_id")
    table.integer("set_by_user_id")

    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")

    table.foreign("archive_item_id").references("archive_items.id")
    table.foreign("category_id").references("categories.id")
    table.foreign("set_by_source_id").references("sources.id")
    table.foreign("set_by_user_id").references("users.id")

    table.unique(["archive_item_id", "category_id"], {
      indexName: "archive_item_categories_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })

  await knex.schema.createTable("source_categories", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("source_id").notNullable()
    table.integer("category_id").notNullable()

    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")

    table.foreign("source_id").references("sources.id")
    table.foreign("category_id").references("categories.id")

    table.unique(["source_id", "category_id"], {
      indexName: "source_categories_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })

  await knex.schema.createTable("user_permissions", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("user_id").nullable()
    table.string("user_email", 100).nullable()
    table.integer("category_id").nullable()
    table.integer("source_id").nullable()
    table.integer("archive_item_id").nullable()
    table.boolean("can_view_attachments").notNullable().defaultTo(false)

    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")

    table.foreign("user_id").references("users.id")
    table.foreign("category_id").references("categories.id")
    table.foreign("source_id").references("sources.id")
    table.foreign("archive_item_id").references("archive_items.id")
  })

  await knex.schema.alterTable("archive_items", (table) => {
    table.integer("source_id").nullable()
    table.foreign("source_id").references("sources.id")
  })
}
