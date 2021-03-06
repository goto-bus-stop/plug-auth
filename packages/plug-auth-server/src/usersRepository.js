const got = require('got')
const authedRequest = require('./authedRequest')

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} username
 * @property {string} slug
 */

/**
 * @typedef {Object} UsersRepository
 * @property {function(number): Promise<User>} getUser
 */

/**
 * Creates a user repository.
 *
 * @param {Object} creds - Login details for a plug.dj account. Used to do
 *    authenticated requests to find out user profile URLs.
 *
 * @returns {UsersRepository}
 */
module.exports = function usersRepository (auth) {
  if (!auth.host) {
    auth.host = 'https://plug.dj'
  }

  const gotAuthed = authedRequest(got, auth)

  function getUser (id) {
    id = Number(id)
    if (!isFinite(id)) {
      return Promise.reject(new Error('Expected a numeric user ID.'))
    }

    return gotAuthed(`${auth.host}/_/users/${id}`, {
      json: true
    }).then(({ body }) => {
      if (body.status !== 'ok') {
        throw new Error(body.data[0])
      }
      return body.data[0]
    })
  }

  return { getUser }
}
