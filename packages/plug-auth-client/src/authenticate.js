/* global API */
import { unescape } from 'plug-message-split'
import fetch from './fetch'

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

function getBlurb () {
  return fetch('/_/users/me', { credentials: 'same-origin' })
    .then(res => unescape(res.data[0].blurb))
}

function setBlurb (blurb) {
  return fetch('/_/profile/blurb', {
    credentials: 'same-origin',
    method: 'put',
    headers: jsonHeaders,
    body: JSON.stringify({ blurb: blurb })
  })
}

export default async function authenticate ({
  user = API.getUser().id,
  transport
} = {}) {
  let oldBlurb
  let result

  try {
    const data = await transport.getToken({ user })
    oldBlurb = await getBlurb()
    await setBlurb(`_auth_blurb=${data.blurb}`)
    result = await transport.verify({ user })
  } catch (e) {
    throw e
  } finally {
    if (oldBlurb) {
      await setBlurb(oldBlurb)
    }
  }

  if (result && result.token) {
    return result
  }
}
