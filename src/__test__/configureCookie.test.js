import test from 'ava'
import configureCookie from '../configureCookie'

test.beforeEach(() => {
  process.browser = false
})

test.serial('reads empty cookie on client', t => {
  process.browser = true
  const win = {
    document: { cookie: '' }
  }
  const cookie = configureCookie({ win })
  const { foo } = cookie.get()
  t.is(foo, undefined)
})

test.serial('reads existing cookie on client', t => {
  process.browser = true
  const win = {
    document: {
      cookie: 'app-settings=%7B%22foo%22%3A%22bar%22%7D'
    }
  }
  const cookie = configureCookie({ win })
  const { foo } = cookie.get()
  t.is(foo, 'bar')
})

test.serial('writes cookie on client', t => {
  process.browser = true
  const win = {
    document: {},
    location: { protocol: 'http' }
  }
  const cookie = configureCookie({ win })
  const { foof: foofBefore } = cookie.get()
  t.is(foofBefore, undefined)
  cookie.set({ foof: 'fuff' })
  const { foof: foofAfter } = cookie.get()
  t.is(foofAfter, 'fuff')
})

test.serial('locks cookie to window location', t => {
  process.browser = true
  const win = {
    document: {},
    location: { hostname: 'momz.comz' }
  }
  const cookie = configureCookie({ win })
  cookie.set({ foof: 'fuff' })
  t.truthy(win.document.cookie.includes('Domain=momz.comz'))
})

test.serial('expires session after one month', t => {
  process.browser = true
  const win = {
    document: {},
    location: { hostname: 'momz.comz' }
  }
  const cookie = configureCookie({ win })
  cookie.set({ foof: 'fuff' })
  const oneMonthSeconds = 60 * 60 * 24 * 30

  t.truthy(win.document.cookie.includes(`Max-Age=${oneMonthSeconds}`))
})

test.serial('allows cookie access from same site only', t => {
  process.browser = true
  const win = {
    document: {},
    location: { hostname: 'momz.comz' }
  }
  const cookie = configureCookie({ win })
  cookie.set({ foof: 'fuff' })
  t.truthy(win.document.cookie.includes('SameSite=Strict'))
})

test.serial('allows manual cookie configuration', t => {
  process.browser = true
  const win = {
    document: {},
    location: { hostname: 'momz.comz' }
  }
  const cookie = configureCookie({ win, domain: 'baddad.com' })
  cookie.set({ foof: 'fuff' })
  t.truthy(win.document.cookie.includes('Domain=baddad.com'))
})

test.serial('marks cookie secure for secure pages', t => {
  process.browser = true
  const secureWin = {
    document: {},
    location: { protocol: 'https' }
  }
  const secureCookie = configureCookie({ win: secureWin })
  secureCookie.set({ foof: 'fuff' })
  t.truthy(secureWin.document.cookie.includes('Secure'))

  const insecureWin = {
    document: {},
    location: { protocol: 'http' }
  }
  const insecureCookie = configureCookie({ win: insecureWin })
  insecureCookie.set({ foof: 'fuff' })
  t.falsy(insecureWin.document.cookie.includes('Secure'))
})

test.serial('reads empty cookie on server', t => {
  const win = undefined
  const req = { headers: {} }
  const cookie = configureCookie({ win, req })
  const { foo } = cookie.get()
  t.is(foo, undefined)
})

test.serial('reads existing cookie on server', t => {
  const win = undefined
  const req = { headers: { cookie: 'app-settings=%7B%22foo%22%3A%22bar%22%7D' } }
  const cookie = configureCookie({ win, req })
  const { foo } = cookie.get()
  t.is(foo, 'bar')
})

test.serial('ignores unrelated cookies on server', t => {
  const win = undefined
  const req = {
    headers: {
      // Notice the cookie name is incorrect
      cookie: 'fooofy=%7B%22foo%22%3A%22bar%22%7D'
    }
  }
  const cookie = configureCookie({ win, req })
  const settings = cookie.get()
  t.deepEqual(settings, {})
})

test.serial(`doesn't write cookie on server`, t => {
  const win = undefined
  const req = { headers: { cookie: 'app-settings=%7B%22foo%22%3A%22bar%22%7D' } }
  const cookie = configureCookie({ win, req })
  const error = t.throws(() => {
    cookie.set({ foof: 'fuff' })
  })
  t.is(error.message, 'Cannot write cookie on the server with this library')
})
