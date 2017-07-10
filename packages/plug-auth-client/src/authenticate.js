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

function authenticate ({
  user = API.getUser().id,
  transport
} = {}) {
  let oldBlurb

  return transport.getToken({ user })
    .then((data) => {
      return getBlurb().then((blurb) => {
        oldBlurb = blurb
        return setBlurb(`_auth_blurb=${data.blurb}`)
      })
    })
    .then(() => transport.verify({ user }))
    .then(
      (result) => setBlurb(oldBlurb).then(() => result && result.token ? result : null),
      (err) => setBlurb(oldBlurb).then(() => { throw err })
    )
}

export default authenticate
