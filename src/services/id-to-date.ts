export const days = ['Sun', 'M', 'T', 'W', 'R', 'F', 'Sat'];

function addLeadingZero(num: number) {
  let str = `${num}`;
  if (str.length < 2) {
    str = `0${str}`;
  }
  return str;
}

/**
 * Converts an date ID to a format suitable for a display. Assumes input is in
 * format YYYYMMDD.
 */
export function idToDate(id: string) {
  const nullDate = '0000-00-00 X';
  if (id.length === 8) {
    const year = +id.substring(0, 4);
    const month = +id.substring(4, 6);
    const date = +id.substring(6);
    if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(date)) {
      const dateObj = new Date(year, month - 1, date);
      return `${dateObj.getFullYear()}-` +
        `${addLeadingZero(dateObj.getMonth() + 1)}-` +
        `${addLeadingZero(dateObj.getDate())} ` +
        `${days[dateObj.getDay()]}`;
    }
  }

  return nullDate;
}
