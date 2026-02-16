import { sql } from "@sequelize/core"

/**
 * Returns a SQL subquery that resolves to the IDs of information sharing agreements
 * accessible to an external user.
 *
 * Requires replacements: { userId: number }
 *
 * NOTE: user must be external!
 */
export function buildAccessibleInformationSharingAgreementIdsForExternalUserQuery() {
  return sql`
    (
      SELECT DISTINCT
        information_sharing_agreements.id
      FROM
        information_sharing_agreements
      WHERE
        information_sharing_agreements.deleted_at IS NULL
        AND (
          (
            information_sharing_agreements.creator_id = :userId
            AND information_sharing_agreements.status = 'draft'
          )
          OR (
            information_sharing_agreements.status <> 'draft'
            AND EXISTS (
              SELECT
                1
              FROM
                user_groups
              WHERE
                user_groups.user_id = :userId
                AND user_groups.deleted_at IS NULL
                AND user_groups.group_id = information_sharing_agreements.external_group_id
            )
          )
        )
    )
  `
}

export default buildAccessibleInformationSharingAgreementIdsForExternalUserQuery
