"use strict"

const http = require('http')
const work = require('./lib/timetrack')
const redis = require('redis')

const db = new redis.createClient()

db.on('error', (err) => {
  throw err
})

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

console.log('Server started...')
server.listen(3000)
