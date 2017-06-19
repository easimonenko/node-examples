'use strict';

import * as http from 'http'
import * as querystring from 'querystring'
import * as redis from 'redis'
import * as uuid from 'uuid'

/**
 * @param {http.ServerResponse} res 
 * @param {string} html 
 */
function sendHtml(res, html) {
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(html)
}

exports.sendHtml = sendHtml

/**
 * @param {http.IncomingMessage} req
 */
function parseReceivedData(req, cb) {
  var body = ''
  req.setEncoding('utf8')
  req.on('data', (chunk) => {
    body += chunk
  })
  req.on('end', () => {
    const data = querystring.parse(body)
    cb(data)
  })
}

exports.parseReceivedData = parseReceivedData

function actionForm(id, path, label) {
  const html =
    '<form method="POST" action="' + path + '">'
    + '<input type="hidden" name="id" value="' + id + '"/>'
    + '<input type="submit" value="' + label + '"/>'
    + '</form>'
  
  return html
}

exports.actionForm = actionForm

/**
 * @param {redis.RedisClient} db 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function add(db, req, res) {
  parseReceivedData(req, (work) => {
    const workUuid = uuid.v1()
    if (work.archived === undefined) {
      work.archived = 0
    }
    db.hmset(workUuid, work, (err, reply) => {
      redis.print(err, reply)
      if (!err) {
        db.lpush('work:ids', workUuid, redis.print)
      }
      show(db, res)
    })
  })
}

exports.add = add

/**
 * @param {redis.RedisClient} db 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function deleteWork(db, req, res) {
  parseReceivedData(req, (work) => {
    db.del(
      work.id,
      (err, reply) => {
        redis.print(err, reply)

        show(db, res)
      }
    )
  })
}

exports.deleteWork = deleteWork

/**
 * @param {redis.RedisClient} db 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function archive(db, req, res) {
  parseReceivedData(req, (work) => {
    db.hgetall(work.id, (err, oneWork) => {
      redis.print(err, oneWork)

      if (!err) {
        db.del(work.id,
          (err, reply) => {
            redis.print(err, reply)

            if (!err) {
              oneWork.archived = 1

              db.hmset(work.id, oneWork, (err, reply) => {
                redis.print(err, reply)

                if (!err) {
                  show(db, res)
                }
              })
            }
          }
        )
      }
    })
  })
}

exports.archive = archive

/**
 * @param {redis.RedisClient} db 
 * @param {http.ServerResponse} res 
 * @param {boolean} showArchived 
 */
function show(db, res, showArchived) {
  const archiveValue = (showArchived) ? 1 : 0
  
  db.lrange('work:ids', 0, -1, (err, items) => {
    if (err) {
      throw err
    }

    var work = []

    if (items.length == 0) {
      console.log('Empty list.')
    }

    var counter = 0;

    items.forEach((item, i) => {
      console.log(i + ": " + item + "\n")
      db.hgetall(item, (err, oneWork) => {
        if (err) {
          throw err
        }
        counter += 1
        if (oneWork && oneWork.archived == archiveValue) {
          oneWork.id = item
          work.push(oneWork)
        }
      })
    })

    setTimeout(function repeat() {
      if (counter == items.length) {
        var html =
          (showArchived)
          ? ''
          : '<a href="/archived">Archived Work</a><br/>'
        html += workHitListHtml(work)
        html += workFormHtml()
        sendHtml(res, html)
      }
      else {
        setTimeout(repeat, 0)
      }
    }, 0)
  })
}

exports.show = show

/**
 * @param {redis.RedisClient} db 
 * @param {http.ServerResponse} res 
 */
function showArchived(db, res) {
  show(db, res, true)
}

exports.showArchived = showArchived

function workHitListHtml(rows) {
  console.log('Work length: ' + rows.length)

  var html = '<table>'
  for (var i in rows) {
    html += '<tr>'
    html += '<td>' + rows[i].date + '</td>'
    html += '<td>' + rows[i].hours + '</td>'
    html += '<td>' + rows[i].description + '</td>'

    const archived = rows[i].archived != undefined && !!parseInt(rows[i].archived)
    if (!archived) {
      html += '<td>' + workArchiveForm(rows[i].id) + '</td>'
    }

    html += '<td>' + workDeleteForm(rows[i].id) + '</td>'
    html += '</tr>'
  }
  html += '</table>'

  return html
}

exports.workHitListHtml = workHitListHtml

function workFormHtml() {
  var html =
    '<form method="POST" action="/">'
    + '<p>Date (YYYY-MM-DD):<br/><input name="date" type="text"></p>'
    + '<p>Hours worked:<br/><input name="hours" type="text"></p>'
    + '<p>Description:</br>'
    + '<textarea name="description"></textarea>'
    + '</p>'
    + '<input type="submit" value="Add" />'
    + '</form>'
  
  return html
}

exports.workFormHtml = workFormHtml

function workArchiveForm(id) {
  return actionForm(id, '/archive', 'Archive')
}

exports.workArchiveForm = workArchiveForm

function workDeleteForm(id) {
  return actionForm(id, '/delete', 'Delete')
}

exports.workDeleteForm = workDeleteForm
