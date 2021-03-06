# React settings context

A [React](https://github.com/facebook/react) context that provides data storage for app settings that is backed by [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies). This enables a simple storage mechanism that is compatible with SSR (server-side rendering).

This library is most useful in the context of building demo or prototype apps with server side rendering.

[View demo](https://react-settings-context.arthack.io)

## Usage

1. Install the helper in your [Next.js](https://nextjs.org) app

   ```Shell
   yarn add react-settings-context
   ```

1. Use the context helper anywhere in your app

   ```javascript
   import SettingsContext from 'react-settings-context'
   import React, { useContext } from 'react'
   export default function () {
     const [settings, patchSettings] = useContext(SettingsContext)
     return (
       <>
         <dl>
           <dt>is it funky?</dt>
           <dd>{settings.isItFunky ? 'yes' : 'no'}</dd>
         </dl>
         <button onClick={() => patchSettings({ isItFunky: settings.isItFunky! })}>
           turn {settings.isItFunky ? 'off' : 'on'} funky-ness
         </button>
       </>
     )
   }
   ```

1. Modify the server side of you app so that the storage will be available on both client and server.

   Next.js helpers are provided and instructions are included below for integrating with other server-side rendering environments.

   #### Next.js

   ##### Without existing `_app.js`

   If you don't already have a `./pages/_app.js` in your app create one with the following content. This should be all you need and your app should start backing `SettingsContext` instances with cookies.

   ```javascript
   import React from 'react'
   import App, { Container } from 'next/app'
   import SettingsContext, { getInitialPropsWithAppSettings } from 'react-settings-context'

   class MyApp extends App {
     render () {
       const { Component, pageProps, settings } = this.props
       return (
         <SettingsContext.Provider initialData={settings}>
           <Container>
             <Component {...pageProps} />
           </Container>
         </SettingsContext.Provider>
       )
     }
   }

   MyApp.getInitialProps = getInitialPropsWithAppSettings()
   export default MyApp
   ```

   ##### With existing `_app.js`

   If you're not customizing your `_app.js`'s `getInitialProps` you can probably use the previous example as a guide. Otherwise another helper is provided for using inside `getInitialProps`.

   ```javascript
   // ...SNIP...

   MyApp.getInitialProps = async ({ Component, ctx }) {
     const settings = getAppSettingsFromCookie(ctx.req)
     let pageProps = {}
     if (Component.getInitialProps) {
       pageProps = await Component.getInitialProps(ctx)
     }
     return { pageProps, settings }
   }

   export default MyApp
   ```

   #### Other SSR scenarios

   Under the covers the above Next.js helpers do two things:

   1. Parse cookies from `req.headers`
   1. Wrap the app's root component in a React [`ContextProvider`](https://reactjs.org/docs/context.html#contextprovider)

   A helper is exposed for parsing the cookies. This can be used in request handlers and piped into your top level component via props.

   ```javascript
   import { getAppSettingsFromCookie } from 'react-settings-context'
   const settings = getAppSettingsFromCookie('foo', req)
   ```

   And a `Context.Provider` is exposed that ties everything together. How the `settings` value from above is passed to the component is framework-depenent.

   ```javascript
   import SettingsContext from 'react-settings-context'

   function App () {
     render () {
       return {
         <SettingsContext.Provider initialData={settings}>
           <YourPageComponent />
         </SettingsContext.Provider>
       }
     }
   }
   ```

1. Configuring cookie (optional)

   Cookie reading/writing behavior and configuration can be controlled by passing an options object to either `getInitialPropsWithAppSettings` or `getAppSettingsFromCookie`. Reasonable defaults are in place and in many cases configuration won't be necessary. The options listed here are used as described and all other values will be passed to the underlying cookie parsing library.

   ## API

   ### `getAppSettingsFromCookie`/`getInitialPropsWithAppSettings`

   #### `name`

   The name of the cookie. Useful if you will run more than one app on thee same domain. Defaults to `app-settings`

   #### `req`

   The (incoming server-side request)[https://nodejs.org/api/http.html#http_class_http_incomingmessage]. This is used both to denote that the cookie is being read server-side and to expose the cookie headers to the library.

   ### Passed to cookie parsing library

   The following values supplied are by this library as defaults and passed to the [cookie](https://github.com/jshttp/cookie) library are not passed in

   * `maxAge`: `2592000` (2 weeks in ms)
   * `secure` set to true if window location protocol is `https`
   * `domain` set to the domain found in current window location

## Why not [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)?

The main motivation of this library is to enable the rapid production of demo/prototype apps on the Next.js framework (SSR javascript). Using localStorage in this context will cause (a visible re-render)[https://localstorage-settings-demo.arthack.io] each time a page is rendered on the server and then continued on the client because the server will render with the default values irrespective of `localStorage` and then the client will have to re-render with the `localStorage` values.
