# plug-auth-server

## Installation

```bash
npm install --save plug-auth-server
```

## Usage

```js
import { authenticator } from 'plug-auth-server'

authenticator({

})
```

## API

### authenticator(options: object)

Options:

 - `auth`: Login details for a plug.dj account. This account will be used for
   the requests needed to verify a plug.dj user.

   - `auth.email`: Email address.
   - `auth.password`: Password.

 - `secret`: Key used to sign authentication tokens.
 - `users`: Optional - a user repository instance.

### express(authenticator: object)


## License

[MIT]

[plug.dj]: https://plug.dj/
[MIT]: ./LICENSE
