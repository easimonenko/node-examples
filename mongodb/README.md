# node-examples

## mongodb

Example for MongoDB based on example from "Node.js in Action" (Cantelon, Harter and others).

First, install the MongoDB. Full instructions see on
[official site](https://docs.mongodb.com/master/tutorial/install-mongodb-on-ubuntu/).

``` bash
sudo apt install mongodb-org
```

Also will be installed `mongodb-org-server`, `mongodb-org-mongos`, `mongodb-org-shell`, `mongodb-org-tools`.

Run and stop MongoDB

``` sh
sudo service mongod start
sudo service mongod stop
```

NPM-packages: [`mongodb`](https://github.com/mongodb/node-mongodb-native),
[`querystring`](https://nodejs.org/api/querystring.html).

Create database: not required.

Create user: not required.

Run server:

``` bash
npm run mongodb
```

or

``` bash
node timetrack-server.js
```

Then open in browser <http://localhost:3000>
