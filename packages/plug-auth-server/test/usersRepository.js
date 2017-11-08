import test from 'tape'

import usersRepository from '../src/usersRepository'
import mockplug from './util/mockplug'
import testUsers from './util/testUsers'

const creds = {
  email: 'test@plug-auth.github.io',
  password: 'it_s_fake'
}

function testPlug (name, fn) {
  return test(name, (t) => {
    mockplug(testUsers).then((plug) => {
      t.context = plug
      t.realEnd = t.end
      t.end = () => {
        plug.close(() => {
          t.realEnd()
        })
      }
      fn(t)
    })
  })
}

testPlug('Fails for nonexistent users', (t) => {
  const { getUser } = usersRepository(Object.assign(
    { host: t.context.url },
    creds
  ))
  getUser(777777).then(t.fail, (err) => {
    t.pass()
    t.end()
  })
})

testPlug('Returns a user object for existing user IDs', (t) => {
  const { getUser } = usersRepository(Object.assign(
    { host: t.context.url },
    creds
  ))
  getUser(64356).then((user) => {
    t.is(user.id, 64356)
    t.is(user.slug, 'mnopqr')
    t.end()
  }, t.fail)
})
