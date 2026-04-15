import { Response, NextFunction } from "express"

import {
  ensureAndAuthorizeCurrentUser,
  type AuthorizationRequest,
} from "@/middlewares/authorization-middleware"

import { User } from "@/models"

/**
 * Usage:
 * At the top level of a test file import:
 *   import { mockCurrentUser } from "@/tests/support"
 *
 * Then where you want to set the current user:
 *   mockCurrentUser(currentUser)
 *
 * @param newCurrentUser - The user to set as the current user
 */
export function mockCurrentUser(newCurrentUser: User) {
  vi.mock("@/middlewares/jwt-middleware", () => {
    const jwtMiddlewareMock = vi.fn(
      async (_req: AuthorizationRequest, _res: Response, next: NextFunction) => next()
    )
    return {
      default: jwtMiddlewareMock,
      jwtMiddleware: jwtMiddlewareMock,
    }
  })

  vi.mock("@/middlewares/authorization-middleware")

  const mockedEnsureAndAuthorizeCurrentUser = vi.mocked(ensureAndAuthorizeCurrentUser)
  mockedEnsureAndAuthorizeCurrentUser.mockImplementation(
    async (req: AuthorizationRequest, _res: Response, next: NextFunction) => {
      const currentUser = await User.findByPk(newCurrentUser.id, {
        include: ["adminGroups", "adminInformationSharingAgreementAccessGrants"],
        rejectOnEmpty: true,
      })

      req.currentUser = currentUser
      next()
    }
  )
}
