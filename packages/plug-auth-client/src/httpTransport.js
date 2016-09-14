import fetch from './fetch'

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

export default function httpTransport (opts = {}) {
  const tokenUrl = opts.tokenUrl || opts.url
  const verifyUrl = opts.verifyUrl || opts.url

  function getToken ({ user }) {
    return fetch(tokenUrl, {
      credentials: 'same-origin',
      method: 'post',
      headers: jsonHeaders,
      body: JSON.stringify({ stage: 'token', user })
    })
  }

  function verify ({ user }) {
    return fetch(verifyUrl, {
      credentials: 'same-origin',
      method: 'post',
      headers: jsonHeaders,
      body: JSON.stringify({ stage: 'verify', user })
    }).then((res) => {
      if (res.status === 'ok') {
        return { token: res.token }
      } else {
        throw new Error('HTTPAuthenticator failed')
      }
    })
  }

  return {
    getToken,
    verify
  }
}
