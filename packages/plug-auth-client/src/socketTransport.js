export default function socketTransport (ws) {
  function write (json) {
    ws.write(JSON.stringify(json))
  }

  function extractToken (msg) {
    try {
      const match = /^_auth_token=(.*?)$/.exec(msg)
      return match[1] || false
    } catch (e) {
      return false
    }
  }

  function getToken (user) {
    return new Promise((resolve, reject) => {
      ws.addEventListener('message', onMessage)
      write({ stage: 'token', user })

      function onMessage (msg) {
        const token = extractToken(msg)
        if (token) {
          resolve(token)
          ws.removeEventListener('message', onMessage)
        }
      }
    })
  }

  function verify (user) {
    write({ stage: 'verify', user })
  }

  return {
    getToken,
    verify
  }
}
