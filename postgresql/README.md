# node-examples

## postgresql

- install PostgreSQL

``` sh
sudo apt install postgresql postgresql-client postgresql-contrib
```

- create database

``` sh
sudo -u postgres psql
```

``` sql
create database timetrack;
```

- create user

``` sql
create user timetrack with password 'timetrack';
grant all on database timetrack to timetrack;
```

- run server

``` sh
npm run postgresql
```

- open in browser

``` plain
http://localhost:3000
```
