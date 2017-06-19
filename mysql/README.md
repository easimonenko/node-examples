# node-examples

## mysql

Example for MySQL based on "Node.js in Action" (Cantelon, Harter and others).

- install MySQL

``` sh
sudo apt install mysql-server
```

Also will be installed `mysql-client`.

- NPM-package:

`mysql`

- create database

``` sh
mysql -u root -p
```

``` sql
create database timetrack;
```

- create user

``` sql
grant all on timetrack.* to 'timetrack'@'localhost' identified by 'timetrack';
```

- run server

``` sh
npm run mysql
```

- open in browser

``` plain
http://localhost:3000
```
