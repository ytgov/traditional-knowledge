import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(/* sql */ `
    INSERT INTO
      information_sharing_agreement_access_grants (
        information_sharing_agreement_id,
        group_id,
        user_id,
        access_level,
        creator_id,
        created_at,
        updated_at
      )
    SELECT
      information_sharing_agreement_access_grants.information_sharing_agreement_id,
      information_sharing_agreement_access_grants.group_id,
      user_groups.user_id,
      information_sharing_agreement_access_grants.access_level,
      information_sharing_agreement_access_grants.creator_id,
      information_sharing_agreement_access_grants.created_at,
      information_sharing_agreement_access_grants.updated_at
    FROM
      information_sharing_agreement_access_grants
      INNER JOIN user_groups ON user_groups.group_id = information_sharing_agreement_access_grants.group_id
      AND user_groups.deleted_at IS NULL
    WHERE
      information_sharing_agreement_access_grants.user_id IS NULL
      AND information_sharing_agreement_access_grants.deleted_at IS NULL
      AND NOT EXISTS (
        SELECT
          1
        FROM
          information_sharing_agreement_access_grants existing_grants
        WHERE
          existing_grants.information_sharing_agreement_id = information_sharing_agreement_access_grants.information_sharing_agreement_id
          AND existing_grants.group_id = information_sharing_agreement_access_grants.group_id
          AND existing_grants.user_id = user_groups.user_id
          AND existing_grants.deleted_at IS NULL
      )
  `)

  await knex.raw(/* sql */ `
    DELETE FROM information_sharing_agreement_access_grants
    WHERE
      user_id IS NULL
  `)

  await knex.schema.alterTable("information_sharing_agreement_access_grants", (table) => {
    table.dropForeign("user_id")
    table.dropIndex(
      ["information_sharing_agreement_id", "group_id", "user_id"],
      "information_sharing_agreement_access_grants_unique"
    )
  })

  await knex.schema.alterTable("information_sharing_agreement_access_grants", (table) => {
    table.integer("user_id").notNullable().alter()
  })

  await knex.schema.alterTable("information_sharing_agreement_access_grants", (table) => {
    table.foreign("user_id").references("users.id")
    table.unique(["information_sharing_agreement_id", "group_id", "user_id"], {
      indexName: "information_sharing_agreement_access_grants_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("information_sharing_agreement_access_grants", (table) => {
    table.dropForeign("user_id")
    table.dropIndex(
      ["information_sharing_agreement_id", "group_id", "user_id"],
      "information_sharing_agreement_access_grants_unique"
    )
  })

  await knex.schema.alterTable("information_sharing_agreement_access_grants", (table) => {
    table.integer("user_id").nullable().alter()
  })

  await knex.schema.alterTable("information_sharing_agreement_access_grants", (table) => {
    table.foreign("user_id").references("users.id")
    table.unique(["information_sharing_agreement_id", "group_id", "user_id"], {
      indexName: "information_sharing_agreement_access_grants_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })
}
