import { Knex } from "knex"
import { isNil } from "lodash"

import { Retention } from "@/models"
import logger from "@/utils/logger"

export async function seed(_knex: Knex): Promise<void> {
  const retentions = [
    {
      name: "Keep 10 days, then destroy",
      description: "",
      isDefault: true,
      expireSchedule: "* 1 * *  *",
      expireAction: "Destroy",
      retentionDays: 10,
    },
    {
      name: "Keep till December 31, 2025, then hide",
      description: "",
      isDefault: true,
      expireSchedule: "* 10 * *  *",
      expireAction: "Hide",
      retentionDate: new Date(2025, 11, 31, 23, 59, 59),
    },
  ]
  for (const attributes of retentions) {
    let item = await Retention.findOne({
      where: {
        name: attributes.name,
      },
    })
    if (isNil(item)) {
      item = await Retention.create(attributes)
      logger.debug("Retention created:", item.dataValues)
    } else {
      await item.update(attributes)
      logger.debug("Retention updated:", item.dataValues)
    }
  }
}
