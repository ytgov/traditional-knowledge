import { auth0Integration, yukonGovernmentIntegration } from "@/integrations"
import { User } from "@/models"
import { EnsureFromAuth0TokenService } from "@/services/users"

import { userFactory } from "@/factories"

vi.mock("@/integrations", () => ({
  auth0Integration: {
    getUserInfo: vi.fn(),
  },
  yukonGovernmentIntegration: {
    fetchEmployee: vi.fn(),
  },
}))
const mockedAuth0Integration = vi.mocked(auth0Integration)
const mockedYukonGovernmentIntegration = vi.mocked(yukonGovernmentIntegration)

describe("api/src/services/users/ensure-from-auth0-token-service.ts", () => {
  describe("EnsureFromAuth0TokenService", () => {
    describe("#perform", () => {
      test("when user with matching auth0Subject exists in database, returns user", async () => {
        // Arrange
        const token = "Auth0AccessToken"
        const auth0Subject = "auth0|74df9b33217f9d4c8fefcc8b"
        const user1 = await userFactory.create({ auth0Subject })

        mockedAuth0Integration.getUserInfo.mockResolvedValue({
          auth0Subject,
          email: "jane.doe@example.com",
          firstName: "Jane",
          lastName: "Doe",
          externalDirectoryIdentifier: "123456",
        })

        // Act
        const result = await EnsureFromAuth0TokenService.perform(token)

        // Assert
        expect(result).to.be.instanceOf(User).with.property("id", user1.id)
      })

      test("when user with matching auth0Subject exists in database but is deactivated, throws error", async () => {
        // Arrange
        const token = "Auth0AccessToken"
        const auth0Subject = "auth0|74df9b33217f9d4c8fefcc8b"
        await userFactory.create({
          auth0Subject,
          deactivatedAt: new Date(),
          deactivationReason: "not-important",
        })

        mockedAuth0Integration.getUserInfo.mockResolvedValue({
          auth0Subject,
          email: "jane.doe@example.com",
          firstName: "Jane",
          lastName: "Doe",
          externalDirectoryIdentifier: "123456",
        })

        // Act & Assert
        expect.assertions(1)
        await expect(EnsureFromAuth0TokenService.perform(token)).rejects.toThrow(
          "User is deactivated."
        )
      })

      test("when user with matching email exists (first-time login), updates auth0Subject and returns user", async () => {
        // Arrange
        const token = "Auth0AccessToken"
        const auth0Subject = "auth0|74df9b33217f9d4c8fefcc8b"
        const email = "jane.doe@example.com"
        const user1 = await userFactory.create({
          email,
          auth0Subject: email,
        })

        mockedAuth0Integration.getUserInfo.mockResolvedValue({
          auth0Subject,
          email,
          firstName: "Jane",
          lastName: "Doe",
          externalDirectoryIdentifier: "123456",
        })

        // Act
        const user2 = await EnsureFromAuth0TokenService.perform(token)

        // Assert
        expect(user2).to.be.instanceOf(User).and.to.include({
          id: user1.id,
          auth0Subject,
          email: user1.email,
        })
      })

      test("when user with matching email exists (first-time login) but is deactivated, throws error", async () => {
        // Arrange
        const token = "Auth0AccessToken"
        const auth0Subject = "auth0|74df9b33217f9d4c8fefcc8b"
        const email = "jane.doe@example.com"
        await userFactory.create({
          email,
          auth0Subject: email,
          deactivatedAt: new Date(),
          deactivationReason: "not-important",
        })

        mockedAuth0Integration.getUserInfo.mockResolvedValue({
          auth0Subject,
          email,
          firstName: "Jane",
          lastName: "Doe",
          externalDirectoryIdentifier: "123456",
        })

        // Act & Assert
        expect.assertions(1)
        await expect(EnsureFromAuth0TokenService.perform(token)).rejects.toThrow(
          "User is deactivated."
        )
      })

      test("when no matching user exists in database, creates and returns new user", async () => {
        // Arrange
        const token = "Auth0AccessToken"
        const auth0Subject = "auth0|74df9b33217f9d4c8fefcc8b"
        await userFactory.create({ email: "system.user@yukon.ca" })

        mockedAuth0Integration.getUserInfo.mockResolvedValue({
          auth0Subject,
          email: "jane.doe@example.com",
          firstName: "Jane",
          lastName: "Doe",
          externalDirectoryIdentifier: "123456",
        })
        mockedYukonGovernmentIntegration.fetchEmployee.mockResolvedValue(null)

        // Act & Assert
        expect.assertions(1)
        await expect(() => EnsureFromAuth0TokenService.perform(token)).toChange(
          () => User.count(),
          { from: 1, to: 2 }
        )
      })
    })
  })
})
