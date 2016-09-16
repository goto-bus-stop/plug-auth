import express from 'express'

/**
 * Fake implementation of a tiny part of the plug.dj API.
 */
export default function mockplug (testUsers) {
  const app = express()

  app.get('/_/profile/:id/blurb', (req, res) => {
    const user = testUsers.find((u) => u.id === parseInt(req.params.id, 10))
    if (!user) {
      res.status(404).json({
        status: "requestError",
        data: []
      })
      return
    }
    res.json({
      status: 'ok',
      data: [
        { blurb: user.blurb }
      ]
    })
  })

  app.get('/_/users/:id', (req, res) => {
    const user = testUsers.find((u) => u.id === parseInt(req.params.id, 10))
    if (!user) {
      res.status(404).json({
        status: 'notFound',
        data: null
      })
      return
    }
    res.json({
      status: 'ok',
      data: [user]
    })
  })

  app.get('/@/:slug', (req, res) => {
    const user = testUsers.find((u) => u.slug === req.params.slug)
    res.send(`
      <div class="username">${user.username}</div>
        <div class="blurb">
          <div class="arrow-up"></div>
          <div class="box">${user.blurb}</div>
        </div>
      </div>
    `)
  })

  app.get('*', (req, res) => {
    res.status(404).send('not found')
  })

  return new Promise((resolve, reject) => {
    const server = app.listen((err) => {
      if (err) {
        reject(err)
      } else {
        server.url = `http://localhost:${server.address().port}`
        resolve(server)
      }
    })
  })
}
