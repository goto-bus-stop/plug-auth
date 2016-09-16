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

### authenticate(options: object)

Authenticate with a remote server.

Options:

 - `transport`: A transport instance. Required.
 - `user`: User ID to authenticate as. Defaults to `API.getUser().id`, which
   is the current user ID on plug.dj.

### httpTransport(options: object)

Options:

 - `url`: URL of the endpoint to authenticate to. Use this option if the `token`
   and `verify` steps should both use the same URL, like when using the default
   [plug-auth-server] middleware.
 - `tokenUrl`: URL of the endpoint used to get a unique token that will be used
   to verify the user's identity. Defaults to the value of the `url` option.
 - `verifyUrl`: URL of the endpoint used to verify the user's identity. Defaults
   to the value of the `url` option.

## License

[MIT]

[plug.dj]: https://plug.dj/
[plug-auth-server]: ../plug-auth-server#readme
[MIT]: ./LICENSE
