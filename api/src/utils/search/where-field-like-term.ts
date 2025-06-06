import { AttributeNames, Model, Op, sql, Where, where } from "@sequelize/core"

/**
 * Builds a LIKE condition for a single field and term.
 */
export function whereFieldLikeTerm<M extends Model>(field: AttributeNames<M>, term: string): Where {
  const termPattern = `%${term.toLowerCase()}%`
  return where(sql.fn("LOWER", sql.col(field)), Op.like, termPattern)
}

export default whereFieldLikeTerm
