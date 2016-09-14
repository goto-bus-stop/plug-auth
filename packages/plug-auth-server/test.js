const pas = require('./')
const cors = require('cors')
const bodyParser = require('body-parser').json
const app = require('express')()

const engine = pas.authenticator({
  auth: {
    email: process.env.PLUGDJ_EMAIL,
    password: process.env.PLUGDJ_PASSWORD
  },
  secret: 'not secret'
})

app.use(bodyParser())

app.options('/auth/login', cors())
app.post('/auth/login', cors(), pas.express(engine))
app.options('/', cors())
app.get('/', cors(), (req, res) => res.json({ secret: 'hoi!' }))

app.use((err, req, res, next) => {
  throw err
})

app.listen(3456)
