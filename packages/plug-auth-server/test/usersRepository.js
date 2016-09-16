import test from 'ava'

import usersRepository from '../src/usersRepository'
import mockplug from './util/mockplug'
import testUsers from './util/testUsers'

const creds = {
  email: 'test@plug-auth.github.io',
  password: 'it_s_fake'
}

test.beforeEach(async (t) => {
  t.context = await mockplug(testUsers)
})
test.afterEach((t) => new Promise((resolve) => {
  t.context.close(() => resolve())
}))

test('Fails for nonexistent users', async (t) => {
  const { getUser } = usersRepository(Object.assign(
    { host: t.context.url },
    creds
  ))
  await t.throws(getUser(777777))
})

test('Returns a user object for existing user IDs', async (t) => {
  const { getUser } = usersRepository(Object.assign(
    { host: t.context.url },
    creds
  ))
  const user = await getUser(64356)
  t.is(user.id, 64356)
  t.is(user.slug, 'mnopqr')
})
