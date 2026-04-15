import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(/* sql */ `
    UPDATE attachments
    SET association_name = 'signedConfidentialityAcknowledgement'
    WHERE association_name = 'signedAcknowledgement'
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(/* sql */ `
    UPDATE attachments
    SET association_name = 'signedAcknowledgement'
    WHERE association_name = 'signedConfidentialityAcknowledgement'
  `)
}
