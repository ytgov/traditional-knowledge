import { formatRelative } from "@/utils/formatters/format-relative"

describe("web/src/utils/formatters/format-relative.ts", () => {
  describe("formatRelative", () => {
    const FROZEN_TIME = new Date("2026-01-15T12:00:00.000Z")

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(FROZEN_TIME)
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    test.each([
      // Arrange
      {
        input: null,
        output: "",
      },
      {
        input: undefined,
        output: "",
      },
      {
        input: "",
        output: "",
      },
      {
        input: "invalid-date",
        output: "",
      },
      {
        input: "2026-01-15T12:00:00.000Z",
        output: "now",
      },
      {
        input: "2026-01-15T11:59:30.000Z",
        output: "30 seconds ago",
      },
      {
        input: "2026-01-15T12:00:30.000Z",
        output: "in 30 seconds",
      },
      {
        input: "2026-01-15T11:55:00.000Z",
        output: "5 minutes ago",
      },
      {
        input: "2026-01-15T14:00:00.000Z",
        output: "in 2 hours",
      },
      {
        input: "2026-01-14T12:00:00.000Z",
        output: "1 day ago",
      },
      {
        input: "2026-02-05T12:00:00.000Z",
        output: "in 21 days",
      },
      {
        input: "2025-11-15T12:00:00.000Z",
        output: "2 months ago",
      },
    ])("when input is $input, returns $output", ({ input, output }) => {
      // Act
      const result = formatRelative(input)

      // Assert
      expect(result).toEqual(output)
    })

    test("when input is a Date object for now, returns 'now'", () => {
      // Arrange
      const input = new Date(FROZEN_TIME)

      // Act
      const result = formatRelative(input)

      // Assert
      expect(result).toEqual("now")
    })

    test("when input is a Date object for 1 minute ago, returns '1 minute ago'", () => {
      // Arrange
      const input = new Date(FROZEN_TIME.getTime() - 60000)

      // Act
      const result = formatRelative(input)

      // Assert
      expect(result).toEqual("1 minute ago")
    })
  })
})
