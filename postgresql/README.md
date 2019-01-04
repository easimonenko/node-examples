# node-examples

## postgresql

Example for PostgreSQL based on example from "Node.js in Action" (Cantelon, Harter and others).

First, install PostgreSQL:

``` sh
sudo apt install postgresql postgresql-client postgresql-contrib
```

NPM-packages: [`pg`](https://github.com/brianc/node-postgres).

Create database:

``` bash
sudo -u postgres psql
```

``` sql
create database timetrack;
```

Create user:

``` sql
create user timetrack with password 'timetrack';
grant all on database timetrack to timetrack;
```

Run server:

``` bash
npm run postgresql
```

Open in browser <http://localhost:3000>
