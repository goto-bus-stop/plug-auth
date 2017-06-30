const login = require('plug-login')

module.exports = function authedRequest (request, auth) {
  const { host, email, password } = auth
  const sessionCookie = login.user(email, password, { host })
    .then((result) => result.cookie)

  return (url, options = {}) => sessionCookie.then((cookie) => {
    options.headers = options.headers || {}
    options.headers.cookie = cookie
    return request(url, options)
  })
}
