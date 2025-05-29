import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  // Grants access to archive items attached to an information sharing agreement to an entire group, or just a user in the group.
  await knex.schema.createTable("information_sharing_agreement_access_grants", (table) => {
    table.increments("id").primary()
    table.integer("information_sharing_agreement_id").notNullable()
    table.integer("group_id").notNullable()
    table.integer("user_id")
    table.string("access_level").notNullable().defaultTo("read")

    table.integer("creator_id").notNullable()
    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")

    table
      .foreign("information_sharing_agreement_id")
      .references("information_sharing_agreements.id")

    table.foreign("group_id").references("groups.id")
    table.foreign("user_id").references("users.id")
    table.foreign("creator_id").references("users.id")

    table.unique(["information_sharing_agreement_id", "group_id", "user_id"], {
      indexName: "information_sharing_agreement_access_grants_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("information_sharing_agreement_access_grants")
}
