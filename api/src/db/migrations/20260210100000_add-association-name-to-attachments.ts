import { type Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("attachments", (table) => {
    table.string("association_name", 255).nullable()
  })

  await knex.raw(/* sql */ `
    UPDATE attachments
    SET
      association_name = 'signedAcknowledgement'
    WHERE
      association_name IS NULL
  `)

  await knex.schema.alterTable("attachments", (table) => {
    table.string("association_name", 255).notNullable().alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("attachments", (table) => {
    table.dropColumn("association_name")
  })
}
