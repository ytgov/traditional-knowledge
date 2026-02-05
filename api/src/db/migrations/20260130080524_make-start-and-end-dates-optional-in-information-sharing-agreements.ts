import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("information_sharing_agreements", (table) => {
    table.date("start_date").nullable().alter()
    table.date("end_date").nullable().alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  // Backfill any null dates with reasonable defaults before making them non-nullable
  await knex.raw(/* sql */ `
    UPDATE information_sharing_agreements
    SET start_date = CAST(GETDATE() AS DATE)
    WHERE start_date IS NULL
  `)

  await knex.raw(/* sql */ `
    UPDATE information_sharing_agreements
    SET end_date = DATEADD(year, 2, CAST(GETDATE() AS DATE))
    WHERE end_date IS NULL
  `)

  await knex.schema.alterTable("information_sharing_agreements", (table) => {
    table.date("start_date").notNullable().alter()
    table.date("end_date").notNullable().alter()
  })
}
