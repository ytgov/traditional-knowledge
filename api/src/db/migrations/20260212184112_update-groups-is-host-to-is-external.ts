import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("groups", (table) => {
    table.boolean("is_external").nullable().defaultTo(false)
  })

  await knex.raw(/* sql */ `
    UPDATE groups
    SET
      is_external = CASE
        WHEN is_host = 1 THEN 0
        WHEN is_host = 0 THEN 1
        ELSE 0
      END
  `)

  await knex.schema.alterTable("groups", (table) => {
    table.boolean("is_external").notNullable().defaultTo(false).alter()
  })

  await knex.schema.alterTable("groups", (table) => {
    table.dropColumn("is_host")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("groups", (table) => {
    table.boolean("is_host").nullable().defaultTo(false)
  })

  await knex.raw(/* sql */ `
    UPDATE groups
    SET
      is_host = CASE
        WHEN is_external = 1 THEN 0
        WHEN is_external = 0 THEN 1
        ELSE 0
      END
  `)

  await knex.schema.alterTable("groups", (table) => {
    table.boolean("is_host").notNullable().defaultTo(false).alter()
  })

  await knex.schema.alterTable("groups", (table) => {
    table.dropColumn("is_external")
  })
}
