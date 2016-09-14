import got from 'got'
import authedRequest from './authedRequest'

export default function usersRepository (creds) {
  const cache = {}
  const gotAuthed = authedRequest(got, creds)

  function getUser (id) {
    id = Number(id)
    if (!isFinite(id)) {
      return Promise.reject()
    }
    if (cache[id]) {
      return Promise.resolve(cache[id])
    }

    return gotAuthed(`https://plug.dj/_/users/${id}`, {
      json: true
    }).then(({ body }) => {
      if (body.status !== 'ok') {
        throw new Error(body.data[0])
      }
      return cache[id] = body.data[0]
    })
  }

  return { getUser }
}
