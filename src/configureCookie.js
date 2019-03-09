const oneMonth = 60 * 60 * 24 * 30

function stringifyCookie (cookieName, body, cookie) {
  return [
    `${cookieName}=${encodeURIComponent(JSON.stringify(body))}`,
    `Max-Age=${cookie.maxAge}`,
    `Domain=${cookie.domain}`,
    cookie.secure && 'Secure',
    cookie.sameSite && `SameSite=Strict`
  ]
    .filter(Boolean)
    .join('; ') + ';'
}

const parseOrNull = str => {
  try {
    return JSON.parse(decodeURIComponent(str))
  } catch (error) {
    return null
  }
}

const parseCookie = (cookieName, headersOrDocument) => {
  if (!headersOrDocument.cookie) return {}

  const cookie = headersOrDocument.cookie
    .split(/; */)
    .map(cookieString => cookieString.split('='))
    .map(([key, ...parts]) => [key, parts.join('=')])
    .filter(([key, val]) => key === cookieName)
    .map(([key, val]) => [key, parseOrNull(val)])
    .filter(([key, val]) => !!val)
    .map(([key, val]) => val)
    .pop()

  return cookie || {}
}

const configureCookie = (options = {}) => {
  // Get a cookie name for the cookie or make one
  const { name: cookieName = 'context-settings' } = options

  return {
    getAll: () => {
      const headersOrDocument = options.req
        ? options.req.headers
        : window.document
      return parseCookie(cookieName, headersOrDocument)
    },
    setAll: cookie => {
      window.document.cookie =
        stringifyCookie(
          cookieName,
          cookie,
          {
            sameSite: options.sameSite === undefined
              ? true
              : options.sameSite,
            maxAge: options.maxAge === undefined
              ? oneMonth
              : options.maxAge,
            secure: options.secure === undefined
              ? window.location.protocol === 'https'
              : options.secure,
            domain: options.domain === undefined
              ? window.location.hostname
              : options.domain
          }
        )
    }
  }
}

export default configureCookie
