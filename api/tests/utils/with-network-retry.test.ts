import { withNetworkRetry } from "@/utils/with-network-retry"

function networkError(): Error {
  return new Error("getaddrinfo EAI_AGAIN icefoganalyticsthevault.blob.core.windows.net")
}

describe("api/src/utils/with-network-retry.ts", () => {
  describe(".withNetworkRetry", () => {
    test("returns the result without retrying when the operation succeeds", async () => {
      const operation = vi.fn().mockResolvedValue("payload")

      const result = await withNetworkRetry(operation, { delaySeconds: 0 })

      expect(result).toBe("payload")
      expect(operation).toHaveBeenCalledTimes(1)
    })

    test("retries transient network failures until one succeeds", async () => {
      const operation = vi
        .fn()
        .mockRejectedValueOnce(networkError())
        .mockRejectedValueOnce(networkError())
        .mockResolvedValue("payload")

      const result = await withNetworkRetry(operation, { retries: 5, delaySeconds: 0 })

      expect(result).toBe("payload")
      expect(operation).toHaveBeenCalledTimes(3)
    })

    test("re-throws immediately for non-network errors", async () => {
      const operation = vi.fn().mockRejectedValue(new Error("blob not found"))

      await expect(withNetworkRetry(operation, { delaySeconds: 0 })).rejects.toThrow(
        "blob not found"
      )
      expect(operation).toHaveBeenCalledTimes(1)
    })

    test("gives up and re-throws after exhausting retries", async () => {
      const operation = vi.fn().mockRejectedValue(networkError())

      await expect(
        withNetworkRetry(operation, { retries: 3, delaySeconds: 0 })
      ).rejects.toThrow("EAI_AGAIN")
      expect(operation).toHaveBeenCalledTimes(3)
    })
  })
})
