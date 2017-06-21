const http = require('http')
const work = require('./lib/timetrack')
const mongoose = require('mongoose')

const mongoUrl = "mongodb://localhost:27017/timetrack"

mongoose.connect(mongoUrl);

const WorkSchema = new mongoose.Schema({
  hours: Number,
  date: String,
  archived: Number,
  description: String
})

const Work = mongoose.model('Work', WorkSchema)

const server = http.createServer((req, res) => {
  switch (req.method) {
    case 'POST':
      switch (req.url) {
        case '/':
          work.add(mongoose, req, res)
          break;
        
        case '/archive':
          work.archive(mongoose, req, res)
          break;

        case '/delete':
          work.deleteWork(mongoose, req, res)
          break;

        default:
          break;
      }
      break;
  
  case 'GET':
    switch (req.url) {
      case '/':
        work.show(mongoose, res)
        break;
    
      case '/archived':
        work.showArchived(mongoose, res)
        break;

      default:
        break;
    }
    break;

  default:
    break;
  }
})

server.on('close', () => {
  console.log("Close connection to database.")
  mongoose.disconnect()
  console.log("Close server.")
})

console.log('Server started...')
server.listen(3000)
