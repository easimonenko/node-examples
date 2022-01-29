# node-examples

## mysql

Example for MySQL based on example from "Node.js in Action" (Cantelon, Harter and others).

First, install MySQL:

``` sh
sudo apt install mysql-server mysql-client
```

NPM-packages:
- [`mysql`](https://github.com/mysqljs/mysql)

Start server (Ubuntu Linux):

``` bash
sudo systemctl start mysql.service
```

Create database:

``` bash
sudo mysql
```

``` sql
create database timetrack;
```

Create user:

``` sql
create user 'timetrack'@'localhost';
grant all on timetrack.* to 'timetrack'@'localhost';
alter user 'timetrack'@'localhost' identified with mysql_native_password by 'timetrack';
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
