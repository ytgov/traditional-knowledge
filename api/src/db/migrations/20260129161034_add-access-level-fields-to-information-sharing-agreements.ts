import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(/* sql */ `
    UPDATE information_sharing_agreements
    SET
      access_levels = SUBSTRING(access_levels, 1, 100)
    WHERE
      LEN(access_levels) > 100
  `)

  await knex.schema.alterTable("information_sharing_agreements", (table) => {
    table.string("access_levels", 100).nullable().alter()
    table.renameColumn("access_levels", "access_level")

    table.string("access_level_department_restriction", 100).nullable()
    table.string("access_level_branch_restriction", 100).nullable()
    table.string("access_level_unit_restriction", 100).nullable()

    table.boolean("has_additional_access_restrictions").notNullable().defaultTo(false)
    table.renameColumn("access_notes", "additional_access_restrictions")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("information_sharing_agreements", (table) => {
    table.renameColumn("additional_access_restrictions", "access_notes")
    table.dropColumn("has_additional_access_restrictions")

    table.dropColumn("access_level_unit_restriction")
    table.dropColumn("access_level_branch_restriction")
    table.dropColumn("access_level_department_restriction")

    table.string("access_level", 500).nullable().alter()
    table.renameColumn("access_level", "access_levels")
  })
}
