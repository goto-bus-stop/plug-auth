var pac = require('./')

pac.authenticate({
  transport: pac.httpTransport({ url: 'http://localhost:3456/auth/login' })
}).then((result) =>
    fetch('http://localhost:3456', {
      headers: { authorization: `JWT ${result.token}` }
    }).then((response) => response.json())
  )
  .then((data) => {
    console.log(data.secret)
  })
