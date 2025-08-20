import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { Category } from "@/models"
import BaseService from "@/services/base-service"

export type CategoryCreationAttributes = Partial<CreationAttributes<Category>>

export class CreateService extends BaseService {
  constructor(private attributes: CategoryCreationAttributes) {
    super()
  }

  async perform(): Promise<Category> {
    const { name, ...optionalAttributes } = this.attributes

    if (isNil(name)) {
      throw new Error("Name is required")
    }

    const category = await Category.create({
      ...optionalAttributes,
      name,
    })

    return category
  }
}

export default CreateService
