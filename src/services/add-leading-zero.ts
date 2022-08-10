/**
 * Returns @param num with a leading "0" if it is less than length 2.
 */
export function addLeadingZero (num: number | string) {
  let str = `${num}`
  if (str.length < 2) {
    str = `0${str}`
  }
  return str
}
