# node-examples

## connect

Example for [Connect](https://github.com/senchalabs/connect).

It uses NPM-packages:
- [`connect`](https://github.com/senchalabs/connect)
- [`connect-redis`](https://github.com/tj/connect-redis)
- [`redis`](https://github.com/redis/node-redis)
- [`cookie-parser`](https://github.com/expressjs/cookie-parser)
- [`serve-favicon`](https://github.com/expressjs/serve-favicon)
- [`path`](https://nodejs.org/api/path.html)
- [`express-session`](https://github.com/expressjs/session)
- [`serve-index`](https://github.com/expressjs/serve-index)

Install Redis:

``` bash
sudo apt install redis
```

Run server:

``` bash
npm run connect
```

or

``` bash
node server.js
```

Then open browser with url <http://localhost:3000/users>.
