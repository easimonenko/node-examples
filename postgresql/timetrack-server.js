const http = require('http')
const work = require('./lib/timetrack')
const pg = require('pg')

const db = new pg.Client("tcp://timetrack:timetrack@localhost:5432/timetrack")
db.connect()

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

db.query(
  "CREATE TABLE IF NOT EXISTS work ("
  + "id SERIAL PRIMARY KEY, "
  + "hours NUMERIC(5,2) DEFAULT 0, "
  + "date DATE, "
  + "archived SMALLINT DEFAULT 0, "
  + "description TEXT);",
  (err) => {
    if (err) {
      throw err
    }

    console.log('Server started...')
    server.listen(3000)
  }
)
