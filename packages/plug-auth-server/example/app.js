const plugAuth = require('../')
const cors = require('cors')
const expressJwt = require('express-jwt')
const bodyParser = require('body-parser').json
const app = require('express')()

const secret = new Buffer('not secret')

const engine = plugAuth.authenticator({
  auth: {
    email: process.env.PLUGDJ_EMAIL,
    password: process.env.PLUGDJ_PASSWORD
  },
  secret: secret
})

// Normally, browsers block AJAX/fetch requests from different domains.
// To be able to do requests in-browser from plug.dj, we need to tell the
// browser that it's okay to send us requests.
const corsInstance = cors({
  origin: 'https://plug.dj'
})

app.use(bodyParser())

// Browsers may "preflight" requests to check if sending us requests is okay.
// Those preflight requests use the OPTIONS method.
// In this case we'll tell the browser that attempting to send requests to ANY
// of our routes is allowed.
app.options('*', corsInstance)

// The login route. `plugAuth.express` creates a single-route middleware.
app.post('/auth/login', corsInstance, plugAuth.express(engine))

// Our protected route! We use the `express-jwt` middleware to verify that the
// user has access. We could also write our own middleware using the plug-auth
// `engine.verifyToken` method.
app.get('/',
  corsInstance,
  expressJwt({
    // Need to pass the same `secret` here as to the `plugAuth.authenticator`!
    // So that the user's token can be decrypted correctly.
    secret: secret,
    // Add the user object to the request object as `plugUser`.
    requestProperty: 'plugUser'
  }),
  //
  (req, res) => res.json({ you: req.plugUser })
)

// If something goes wrong anywhere, just crash.
// Don't do this in a real app! 😱
app.use((err, req, res, next) => {
  throw err
})

app.listen(3456)
