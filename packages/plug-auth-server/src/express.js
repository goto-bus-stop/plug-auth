export default function express ({ getToken, verify }) {
  return (req, res) => {
    const { stage, user } = req.body || {}
    if (stage === 'token') {
      getToken(user).then((body) => res.json(body))
    } else if (stage === 'verify') {
      verify(user)
        .then((body) => res.json(body))
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
