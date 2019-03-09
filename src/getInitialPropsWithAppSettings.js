import getAppSettingsFromCookie from './getAppSettingsFromCookie'

const getInitialPropsWithAppSettings = (options = {}) =>
  async ({ Component, ctx, ...appProps }) => {
    const settings = getAppSettingsFromCookie(ctx.req, options)
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}
    return {
      pageProps,
      Component,
      settings: { name: options.name, data: settings }
    }
  }

export default getInitialPropsWithAppSettings
