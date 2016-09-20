const authenticate = require('../').authenticate
const httpTransport = require('../').httpTransport

authenticate({
  transport: httpTransport({ url: 'http://localhost:3456/auth/login' })
}).then((result) =>
    fetch('http://localhost:3456', {
      headers: { authorization: `Bearer ${result.token}` }
    }).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json()
      }
      const error = new Error(response.statusText)
      error.response = response
      throw error
    })
  )
  .then((data) => {
    console.log(data)
  })
