import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("information_sharing_agreements", (table) => {
    table.setNullable("receiving_group_contact_id")
    table.setNullable("receiving_group_id")
    table.setNullable("sharing_group_contact_id")
    table.setNullable("sharing_group_id")

    table.string("identifier", 100)

    table.text("sharing_group_info").nullable()
    table.text("receiving_group_info").nullable()

    table.string("sharing_group_contact_name").nullable()
    table.string("receiving_group_contact_name").nullable()
    table.string("sharing_group_contact_title").nullable()
    table.string("receiving_group_contact_title").nullable()

    table.string("sharing_group_signed_by", 100)
    table.string("receiving_group_signed_by", 100)
    table.date("sharing_group_signed_date")
    table.date("receiving_group_signed_date")

    table.text("purpose")
    table.string("detail_level", 250)
    table.text("detail_notes")
    table.string("formats", 500)
    table.string("access_levels", 500)
    table.text("access_notes")
    table.string("confidentiality", 500)
    table.text("authorized_application")
    table.string("credit_lines", 500)
    table.text("credit_notes")
    table.string("expiration_actions", 500)
    table.text("expiration_notes")
    table.string("breach_actions", 500)
    table.text("breach_notes")
    table.text("disclosure_notes")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("information_sharing_agreements", (table) => {
    table.dropNullable("receiving_group_contact_id")
    table.dropNullable("receiving_group_id")
    table.dropNullable("sharing_group_contact_id")
    table.dropNullable("sharing_group_id")

    table.dropColumn("identifier")

    table.dropColumn("sharing_group_info")
    table.dropColumn("receiving_group_info")

    table.dropColumn("sharing_group_contact_name")
    table.dropColumn("receiving_group_contact_name")
    table.dropColumn("sharing_group_contact_title")
    table.dropColumn("receiving_group_contact_title")

    table.dropColumn("sharing_group_signed_by")
    table.dropColumn("receiving_group_signed_by")
    table.dropColumn("sharing_group_signed_date")
    table.dropColumn("receiving_group_signed_date")

    table.dropColumn("purpose")
    table.dropColumn("detail_level")
    table.dropColumn("detail_notes")
    table.dropColumn("formats")
    table.dropColumn("access_levels")
    table.dropColumn("access_notes")
    table.dropColumn("confidentiality")
    table.dropColumn("authorized_application")
    table.dropColumn("credit_lines")
    table.dropColumn("credit_notes")
    table.dropColumn("expiration_actions")
    table.dropColumn("expiration_notes")
    table.dropColumn("breach_actions")
    table.dropColumn("breach_notes")
    table.dropColumn("disclosure_notes")
  })
}
