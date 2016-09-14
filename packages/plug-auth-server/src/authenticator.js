import got from 'got'
import randomString from 'random-string'

import usersRepository from './usersRepository'

const AUTH_BLURB = />_auth_blurb=(.{60})</

function extractBlurb (html) {
  const match = AUTH_BLURB.exec(html)
  return match && match[1]
}

export default function authenticator ({
  auth,
  secret,
  users = usersRepository(auth)
}) {
  const tokens = {}

  function createJwt (id) {
    return `test token ${id}`
  }

  function getToken (id) {
    tokens[id] = {
      blurb: randomString({ length: 60 })
    }
    return Promise.resolve(tokens[id])
  }

  function verify (id) {
    const token = tokens[id]
    if (!token || !token.blurb) {
      return Promise.reject(new Error(''))
    }

    const expectedBlurb = token.blurb
    return users.getUser(id)
      .then((user) => got(`https://plug.dj/@/${encodeURIComponent(user.slug)}`))
      .then(({ body }) => extractBlurb(body))
      .then((blurb) => blurb === expectedBlurb)
      .then((ok) => ({
        status: ok ? 'ok' : 'fail',
        token: ok ? createJwt(id) : null
      }))
      .catch((err) => ({
        status: 'fail',
        data: [err.message]
      }))
  }

  return {
    getToken,
    verify
  }
}
