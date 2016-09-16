const pas = require('./')
const cors = require('cors')
const expressJwt = require('express-jwt')
const bodyParser = require('body-parser').json
const app = require('express')()

const secret = new Buffer('not secret')

const engine = pas.authenticator({
  auth: {
    email: process.env.PLUGDJ_EMAIL,
    password: process.env.PLUGDJ_PASSWORD
  },
  secret: secret
})

app.use(bodyParser())
app.options('*', cors())

app.post('/auth/login', cors(), pas.express(engine))

app.get('/',
  cors(),
  expressJwt({
    secret: secret,
    requestProperty: 'plugUser'
  }),
  (req, res) => res.json({ you: req.plugUser })
)

app.use((err, req, res, next) => {
  throw err
})

app.listen(3456)
