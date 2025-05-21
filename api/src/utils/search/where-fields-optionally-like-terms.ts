import { AttributeNames, Model, Op, WhereOptions } from "@sequelize/core"

import whereFieldLikeTerms from "@/utils/search/where-field-like-terms"

/**
 * Builds an AND condition for multiple terms across multiple fields.
 */
export function whereFieldsOptionallyLikeTerms<M extends Model>(
  fields: AttributeNames<M>[],
  terms: string[]
): {
  [Op.or]?: WhereOptions<M>[] | undefined
} {
  // TODO: rebuild as successive scope calls if
  // https://github.com/sequelize/sequelize/issues/17337 gets implemented
  // (we would no longer need the OR operator in the where clause)
  const whereQuery: {
    [Op.or]?: WhereOptions<M>[]
  } = {}

  const whereFieldsLikeTerms = fields.map((field) => whereFieldLikeTerms(field, terms))

  whereQuery[Op.or] = whereFieldsLikeTerms

  return whereQuery
}

export default whereFieldsOptionallyLikeTerms
