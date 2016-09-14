import pify from 'pify'
import login from 'plug-login'
import { serialize } from 'cookie'

function getSessionCookie (result) {
  const cookies = result.jar.getCookies('https://plug.dj/')
  return cookies[0].value
}

export default function authedRequest (request, auth) {
  const { email, password } = auth
  const sessionToken = pify(login)(email, password).then(getSessionCookie)

  return (url, options = {}) => sessionToken.then((token) => {
    options.headers = options.headers || {}
    options.headers.cookie = serialize('session', token, {
      encode: (value) => value
    })
    return request(url, options)
  })
}
