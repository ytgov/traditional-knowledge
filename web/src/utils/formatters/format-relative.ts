import { isEmpty, isNil } from "lodash"
import { DateTime } from "luxon"

export function formatRelative(input: string | Date | undefined | null): string {
  if (isNil(input) || isEmpty(input)) return ""

  const dateTime =
    typeof input === "string"
      ? DateTime.fromISO(input).toLocal()
      : DateTime.fromJSDate(input!).toLocal()

  if (!dateTime.isValid) return ""

  const now = DateTime.local()
  const diffInSeconds = Math.abs(now.diff(dateTime, "seconds").seconds)

  if (diffInSeconds < 1) return "now"

  return dateTime.toRelative() ?? ""
}
