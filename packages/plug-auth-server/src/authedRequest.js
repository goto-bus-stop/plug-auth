import pify from 'pify'
import login from 'plug-login'
import { serialize } from 'cookie'

/**
 * Get the plug.dj session token from a plug-login result.
 * @private
 */
function getSessionCookie (host, result) {
  const cookies = result.jar.getCookies(`${host}/`)
  if (cookies.length > 0 && cookies[0]) {
    return cookies[0].value
  }
}

export default function authedRequest (request, auth) {
  const { host, email, password } = auth
  const sessionToken = pify(login)(email, password)
    .then((result) => getSessionCookie(host, result))

  return (url, options = {}) => sessionToken.then((token) => {
    options.headers = options.headers || {}
    options.headers.cookie = serialize('session', token, {
      encode: (value) => value
    })
    return request(url, options)
  })
}
