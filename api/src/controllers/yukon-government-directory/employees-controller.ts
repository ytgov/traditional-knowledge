import { isNil, isEmpty, isString, has } from "lodash"

import logger from "@/utils/logger"

import { yukonGovernmentIntegration } from "@/integrations"

import BaseController from "@/controllers/base-controller"
import { IndexSerializer } from "@/serializers/yukon-government-directory/employees"

export class EmployeesController extends BaseController {
  async index() {
    try {
      const { where } = this.query
      if (isNil(where) || isEmpty(where) || !has(where, "email")) {
        return this.response.status(422).json({
          message: "Where parameter is required and must be an object with an email property.",
        })
      }

      const { email } = where
      if (isNil(email) || isEmpty(email) || !isString(email)) {
        return this.response.status(422).json({
          message: "Email is required and must be a string.",
        })
      }

      const { employees, count } = await yukonGovernmentIntegration.fetchEmployees({
        email,
      })
      const serializedEmployees = IndexSerializer.perform(employees)
      return this.response.json({
        employees: serializedEmployees,
        count,
      })
    } catch (error) {
      logger.error(`Error searching Yukon Government directory: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error searching Yukon Government directory: ${error}`,
      })
    }
  }
}

export default EmployeesController
