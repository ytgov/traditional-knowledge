import { type NextFunction, type Response } from "express"
import { isNil } from "lodash"
import { DateTime } from "luxon"

import { type AuthorizationRequest } from "@/middlewares/authorization-middleware"
import { type User } from "@/models"

/**
 * Middleware that tracks the user's last active time.
 *
 * Runs after authorization-middleware to update the user's last active time.
 * Only updates if last active was more than 5 minutes ago to avoid excessive DB writes.
 *
 * @param req - The request object containing the current user
 * @param _res - The response object (unused)
 * @param next - The next middleware function
 */
export async function trackLastActiveMiddleware(
  req: AuthorizationRequest,
  _res: Response,
  next: NextFunction
) {
  const { currentUser } = req
  if (isNil(currentUser)) return next()

  if (isNil(currentUser.lastActiveAt)) {
    updateLastActiveAtInBackground(currentUser)
    return next()
  }

  const minutesSinceLastActive = getMinutesSince(currentUser.lastActiveAt)
  if (minutesSinceLastActive > 5) {
    updateLastActiveAtInBackground(currentUser)
  }

  return next()
}

function getMinutesSince(date: Date): number {
  return DateTime.utc().diff(DateTime.fromJSDate(date), "minutes").minutes
}

/**
 * Updates the user's last active time in the background without awaiting.
 * This prevents slowing down the request response time.
 */
function updateLastActiveAtInBackground(user: User): void {
  user.update({ lastActiveAt: new Date() }).catch((error) => {
    console.error(`Failed to update lastActiveAt: ${error}`, { error })
  })
}

export default trackLastActiveMiddleware
