import logger from "@/utils/logger"
import sleep from "@/utils/sleep"
import { isNetworkFailure } from "@/utils/db-error-helpers"

export const DEFAULT_NETWORK_RETRIES = 5
export const DEFAULT_NETWORK_RETRY_DELAY_SECONDS = 1

/**
 * Retries an async operation when it fails with a transient network error, such
 * as the Azure Blob Storage DNS resolution failures (`getaddrinfo EAI_AGAIN`)
 * that made the PDF preview render inconsistently. Non-network errors are
 * re-thrown immediately so real failures still surface. See TK-20.
 */
export async function withNetworkRetry<Result>(
  operation: () => Promise<Result>,
  {
    retries = DEFAULT_NETWORK_RETRIES,
    delaySeconds = DEFAULT_NETWORK_RETRY_DELAY_SECONDS,
  }: { retries?: number; delaySeconds?: number } = {}
): Promise<Result> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (!isNetworkFailure(error) || attempt >= retries) throw error

      logger.warn(`Transient network error on attempt ${attempt}/${retries}, retrying... ${error}`, {
        error,
      })
      await sleep(delaySeconds)
    }
  }
}

export default withNetworkRetry
