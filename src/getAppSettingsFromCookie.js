import configureCookie from './configureCookie'

const getAppSettingsFromCookie = (req, options = {}) => {
  const Cookie = configureCookie({ req, ...options })
  return Cookie.getAll()
}

export default getAppSettingsFromCookie
