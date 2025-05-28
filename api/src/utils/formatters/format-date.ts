import { isEmpty, isNil } from "lodash"
import { DateTime, type LocaleOptions } from "luxon"

export function formatDate(
  date: Date | string | null | undefined,
  fmt: string = "yyyy-MM-dd",
  opts?: LocaleOptions
): string {
  if (date instanceof Date) {
    return DateTime.fromJSDate(date).toFormat(fmt, opts)
  }

  if (isNil(date) || isEmpty(date)) {
    return ""
  }

  return DateTime.fromISO(date).toFormat(fmt, opts)
}

export default formatDate
