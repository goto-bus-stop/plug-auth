# plug-auth

[![Greenkeeper badge](https://badges.greenkeeper.io/goto-bus-stop/plug-auth.svg)](https://greenkeeper.io/)

JavaScript libraries for third-party authentication with plug.dj.

## On the client

[plug-auth-client]

## On the server

[plug-auth-server]

## How it works

plug-auth works by verifying that a user has access to the account they claim to
be.

  1. plug-auth gives the user a unique token
  1. the user changes their profile blurb (bio) to include the token value
  1. plug-auth checks that the user's blurb includes the token value
  1. plug-auth grants access and generates a [JSON Web Token] that can be used
     to verify the user's identity again later
  1. the user changes their blurb back

## Building

The client and server packages are both maintained in a single repo (this one).
You can build them both by:

```bash
npm run build
```

## Testing

plug-auth uses [ava] for tests and [standard] for linting.

To run tests:

```bash
npm run ava
```

To lint:

```bash
npm run lint
```

To do both:

```bash
npm test
```

## License

[MIT]

[plug-auth-client]: ./packages/plug-auth-client#readme
[plug-auth-server]: ./packages/plug-auth-server#readme
[JSON Web Token]: https://github.com/auth0/node-jsonwebtoken#readme
[ava]: http://ava.li
[standard]: http://standardjs.com
[MIT]: ./LICENSE
