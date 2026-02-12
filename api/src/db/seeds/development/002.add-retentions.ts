import { Knex } from "knex"
import { isNil } from "lodash"

import { Retention } from "@/models"
import logger from "@/utils/logger"

export async function seed(_knex: Knex): Promise<void> {
  const retentionsAttributes = [
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
  for (const retentionAttributes of retentionsAttributes) {
    let retention = await Retention.findOne({
      where: {
        name: retentionAttributes.name,
      },
    })
    if (isNil(retention)) {
      retention = await Retention.create(retentionAttributes)
      logger.debug("Retention created:", { retention: retention.dataValues })
    } else {
      await retention.update(retentionAttributes)
      logger.debug("Retention updated:", { retention: retention.dataValues })
    }
  }
}
