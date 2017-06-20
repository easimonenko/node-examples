'use strict';

import * as http from 'http'
import * as mongodb from 'mongodb'
import * as querystring from 'querystring'

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
 * @param {} db 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function add(db, req, res) {
  parseReceivedData(req, (work) => {
    console.log(work)
    const collection = db.collection('work')
    collection.insert(work, (err, result) => {
        if (err) {
          throw err
        }
        console.log(result)
        show(db, res)
      }
    )
  })
}

exports.add = add

/**
 * @param {} db 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function deleteWork(db, req, res) {
  parseReceivedData(req, (work) => {
    const collection = db.collection('work')
    collection.deleteOne(
      {'_id': new mongodb.ObjectID(work.id)},
      (err, result) => {
        if (err) {
          throw err
        }
        console.log(result.result)
        show(db, res)
      }
    )
  })
}

exports.deleteWork = deleteWork

/**
 * @param {} db 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function archive(db, req, res) {
  parseReceivedData(req, (work) => {
    const collection = db.collection('work')
    collection.updateOne(
      {'_id': new mongodb.ObjectID(work.id)},
      {$set: {'archived': 1}},
      (err, result) => {
        if (err) {
          throw err
        }
        console.log(result.result)
        show(db, res)
      }
    )
  })
}

exports.archive = archive

/**
 * @param {} db 
 * @param {http.ServerResponse} res 
 * @param {boolean} showArchived 
 */
function show(db, res, showArchived) {
  const archiveValue = (showArchived) ? 1 : 0
  const collection = db.collection('work')
  const query = archiveValue == 1 ? {'archived': 1} : {$or: [{'archived': 0}, {'archived': null}]}
  collection.find(query).toArray((err, docs) => {
    if (err) {
      throw err
    }

    var html =
      (showArchived)
      ? ''
      : '<a href="/archived">Archived Work</a><br/>'
    html += workHitListHtml(docs)
    html += workFormHtml()
    sendHtml(res, html)
  })
}

exports.show = show

/**
 * @param {} db 
 * @param {http.ServerResponse} res 
 */
function showArchived(db, res) {
  show(db, res, true)
}

exports.showArchived = showArchived

function workHitListHtml(rows) {
  var html = '<table>'
  for (var i in rows) {
    html += '<tr>'
    html += '<td>' + rows[i].date + '</td>'
    html += '<td>' + rows[i].hours + '</td>'
    html += '<td>' + rows[i].description + '</td>'

    if (!rows[i].archived) {
      html += '<td>' + workArchiveForm(rows[i]._id) + '</td>'
    }

    html += '<td>' + workDeleteForm(rows[i]._id) + '</td>'
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
