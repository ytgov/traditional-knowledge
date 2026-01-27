import { isNil } from "lodash"

import yukonGovernmentIntegration from "@/integrations/yukon-government-integration"

import { logger } from "@/utils/logger"

import db, { User } from "@/models"
import BaseService from "@/services/base-service"
import { Users } from "@/services"

export class DirectorySyncService extends BaseService {
  constructor(
    private user: User,
    private currentUser: User
  ) {
    super()
  }

  async perform(): Promise<User> {
    return db.transaction(async () => {
      try {
        // TODO: switch to MS Graph API so I can get the activeDirectoryIdentifier?
        const employee = await yukonGovernmentIntegration.fetchEmployee(this.user.email)

        if (isNil(employee)) {
          await Users.UpdateService.perform(
            this.user,
            {
              lastSyncFailureAt: new Date(),
            },
            this.currentUser
          )
          throw new Error(`Employee not found in YG Directory: ${this.user.email}`)
        }

        const attributes = {
          firstName: employee.first_name,
          lastName: employee.last_name,
          displayName: employee.full_name,
          department: employee.department,
          division: employee.division,
          branch: employee.branch,
          unit: employee.unit,
          title: employee.title,
          activeDirectoryIdentifier: employee.username,
          lastSyncSuccessAt: new Date(),
          lastSyncFailureAt: null,
        }
        await Users.UpdateService.perform(this.user, attributes, this.currentUser)

        return this.user.reload({
          include: ["adminGroups", "adminInformationSharingAgreementAccessGrants"],
        })
      } catch (error) {
        await Users.UpdateService.perform(
          this.user,
          {
            lastSyncFailureAt: new Date(),
          },
          this.currentUser
        )
        logger.error(`Failed to sync user ${this.user.email}: ${error}`, { error })
        throw new Error(`Failed to sync user ${this.user.email}: ${error}`)
      }
    })
  }
}

export default DirectorySyncService
