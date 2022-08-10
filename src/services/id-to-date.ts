import { addLeadingZero } from './add-leading-zero'

export const days = ['Sun', 'M', 'T', 'W', 'R', 'F', 'Sat']

/**
 * Converts an date ID to a Date object. Assumes input is in
 * format YYYY-MM-DD.
 */
export function idToDate (id: string) {
  if (id.length >= 10) {
    const year = +id.substring(0, 4)
    const month = +id.substring(5, 7)
    const date = +id.substring(8, 10)
    if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(date)) {
      return new Date(year, month - 1, date)
    }
  }
  return null
}

/**
 * Converts a Date to a format suitable for a display.
 */
export function idToFormattedDate (date: Date) {
  return `${date.getFullYear()}-` +
  `${addLeadingZero(date.getMonth() + 1)}-` +
  `${addLeadingZero(date.getDate())} ` +
  `${days[date.getDay()]}`
}
