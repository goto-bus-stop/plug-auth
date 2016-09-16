import test from 'ava'

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

test('getAuthBlurb promises a string', async (t) => {
  const auth = make()
  const user = testUsers[0]
  const promise = auth.getAuthBlurb(user.id)
  t.true(promise instanceof Promise)
  const result = await promise
  t.is(typeof result, 'object')
  t.is(typeof result.blurb, 'string')
})
