"use strict";

const connect = require('connect')
const connectRedis = require('connect-redis')
const cookieParser = require('cookie-parser')
const favicon = require('serve-favicon')
const http = require('http')
const path = require('path')
const redis = require('redis')
const session = require('express-session')
const serveIndex = require('serve-index')
const url = require('url')

const RedisStore = connectRedis(session)
const redisClient = redis.createClient({
  prefix: 'sid'
})

const app = connect()

app
  .use(favicon(path.join(__dirname, 'favicon.ico')))
  .use(cookieParser('My Secret!'))
  .use(session({
    store: new RedisStore({
      client: redisClient
    }),
    saveUninitialized: false,
    secret: 'My Secret!',
    resave: false
  }))
  .use(logger)
  .use(rewriteUserName)
  .use('/admin', restrict)
  .use('/admin', admin)
  .use('/', serveIndex('./', {
    icons: true
  }))
  .use(hello)
  .use(errorHandler)
  .listen(3000)

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {*} next
 */
function logger(req, res, next) {
  console.log('%s %s', req.method, req.url)
  next()
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World!')
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {*} next
 */
function restrict(req, res, next) {
  /** @type {string} */
  const authorization = req.headers.authorization
  if (!authorization) {
    return next(new Error('Unauthorized.'))
  }

  const parts = authorization.split(' ')
  const scheme = parts[0]
  const [user, pass] = new Buffer(parts[1], 'base64').toString().split(':')

  authenticateWithDatabase(user, pass, (err) => {
    if (err) {
      return next(err)
    }
    next()
  })
}

/** @type {Object} */
const users = require('./users')

function authenticateWithDatabase(user, pass, cb) {
  const userExists = !!users[user]
  if (!userExists) {
    return cb(new Error('The user does not exist.'))
  }
  const checkPassword = users[user].password == pass
  if (!checkPassword) {
    return cb(new Error('The password does not match.'))
  }
  cb()
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function admin(req, res) {
  if (req.url == '/users') {
    res.setHeader('Content-Type', 'application/json')
    const usersNames = []
    for (let name in users) {
      usersNames.push(name)
    }
    res.end(JSON.stringify(usersNames))
  } else {
    res.setHeader('Content-Type', 'text/plain')
    res.setHeader('Location', '/admin/users')
    res.statusCode = 301
    res.end('Redirect.')
  }
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {*} next
 */
function rewriteUserName(req, res, next) {
  const path = url.parse(req.url).pathname
  const match = path.match(/\/users\/(.+)/)
  if (match) {
    findUserIdByUserName(match[1], (err, id) => {
      if (err) {
        next(err)
      }

      console.log('User id: ' + id)
      req.url = match[0] + id
      next()
    })
  } else {
    next()
  }
}

/**
 * @param {string} userName
 * @param {*} cb
 */
function findUserIdByUserName(userName, cb) {
  const userExists = !!users[userName]
  if (!userExists) {
    return cb(new Error('The user does not exist.'))
  }

  return cb(null, users[userName].id)
}

/**
 * @param {Error} err
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {*} next
 */
function errorHandler(err, req, res, next) {
  const env = process.env.NODE_ENV || 'development'
  res.statusCode = 500
  switch (env) {
    case 'development':
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(err))
      break;
    default:
      res.end('Server error.')
      break;
  }
}
