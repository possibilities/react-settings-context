import Cookie from 'cookie'

const oneMonthSeconds = 60 * 60 * 24 * 30

// A helper for reading/writing cookies in SRR apps. There's no security claims
// made here as this library is not meant to be used in production apps.
// Writing cookies on the server is not supported.

const parseOrNull = str => {
  try {
    return JSON.parse(decodeURIComponent(str))
  } catch (error) {
    return null
  }
}

const parseCookie = (cookieName, headersOrDocument) => {
  if (headersOrDocument.cookie) {
    const cookie = Cookie.parse(headersOrDocument.cookie)[cookieName]
    const parsed = parseOrNull(cookie)
    if (parsed) return parsed
  }
  return {}
}

const configureCookie = (options = {}) => {
  // Get a cookie name for the cookie or make one
  const {
    win: windowOverride,
    req: incomingRequest,
    name: cookieName = 'app-settings',
    ...cookiesSettingsOverrides
  } = options
  const win = process.browser && (windowOverride || window)

  return {
    get: () => {
      const headersOrDocument = incomingRequest
        ? incomingRequest.headers
        : win.document
      return parseCookie(cookieName, headersOrDocument)
    },
    set: cookie => {
      if (!process.browser) {
        throw new Error('Cannot write cookie on the server with this library')
      }
      const cookiesDefaults = {
        sameSite: true,
        maxAge: oneMonthSeconds,
        secure: win.location.protocol === 'https',
        domain: win.location.hostname
      }
      const cookieJson = JSON.stringify(cookie)
      const cookiesSettings = {
        ...cookiesDefaults,
        ...cookiesSettingsOverrides
      }
      win.document.cookie =
        Cookie.serialize(cookieName, cookieJson, cookiesSettings)
    }
  }
}

export default configureCookie
