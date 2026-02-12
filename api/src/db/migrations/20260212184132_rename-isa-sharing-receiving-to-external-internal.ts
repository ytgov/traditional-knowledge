import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("information_sharing_agreements", (table) => {
    table.dropForeign("sharing_group_id")
    table.dropForeign("sharing_group_contact_id")
    table.dropForeign("receiving_group_id")
    table.dropForeign("receiving_group_contact_id")
    table.dropForeign("receiving_group_secondary_contact_id")
  })

  await knex.schema.alterTable("information_sharing_agreements", (table) => {
    table.renameColumn("sharing_group_id", "external_group_id")
    table.renameColumn("sharing_group_contact_id", "external_group_contact_id")
    table.renameColumn("sharing_group_contact_name", "external_group_contact_name")
    table.renameColumn("sharing_group_contact_title", "external_group_contact_title")
    table.renameColumn("sharing_group_info", "external_group_info")
    table.renameColumn("receiving_group_id", "internal_group_id")
    table.renameColumn("receiving_group_contact_id", "internal_group_contact_id")
    table.renameColumn("receiving_group_contact_name", "internal_group_contact_name")
    table.renameColumn("receiving_group_contact_title", "internal_group_contact_title")
    table.renameColumn("receiving_group_info", "internal_group_info")
    table.renameColumn("receiving_group_secondary_contact_id", "internal_group_secondary_contact_id")
  })

  await knex.schema.alterTable("information_sharing_agreements", (table) => {
    table.foreign("external_group_id").references("groups.id")
    table.foreign("external_group_contact_id").references("users.id")
    table.foreign("internal_group_id").references("groups.id")
    table.foreign("internal_group_contact_id").references("users.id")
    table.foreign("internal_group_secondary_contact_id").references("users.id").onDelete("SET NULL")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("information_sharing_agreements", (table) => {
    table.dropForeign("external_group_id")
    table.dropForeign("external_group_contact_id")
    table.dropForeign("internal_group_id")
    table.dropForeign("internal_group_contact_id")
    table.dropForeign("internal_group_secondary_contact_id")
  })

  await knex.schema.alterTable("information_sharing_agreements", (table) => {
    table.renameColumn("external_group_id", "sharing_group_id")
    table.renameColumn("external_group_contact_id", "sharing_group_contact_id")
    table.renameColumn("external_group_contact_name", "sharing_group_contact_name")
    table.renameColumn("external_group_contact_title", "sharing_group_contact_title")
    table.renameColumn("external_group_info", "sharing_group_info")
    table.renameColumn("internal_group_id", "receiving_group_id")
    table.renameColumn("internal_group_contact_id", "receiving_group_contact_id")
    table.renameColumn("internal_group_contact_name", "receiving_group_contact_name")
    table.renameColumn("internal_group_contact_title", "receiving_group_contact_title")
    table.renameColumn("internal_group_info", "receiving_group_info")
    table.renameColumn("internal_group_secondary_contact_id", "receiving_group_secondary_contact_id")
  })

  await knex.schema.alterTable("information_sharing_agreements", (table) => {
    table.foreign("sharing_group_id").references("groups.id")
    table.foreign("sharing_group_contact_id").references("users.id")
    table.foreign("receiving_group_id").references("groups.id")
    table.foreign("receiving_group_contact_id").references("users.id")
    table.foreign("receiving_group_secondary_contact_id").references("users.id").onDelete("SET NULL")
  })
}
