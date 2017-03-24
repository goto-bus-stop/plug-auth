import unfetch from 'unfetch'

function rejectNonOK (response) {
  if (response.status !== 200) {
    return response.json().then((message) => {
      const error = new Error(message)
      error.response = response
      return Promise.reject(error)
    })
  }
  return response
}

export default function wrappedFetch (url, options) {
  return unfetch(url, options)
    .then(rejectNonOK)
    .then(res => res.json())
}
