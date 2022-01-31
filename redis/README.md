# node-examples

## redis

Example for [Redis](https://redis.io/) based on example "Node.js in Action" (Cantelon, Harter and others).

First, install Redis:

``` bash
sudo apt install redis-server
```

Also will be installed `redis-tools`.

Run Redis:

``` bash
sudo systemctl start redis
systemctl status redis
```

NPM-packages:
- [`redis`](https://github.com/NodeRedis/node_redis)
- [`uuid`](https://github.com/kelektiv/node-uuid)

Also will be installed `redis-commands`, `redis-parser`.

Create database: not required.

Create user: not required.

Run server:

``` bash
npm run redis
```

or

``` bash
node timetrack-server.js
```

Open in browser <http://localhost:3000>.
