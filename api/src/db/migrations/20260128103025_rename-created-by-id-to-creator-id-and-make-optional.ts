import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.integer("creator_id").nullable()
    table.foreign("creator_id").references("users.id")
  })

  await knex.raw(/* sql */ `
    UPDATE users
    SET
      creator_id = created_by_id
  `)

  await knex.schema.alterTable("users", (table) => {
    table.dropForeign(["created_by_id"])
    table.dropColumn("created_by_id")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.integer("created_by_id")
    table.foreign("created_by_id").references("users.id")
  })

  await knex.raw(/* sql */ `
    UPDATE users
    SET
      created_by_id = COALESCE(
        creator_id,
        (
          SELECT
            id
          FROM
            users
          WHERE
            email = 'system.user@yukon.ca'
        )
      )
  `)



  await knex.schema.alterTable("users", (table) => {
    table.integer("created_by_id").notNullable().alter()

    table.dropForeign(["creator_id"])
    table.dropColumn("creator_id")
  })
}
