"use strict"

const http = require('http')
const work = require('./lib/timetrack')
const mongodb = require('mongodb')

const client = mongodb.MongoClient

const mongoUrl = "mongodb://localhost:27017/timetrack"

var db;

const server = http.createServer((req, res) => {
  switch (req.method) {
    case 'POST':
      switch (req.url) {
        case '/':
          work.add(db, req, res)
          break;

        case '/archive':
          work.archive(db, req, res)
          break;

        case '/delete':
          work.deleteWork(db, req, res)
          break;

        default:
          break;
      }
      break;

    case 'GET':
      switch (req.url) {
        case '/':
          work.show(db, res)
          break;

        case '/archived':
          work.showArchived(db, res)
          break;

        default:
          break;
      }
      break;

    default:
      break;
  }
})

client.connect(mongoUrl, (err, connection) => {
  if (err) {
    throw err
  }

  db = connection

  server.on('close', () => {
    console.log("Close connection to database.")
    console.log("Close server.")
    connection.close()
  })

  console.log('Server started...')
  server.listen(3000)
})
