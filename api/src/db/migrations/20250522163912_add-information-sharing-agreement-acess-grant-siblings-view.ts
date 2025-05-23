import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(/* sql */ `
    CREATE VIEW information_sharing_agreement_access_grant_siblings AS
    SELECT
      t1.id AS information_sharing_agreement_access_grant_id,
      t2.id AS information_sharing_agreement_access_grant_sibling_id
    FROM
      information_sharing_agreement_access_grants AS t1
      JOIN information_sharing_agreement_access_grants AS t2 ON t1.information_sharing_agreement_id = t2.information_sharing_agreement_id
      AND t1.id <> t2.id;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(/* sql */ ` DROP VIEW information_sharing_agreement_access_grant_siblings; `)
}
