const got = require('got')
const pify = require('pify')
const props = require('promise-props')
const randomString = require('random-string')
const jwtCallback = require('jsonwebtoken')

const authedRequest = require('./authedRequest')
const usersRepository = require('./usersRepository')

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
module.exports = function authenticator ({
  auth = {},
  secret,
  users,
  host = 'https://plug.dj',
  signOptions = {},
  verifyOptions = {}
}) {
  if (!auth.host) {
    auth.host = host
  }

  if (!users) {
    users = usersRepository(auth)
  }

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

  const authBlurbs = {}
  function getAuthBlurb (id) {
    if (!id) {
      throw new TypeError('Expected a user ID')
    }

    authBlurbs[id] = {
      blurb: randomString({ length: 60 })
    }
    return Promise.resolve(authBlurbs[id])
  }

  function getProfileBlurb (user) {
    return lazyGotAuthed()(`${host}/_/profile/${user.id}/blurb`)
      .then(({ body }) => body.data[0].blurb)
      .catch(() =>
        got(`${host}/@/${encodeURIComponent(user.slug)}`)
          .then(({ body }) => extractBlurb(body))
      )
  }

  function verifyBlurb (id) {
    const authBlurb = authBlurbs[id]
    if (!authBlurb || !authBlurb.blurb) {
      return Promise.reject(new Error('No blurb token found for that user.'))
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
