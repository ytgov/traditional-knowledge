import { isEmpty } from "lodash"
import { DateTime } from "luxon"

export function formatDateTime(input: string | Date | undefined | null): string {
  if (isEmpty(input)) return ""
  if (typeof input == "string") {
    return DateTime.fromISO(input).toLocal().toFormat("yyyy-MM-dd h:mm a")
  }
  if (input) return DateTime.fromJSDate(input).toLocal().toFormat("yyyy-MM-dd h:mma")

  return ""
}
