import { isNil } from "lodash"

import logger from "@/utils/logger"

import { ExternalOrganization } from "@/models"
import { ExternalOrganizationPolicy } from "@/policies/external-organization-policy"
import { CreateService, DestroyService, UpdateService } from "@/services/external-organizations"
import { IndexSerializer, ShowSerializer } from "@/serializers/external-organizations"
import BaseController from "@/controllers/base-controller"

export class ExternalOrganizationsController extends BaseController<ExternalOrganization> {
  async index() {
    try {
      const whereClause = this.buildWhere()
      const filterScopes = this.buildFilterScopes()
      const orderClause = this.buildOrder([["name", "ASC"]])
      const scopedOrganizations = ExternalOrganizationPolicy.applyScope(
        filterScopes,
        this.currentUser
      )

      const totalRecordCount = await scopedOrganizations.count({ where: whereClause })
      const organizationRecords = await scopedOrganizations.findAll({
        where: whereClause,
        order: orderClause,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedOrganizations = IndexSerializer.perform(organizationRecords)
      return this.response.json({
        externalOrganizations: serializedOrganizations,
        totalCount: totalRecordCount,
      })
    } catch (error) {
      logger.error(`Error fetching external organizations: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching external organizations: ${error}`,
      })
    }
  }

  async show() {
    try {
      const organizationRecord = await this.loadExternalOrganization()
      if (isNil(organizationRecord)) {
        return this.response.status(404).json({
          message: "External organization not found.",
        })
      }

      const policy = this.buildPolicy(organizationRecord)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this external organization.",
        })
      }

      const serializedExternalOrganization = ShowSerializer.perform(organizationRecord)
      return this.response.json({
        externalOrganization: serializedExternalOrganization,
        policy: policy,
      })
    } catch (error) {
      logger.error(`Error fetching external organization: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching external organization: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create an external organization.",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const newExternalOrganization = await CreateService.perform(
        permittedAttributes,
        this.currentUser
      )
      const serializedExternalOrganization = ShowSerializer.perform(newExternalOrganization)
      return this.response.status(201).json({
        externalOrganization: serializedExternalOrganization,
        policy: policy,
      })
    } catch (error) {
      logger.error(`Error creating external organization: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating external organization: ${error}`,
      })
    }
  }

  async update() {
    try {
      const existingOrganization = await this.loadExternalOrganization()
      if (isNil(existingOrganization)) {
        return this.response.status(404).json({
          message: "External organization not found.",
        })
      }

      const policy = this.buildPolicy(existingOrganization)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this external organization.",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      const updatedOrganization = await UpdateService.perform(
        existingOrganization,
        permittedAttributes,
        this.currentUser
      )
      const serializedOrganization = ShowSerializer.perform(updatedOrganization)
      return this.response.json({
        externalOrganization: serializedOrganization,
        policy: policy,
      })
    } catch (error) {
      logger.error(`Error updating external organization: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error updating external organization: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const organization = await this.loadExternalOrganization()
      if (isNil(organization)) {
        return this.response.status(404).json({
          message: "External organization not found.",
        })
      }

      const policy = this.buildPolicy(organization)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this external organization.",
        })
      }

      await DestroyService.perform(organization, this.currentUser)
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting external organization: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error deleting external organization: ${error}`,
      })
    }
  }

  private loadExternalOrganization() {
    return ExternalOrganization.findByPk(this.params.externalOrganizationId)
  }

  private buildPolicy(organization: ExternalOrganization = ExternalOrganization.build()) {
    return new ExternalOrganizationPolicy(this.currentUser, organization)
  }
}
