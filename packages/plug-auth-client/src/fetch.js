import unfetch from 'unfetch'
const fetch = window.fetch || unfetch

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
  return fetch(url, options)
    .then(rejectNonOK)
    .then(res => res.json())
}
