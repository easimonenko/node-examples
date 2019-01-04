# node-examples

## mongoose

Example for MongoDB with Mongoose based on example from "Node.js in Action" (Cantelon, Harter and others).

First, install MongoDB. Full instructions see on
[official site](https://docs.mongodb.com/master/tutorial/install-mongodb-on-ubuntu/).

``` bash
sudo apt install mongodb-org
```

Also will be installed `mongodb-org-server`, `mongodb-org-mongos`, `mongodb-org-shell`, `mongodb-org-tools`.

Run and stop MongoDB:

``` bash
sudo service mongod start
sudo service mongod stop
```

NPM-packages: [`mongoose`](https://mongoosejs.com/).

Create database: not required.

Create user: not required.

Run server:

``` bash
npm run mongoose
```

or

``` bash
node timetrack-server.js
```

Open in browser <http://localhost:3000>
