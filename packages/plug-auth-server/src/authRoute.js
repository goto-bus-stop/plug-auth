/**
 * Create an express/koa-style login route handler.
 *
 * @param {Authenticator} auth
 */
module.exports = function authRoute ({ getAuthBlurb, verifyBlurb }) {
  return (req, res) => {
    const { stage, user } = req.body || {}
    if (stage === 'token') {
      getAuthBlurb(user).then((body) => res.json(body))
    } else if (stage === 'verify') {
      verifyBlurb(user)
        .then((body) => {
          res.json(body)
        })
        .catch((reason) => {
          res.writeHeader(403)
          res.json(reason)
        })
    } else {
      res.writeHeader(400)
      res.json({ data: ['invalid stage'] })
    }
  }
}
