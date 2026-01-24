import { type Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(/* sql */ `
    UPDATE users
    SET
      deactivation_reason = 'System backfill for consistency'
    WHERE
      deactivated_at IS NOT NULL
      AND deactivation_reason IS NULL
  `)
}

export async function down(_knex: Knex): Promise<void> {
  // Up migration is destructive and irreversible.
}
