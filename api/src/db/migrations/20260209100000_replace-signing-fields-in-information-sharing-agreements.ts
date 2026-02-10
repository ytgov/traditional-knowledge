import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("information_sharing_agreements", (table) => {
    table.integer("signed_by_id").nullable()
    table
      .specificType("signed_at", "DATETIME2(0)")
      .nullable()

    table.dropColumn("sharing_group_signed_by")
    table.dropColumn("receiving_group_signed_by")
    table.dropColumn("sharing_group_signed_date")
    table.dropColumn("receiving_group_signed_date")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("information_sharing_agreements", (table) => {
    table.string("sharing_group_signed_by", 100).nullable()
    table.string("receiving_group_signed_by", 100).nullable()
    table.date("sharing_group_signed_date").nullable()
    table.date("receiving_group_signed_date").nullable()

    table.dropColumn("signed_by_id")
    table.dropColumn("signed_at")
  })
}
