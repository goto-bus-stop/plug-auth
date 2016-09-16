import got from 'got'
import pify from 'pify'
import props from 'promise-props'
import randomString from 'random-string'
import * as jwtCallback from 'jsonwebtoken'

import authedRequest from './authedRequest'
import usersRepository from './usersRepository'

const signJwt = pify(jwtCallback.sign)
const verifyJwt = pify(jwtCallback.verify)

const AUTH_BLURB = />_auth_blurb=(.{60})</

function extractBlurb (html) {
  const match = AUTH_BLURB.exec(html)
  return match && match[1]
}

/**
 * @param {Object} opts - Options.
 * @param {Object} opts.auth - Login details for a plug.dj account. This account will
 *    be used for the requests needed to verify a plug.dj user.
 * @param {string} opts.auth.email - plug.dj email address.
 * @param {string} opts.auth.password - plug.dj password.
 * @param {string|Buffer} opts.secret - Key used to sign authentication tokens.
 * @param {UsersRepository} opts.users - Optional - a user repository instance.
 * @returns {Authenticator}
 */
export default function authenticator ({
  auth,
  secret,
  users = usersRepository(auth),
  signOptions = {},
  verifyOptions = {}
}) {
  const authBlurbs = {}
  let gotAuthed
  function lazyGotAuthed () {
    if (!gotAuthed) {
      gotAuthed = authedRequest(got, auth)
    }
    return gotAuthed
  }

  function createJwt (user) {
    return signJwt(user, secret, signOptions)
  }

  function getAuthBlurb (id) {
    authBlurbs[id] = {
      blurb: randomString({ length: 60 })
    }
    return Promise.resolve(authBlurbs[id])
  }

  function getProfileBlurb(user) {
    return lazyGotAuthed()(`https://plug.dj/_/profile/${user.id}/blurb`)
      .then(({ body }) => body.data[0].blurb)
      .catch(() =>
        got(`https://plug.dj/@/${encodeURIComponent(user.slug)}`)
          .then(({ body }) => extractBlurb(body))
      )
  }

  function verifyBlurb (id) {
    const authBlurb = authBlurbs[id]
    if (!authBlurb || !authBlurb.blurb) {
      return Promise.reject(new Error(''))
    }

    const expectedBlurb = authBlurb.blurb
    return users.getUser(id).then((user) =>
      getProfileBlurb(user)
        .then((blurb) => blurb === expectedBlurb)
        .then((ok) => props({
          status: ok ? 'ok' : 'fail',
          token: ok ? createJwt(user) : null
        }))
    ).catch((err) => ({
      status: 'fail',
      data: [err.message]
    }))
  }

  function verifyToken (token) {
    return verifyJwt(token, secret, verifyOptions)
  }

  return {
    getAuthBlurb,
    verifyBlurb,
    verifyToken
  }
}
