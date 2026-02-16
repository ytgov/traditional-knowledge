import { Group } from "@/models"

import { userFactory } from "@/tests/factories"

import CreateService from "@/services/groups/create-service"

describe("api/src/services/groups/create-service.ts", () => {
  describe("CreateService", () => {
    describe("#perform", () => {
      test("when valid attributes are provided, creates a group", async () => {
        // Arrange
        const currentUser = await userFactory.create()

        // Act
        await CreateService.perform(
          {
            name: "Test Group",
          },
          currentUser
        )

        // Assert
        const groups = await Group.findAll()
        expect(groups).toEqual([
          expect.objectContaining({
            name: "Test Group",
            creatorId: currentUser.id,
          }),
        ])
      })

      test("when name is nil, throws an error", async () => {
        // Arrange
        const currentUser = await userFactory.create()

        // Act & Assert
        await expect(CreateService.perform({}, currentUser)).rejects.toThrow("Name is required")
      })

      test("when optional attributes are provided, includes them on the group", async () => {
        // Arrange
        const currentUser = await userFactory.create()

        // Act
        const group = await CreateService.perform(
          {
            name: "External Group",
            isExternal: true,
          },
          currentUser
        )

        // Assert
        expect(group).toEqual(
          expect.objectContaining({
            name: "External Group",
            isExternal: true,
          })
        )
      })
    })
  })
})
