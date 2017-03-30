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
}).then((result) => {
  console.log('done!')
  // Token for doing authenticated requests in `result.token`
}).catch((error) => {
  console.error(`Whelp: ${error.message}`)
})
```

plug-auth-client uses Promises, which are not supported in Internet Explorer. If
you want to support Internet Explorer, also include [es6-promise][] in your
script:

```js
// After `npm install --save es6-promise`:
import 'es6-promise'
```
```js
// or use AMD:
define([
  'https://cdnjs.cloudflare.com/ajax/libs/es6-promise/3.3.1/es6-promise.min.js'
], function () {
  // your code
})
```

## API

### authenticate(options: object)

Authenticate with a remote server.

Options:

 - `transport`: A transport instance. Required.
 - `user`: User ID to authenticate as. Defaults to `API.getUser().id`, which
   is the current user ID on plug.dj.

<a id="httpTransport"></a>
### httpTransport(options: object)

Create a transport that talks to a [plug-auth-server]-style HTTP authentication
endpoint.

Options:

 - `url`: URL of the endpoint to authenticate to. Use this option if the `token`
   and `verify` steps should both use the same URL, like when using the default
   [plug-auth-server] middleware.
 - `tokenUrl`: URL of the endpoint used to get a unique token that will be used
   to verify the user's identity. Defaults to the value of the `url` option.
 - `verifyUrl`: URL of the endpoint used to verify the user's identity. Defaults
   to the value of the `url` option.

## Custom Transports

Transports are objects with a `getToken` and a `verify` method.

### transport.getToken(options: {user: number})

Generate the verification token that will be put in the user's blurb. Should
return a Promise for an object of the shape:

 - `blurb`: Token to store in the blurb.

### transport.verify(options: {user: number})

Ask the authentication endpoint to verify the token in the user's blurb. Should
return a Promise for an object of the shape:

 - `token`: Authentication token.

## License

[MIT]

[plug.dj]: https://plug.dj/
[plug-auth-server]: ../plug-auth-server#readme
[es6-promise]: https://github.com/stefanpenner/es6-promise
[whatwg-fetch]: https://github.com/github/fetch
[MIT]: ./LICENSE
