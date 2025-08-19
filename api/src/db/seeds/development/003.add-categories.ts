import { Knex } from "knex"
import { isNil } from "lodash"

import logger from "@/utils/logger"
import { Category } from "@/models"

export async function seed(_knex: Knex): Promise<void> {
  const categories = [
    {
      name: "HPW Finance",
      description: "",
    },
    {
      name: "HPW HR",
      description: "",
    },
  ]
  for (const attributes of categories) {
    let item = await Category.findOne({
      where: {
        name: attributes.name,
      },
    })
    if (isNil(item)) {
      item = await Category.create(attributes)
      logger.debug("Retention created:", item.dataValues)
    } else {
      await item.update(attributes)
      logger.debug("Retention updated:", item.dataValues)
    }
  }
}
