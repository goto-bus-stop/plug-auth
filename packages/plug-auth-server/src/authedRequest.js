const pify = require('pify')
const login = require('plug-login')
const { serialize } = require('cookie')

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

module.exports = function authedRequest (request, auth) {
  const { host, email, password } = auth
  const sessionToken = pify(login)(email, password)
    .then((result) => getSessionCookie(host, result))

  return (url, options = {}) => sessionToken.then((token) => {
    options.headers = options.headers || {}
    options.headers.cookie = serialize('session', token, {
      // The default `encode` function URL-encodes characters that make plug.dj
      // not recognise the session token. We can do without encoding at all.
      encode: (value) => value
    })
    return request(url, options)
  })
}
