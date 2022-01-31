'use strict';

const http = require('http')
const querystring = require('querystring')
const redis = require('redis')
const uuid = require('uuid')

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
async function parseReceivedData(req, cb) {
  let body = ''
  req.setEncoding('utf8')
  req.on('data', (chunk) => {
    body += chunk
  })
  req.on('end', () => {
    const data = querystring.parse(body)
    console.log(data)
    cb(data)
  })
}

exports.parseReceivedData = parseReceivedData

function actionForm(id, path, label) {
  const html =
    '<form method="POST" action="' + path + '">' +
    '<input type="hidden" name="id" value="' + id + '"/>' +
    '<input type="submit" value="' + label + '"/>' +
    '</form>'

  return html
}

exports.actionForm = actionForm

/**
 * @param {redis.RedisClient} db
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
async function add(db, req, res) {
  await parseReceivedData(req, async (work) => {
    const workUuid = uuid.v1()
    if (work.archived === undefined) {
      work.archived = 0
    }
    await db.HSET(workUuid, work)
    await db.LPUSH('work:ids', workUuid)
    await show(db, res)
  })
}

exports.add = add

/**
 * @param {redis.RedisClient} db
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
async function deleteWork(db, req, res) {
  parseReceivedData(req, async (work) => {
    await db.del(work.id)
    await show(db, res)
  })
}

exports.deleteWork = deleteWork

/**
 * @param {redis.RedisClient} db
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
async function archive(db, req, res) {
  parseReceivedData(req, async (work) => {
    const oneWork = await db.HGETALL(work.id)
    await db.del(work.id)
    oneWork.archived = 1
    await db.HSET(work.id, oneWork)
    await show(db, res)
  })
}

exports.archive = archive

/**
 * @param {redis.RedisClient} db
 * @param {http.ServerResponse} res
 * @param {boolean} showArchived
 */
async function show(db, res, showArchived) {
  const archiveValue = (showArchived) ? 1 : 0

  const items = await db.LRANGE('work:ids', 0, -1)

    const work = []

    if (items.length == 0) {
      console.log('Empty list.')
    }

    let counter = 0;

    items.forEach(async (item, i) => {
      console.log(i + ": " + item + "\n")
      const oneWork = await db.HGETALL(item)
      counter += 1
      if (oneWork && oneWork.archived == archiveValue) {
        oneWork.id = item
        work.push(oneWork)
      }
    })

    setTimeout(function repeat() {
      if (counter == items.length) {
        let html = '<meta charset="utf-8"/>\n' +
          ((showArchived) ?
          '' :
          '<a href="/archived">Archived Work</a><br/>')
        html += workHitListHtml(work)
        html += workFormHtml()
        sendHtml(res, html)
      } else {
        setTimeout(repeat, 0)
      }
    }, 0)
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
    '<form method="POST" action="/">' +
    '<p>Date (YYYY-MM-DD):<br/><input name="date" type="text"></p>' +
    '<p>Hours worked:<br/><input name="hours" type="text"></p>' +
    '<p>Description:</br>' +
    '<textarea name="description"></textarea>' +
    '</p>' +
    '<input type="submit" value="Add" />' +
    '</form>'

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
