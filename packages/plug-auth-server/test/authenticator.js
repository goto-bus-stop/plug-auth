import test from 'tape'

import authenticator from '../src/authenticator'
import testUsers from './util/testUsers'

function localUsersRepository () {
  return {
    getUser(id) {
      const result = testUsers.find((user) => user.id === id)
      if (!result) {
        return Promise.reject(new Error('User not found'))
      }
      return Promise.resolve(result)
    }
  }
}

function make () {
  return authenticator({
    secret: 'TEST',
    users: localUsersRepository()
  })
}

test('getAuthBlurb promises a string', (t) => {
  const auth = make()
  const user = testUsers[0]
  const promise = auth.getAuthBlurb(user.id)
  t.is(typeof promise.then, 'function')
  promise.then((result) => {
    t.is(typeof result, 'object')
    t.is(typeof result.blurb, 'string')
    t.end()
  }).catch(t.fail)
})
