"use strict"

const fs = require('fs')
const http = require('http')
const mime = require('mime')
const path = require('path')

/**
 * @type {Object.<string, string>}
 */
const cache = {}

/**
 * @param {http.ServerResponse} res
 */
function send404(res) {
  res.writeHead(404, {
    'Content-Type': 'text/plain'
  })
  res.write('Error 404: resource not found.')
  res.end()
}

/**
 * @param {http.ServerResponse} res
 * @param {string} filePath
 * @param {Buffer} fileContents
 */
function sendFile(res, filePath, fileContents) {
  res.writeHead(200, {
    'Content-Type': mime.lookup(path.basename(filePath))
  })
  res.end(fileContents)
}

/**
 * @param {http.ServerResponse} res
 * @param {Object.<string, string>} cache
 * @param {string} absPath
 */
function serveStatic(res, cache, absPath) {
  if (cache[absPath]) {
    sendFile(res, absPath, cache[absPath])
  } else {
    fs.exists(absPath, (exists) => {
      if (exists) {
        fs.readFile(absPath, (err, data) => {
          if (err) {
            send404(res)
          } else {
            cache[absPath] = data
            sendFile(res, absPath, data)
          }
        })
      } else {
        send404(res)
      }
    })
  }
}

const server = http.createServer((req, res) => {
  const filePath = 'public' + (req.url == '/' ? '/index.html' : req.url)
  const absPath = './socket.io/' + filePath
  console.log(filePath)
  serveStatic(res, cache, absPath)
})

server.listen(3000, () => {
  console.log('Server listening on port 3000.')
})

const chatServer = require('./lib/chat_server')
chatServer.listen(server)
