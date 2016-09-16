# plug-auth-server

## Installation

```bash
npm install --save plug-auth-server
```

## Usage

See the [example app] for a more in-depth example.

```js
import * as fs from 'fs'
import express from 'express'
import {
  authenticator,
  authRoute
} from 'plug-auth-server'

const secret = fs.readFileSync('./secret.dat')

const engine = authenticator({
  auth: userAccount,
  secret: secret
})

const app = express()
app.use('/plug-auth', authRoute(engine))
```

## API

### authenticator(options: object)

Options:

 - `auth`: Login details for a [plug.dj] account. This account will be used for
   the requests needed to verify a [plug.dj] user.

   - `auth.email`: Email address.
   - `auth.password`: Password.

 - `secret`: Key used to sign authentication tokens.
 - `users`: Optional - a user repository instance.

### authRoute(authenticator: object)

Create an express/koa-style route handler for the authentication endpoint. Works
well together with plug-auth-client's [`httpTransport`][httpTransport].

```js
import { authenticator, authRoute } from 'plug-auth-server'
const engine = authenticator({ ...options })
const app = express()
app.use('/plug-auth', authRoute(engine))
```

## License

[MIT]

[plug.dj]: https://plug.dj/
[example app]: ./example/app.js
[httpTransport]: ../plug-auth-client#httpTransport
[MIT]: ./LICENSE
