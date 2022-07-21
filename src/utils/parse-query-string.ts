type Query = string | null | Array<string | null | Query>

/**
 * Updated from https://github.com/dropbox/dropbox-sdk-js/blob/main/examples/javascript/utils.js
 */
export function parseQueryString (queryStr: string): {
  [key: string]: Query
} {
  const result: { [key: string]: Query } = {}

  if (queryStr === '') {
    return result
  }

  const str = queryStr.trim().replace(/^(\?|#|&)/, '')

  str.split('&').forEach(param => {
    const parts = param.replace(/\+/g, ' ').split('=')
    // Firefox (pre 40) decodes `%3D` to `=`
    // https://github.com/sindresorhus/query-string/pull/37
    let key = parts.shift()

    if (key != null) {
      key = decodeURIComponent(key)
      const rawValue = parts.length > 0 ? parts.join('=') : undefined

      // missing `=` should be `null`:
      // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
      const value =
        rawValue === undefined ? null : decodeURIComponent(rawValue)

      if (result[key] === undefined) {
        result[key] = value
      } else if (Array.isArray(result[key])) {
        (result[key] as Array<string | null>).push(value)
      } else {
        result[key] = [result[key], value]
      }
    }
  })

  return result
}
