import { type Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("attachments", (table) => {
    table.increments("id").primary()
    table.integer("target_id").notNullable()
    table.string("target_type", 255).notNullable()
    table.string("name", 255).notNullable()
    table.integer("size").notNullable()
    table.binary("content").notNullable()
    table.string("mime_type", 255).notNullable()
    table.string("sha256_checksum", 64).notNullable()
    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("attachments")
}
