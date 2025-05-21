import { isNil } from "lodash"

import logger from "@/utils/logger"
import { InformationSharingAgreementAccessGrant } from "@/models"
import { InformationSharingAgreementAccessGrantPolicy } from "@/policies"
import { CreateService } from "@/services/information-sharing-agreement-access-grants"
import {
  IndexSerializer,
  ShowSerializer,
} from "@/serializers/information-sharing-agreement-access-grants"
import BaseController from "@/controllers/base-controller"

export class InformationSharingAgreementAccessGrantsController extends BaseController<InformationSharingAgreementAccessGrant> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder()

      const scopedInformationSharingAgreementAccessGrants =
        InformationSharingAgreementAccessGrantPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedInformationSharingAgreementAccessGrants.count({ where })
      const informationSharingAgreementAccessGrants =
        await scopedInformationSharingAgreementAccessGrants.findAll({
          where,
          order,
          limit: this.pagination.limit,
          offset: this.pagination.offset,
          include: ["group", "user"],
        })
      const serializedInformationSharingAgreementAccessGrants = IndexSerializer.perform(
        informationSharingAgreementAccessGrants
      )
      return this.response.json({
        informationSharingAgreementAccessGrants: serializedInformationSharingAgreementAccessGrants,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching information sharing agreement access grants: ${error}`, {
        error,
      })
      return this.response.status(400).json({
        message: `Error fetching information sharing agreement access grants: ${error}`,
      })
    }
  }

  async show() {
    try {
      const informationSharingAgreementAccessGrant =
        await this.loadInformationSharingAgreementAccessGrant()
      if (isNil(informationSharingAgreementAccessGrant)) {
        return this.response.status(404).json({
          message: "Information sharing agreement access grant not found",
        })
      }

      const policy = this.buildPolicy(informationSharingAgreementAccessGrant)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this information sharing agreement access grant",
        })
      }

      const serializedInformationSharingAgreementAccessGrant = ShowSerializer.perform(
        informationSharingAgreementAccessGrant
      )
      return this.response.json({
        informationSharingAgreementAccessGrant: serializedInformationSharingAgreementAccessGrant,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching information sharing agreement access grant: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching information sharing agreement access grant: ${error}`,
      })
    }
  }

  async create() {
    try {
      const newInformationSharingAgreementAccessGrant =
        await this.buildInformationSharingAgreementAccessGrant()
      const policy = this.buildPolicy(newInformationSharingAgreementAccessGrant)
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create information sharing agreement access grants",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const informationSharingAgreementAccessGrant = await CreateService.perform(
        permittedAttributes,
        this.currentUser
      )

      const serializedInformationSharingAgreementAccessGrant = ShowSerializer.perform(
        informationSharingAgreementAccessGrant
      )
      return this.response.status(201).json({
        informationSharingAgreementAccessGrant: serializedInformationSharingAgreementAccessGrant,
      })
    } catch (error) {
      logger.error(`Error creating information sharing agreement access grant: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating information sharing agreement access grant: ${error}`,
      })
    }
  }

  async update() {
    try {
      const informationSharingAgreementAccessGrant =
        await this.loadInformationSharingAgreementAccessGrant()
      if (isNil(informationSharingAgreementAccessGrant)) {
        return this.response.status(404).json({
          message: "Information sharing agreement access grant not found",
        })
      }

      const policy = this.buildPolicy(informationSharingAgreementAccessGrant)
      if (!policy.update()) {
        return this.response.status(403).json({
          message:
            "You are not authorized to update this information sharing agreement access grant",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      await informationSharingAgreementAccessGrant.update(permittedAttributes)
      const serializedInformationSharingAgreementAccessGrant = ShowSerializer.perform(
        informationSharingAgreementAccessGrant
      )
      return this.response.json({
        informationSharingAgreementAccessGrant: serializedInformationSharingAgreementAccessGrant,
        policy,
      })
    } catch (error) {
      logger.error(`Error updating information sharing agreement access grant: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error updating information sharing agreement access grant: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const informationSharingAgreementAccessGrant =
        await this.loadInformationSharingAgreementAccessGrant()
      if (isNil(informationSharingAgreementAccessGrant)) {
        return this.response.status(404).json({
          message: "Information sharing agreement access grant not found",
        })
      }

      const policy = this.buildPolicy(informationSharingAgreementAccessGrant)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message:
            "You are not authorized to delete this information sharing agreement access grant",
        })
      }

      await informationSharingAgreementAccessGrant.destroy()
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting information sharing agreement access grant: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error deleting information sharing agreement access grant: ${error}`,
      })
    }
  }

  private async loadInformationSharingAgreementAccessGrant() {
    return InformationSharingAgreementAccessGrant.findByPk(
      this.params.informationSharingAgreementAccessGrantId
    )
  }

  private async buildInformationSharingAgreementAccessGrant() {
    const informationSharingAgreementAccessGrant = InformationSharingAgreementAccessGrant.build(
      this.request.body
    )
    return informationSharingAgreementAccessGrant
  }

  private buildPolicy(
    informationSharingAgreementAccessGrant: InformationSharingAgreementAccessGrant
  ) {
    return new InformationSharingAgreementAccessGrantPolicy(
      this.currentUser,
      informationSharingAgreementAccessGrant
    )
  }
}

export default InformationSharingAgreementAccessGrantsController
