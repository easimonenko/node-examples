# node-examples

## mysql

Example for MySQL based on example from "Node.js in Action" (Cantelon, Harter and others).

First, install MySQL:

``` sh
sudo apt install mysql-server
```

Also will be installed `mysql-client`.

NPM-packages: [`mysql`](https://github.com/mysqljs/mysql).

Create database:

``` bash
mysql -u root -p
```

``` sql
create database timetrack;
```

Create user:

``` sql
grant all on timetrack.* to 'timetrack'@'localhost' identified by 'timetrack';
```

Run server:

``` bash
npm run mysql
```

or

``` bash
node timetrack-server.js
```

Open in browser <http://localhost:3000>.
