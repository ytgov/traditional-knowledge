import { AttributeNames, Model, Op, WhereOptions } from "@sequelize/core"

import whereFieldLikeTerm from "@/utils/search/where-field-like-term"

/**
 * Builds an AND condition for a single field matching multiple terms.
 */
export function whereFieldLikeTerms<M extends Model>(
  field: AttributeNames<M>,
  terms: string[]
): WhereOptions<M> {
  const termsLikeCondition = terms.map((term) => whereFieldLikeTerm(field, term))
  return {
    [Op.and]: termsLikeCondition,
  }
}

export default whereFieldLikeTerms
