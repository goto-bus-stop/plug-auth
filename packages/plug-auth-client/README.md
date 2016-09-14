# plug-auth-client

Client library for third-party authentication with [plug.dj].

## Installation

```bash
npm install --save plug-auth-client
```

## Usage

```js
import { authenticate, httpTransport } from 'plug-auth-client'

authenticate({
  transport: httpTransport({ url: 'https://my-website.com/auth' })
}).then(() => {
  console.log('done!')
}).catch((error) => {
  console.error(`Whelp: ${error.message}`)
})
```

## API

### authenticate(opts)

Authenticate with a remote server.

[plug.dj]: https://plug.dj/
