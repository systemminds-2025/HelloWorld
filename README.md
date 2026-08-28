# React UI Demo

A small React interface with no back end, used to exercise the PM tool's
browser gate end to end: sign in, read some numbers, add and complete a task.

The sign-in accepts any non-empty username and password — there is no server to
check them against, and the point is the flow rather than the authentication.

## Running it

    npm install
    npm run dev        # http://localhost:5173/react-ui-demo/
    npm run build      # static output in dist/

## Where it is served

`vite.config.js` sets `base: '/react-ui-demo/'` and `.env` sets
`VITE_APP_BASENAME`, so the built asset paths and the served path agree when the
project is mounted in a document root rather than at a domain root.
