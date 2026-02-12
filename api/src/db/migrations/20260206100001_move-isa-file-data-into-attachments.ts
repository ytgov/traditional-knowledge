import crypto from "crypto"

import { type Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  const fileDataRows = await knex("information_sharing_agreements")
    .select<
      {
        id: number
        file_name: string
        file_data: Buffer
        file_mime_type: string
        file_size: number
      }[]
    >("id", "file_name", "file_data", "file_mime_type", "file_size")
    .whereNotNull("file_data")

  for (const fileDataRow of fileDataRows) {
    const sha256Checksum = crypto.createHash("sha256").update(fileDataRow.file_data).digest("hex")

    await knex("attachments").insert({
      target_id: fileDataRow.id,
      target_type: "InformationSharingAgreement",
      name: fileDataRow.file_name,
      size: fileDataRow.file_size,
      content: fileDataRow.file_data,
      mime_type: fileDataRow.file_mime_type,
      sha256Checksum,
    })
  }

  await knex.schema.alterTable("information_sharing_agreements", (table) => {
    table.dropColumn("file_name")
    table.dropColumn("file_data")
    table.dropColumn("file_mime_type")
    table.dropColumn("file_size")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("information_sharing_agreements", (table) => {
    table.string("file_name").nullable()
    table.binary("file_data").nullable()
    table.string("file_mime_type").nullable()
    table.integer("file_size").nullable()
  })

  const attachments = await knex("attachments")
    .select<
      {
        target_id: number
        name: string
        content: Buffer
        mime_type: string
        size: number
      }[]
    >("target_id", "name", "content", "mime_type", "size")
    .where("target_type", "InformationSharingAgreement")

  for (const attachment of attachments) {
    await knex("information_sharing_agreements").where("id", attachment.target_id).update({
      file_name: attachment.name,
      file_data: attachment.content,
      file_mime_type: attachment.mime_type,
      file_size: attachment.size,
    })
  }

  await knex("attachments").where("target_type", "InformationSharingAgreement").delete()
}
