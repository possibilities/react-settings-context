import configureCookie from './configureCookie'

const getAppSettingsFromCookie = (req, options = {}) => {
  const Cookie = configureCookie({ req, ...options })
  return Cookie.get()
}

export default getAppSettingsFromCookie
