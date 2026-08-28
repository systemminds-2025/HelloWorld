# HelloWorld

A React landing page that says Hello World. Nothing else.

## Running it

    npm install
    npm run dev        # http://localhost:5173/react-ui-demo/
    npm run build      # static output in dist/

## Where it is served

`vite.config.js` sets `base: '/react-ui-demo/'` and `.env` sets
`VITE_APP_BASENAME`, so the built asset paths and the served path agree when the
project is mounted in a document root rather than at a domain root.
