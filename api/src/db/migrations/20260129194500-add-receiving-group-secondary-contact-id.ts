import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("information_sharing_agreements", (table) => {
    table.integer("receiving_group_secondary_contact_id").nullable()

    table
      .foreign("receiving_group_secondary_contact_id")
      .references("users.id")
      .onDelete("SET NULL")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("information_sharing_agreements", (table) => {
    table.dropForeign("receiving_group_secondary_contact_id")
    table.dropColumn("receiving_group_secondary_contact_id")
  })
}
