"use strict";

import * as events from 'events'
import * as net from 'net'

const MAX_LISTENERS = 10

const channel = new events.EventEmitter()
channel.clients = {}
channel.subscriptions = {}

channel.on('join',
  /** 
   * @param {string} id
   * @param {net.Socket} client 
   */
  function(id, client) {
    console.log('Joined: ' + id)
    this.clients[id] = client
    this.subscriptions[id] = function(senderId, message) {
      if (id != senderId) {
        this.clients[id].write(message)
      }
    }
    this.on('broadcast', this.subscriptions[id])
  }
)

channel.on('leave',
  /**
   * @param {string} id
   */
  function(id) {
    channel.removeListener('broadcast', this.subscriptions[id])
    channel.emit('broadcast', id, id + ' has left the chat.\n')
  }
)

channel.setMaxListeners(MAX_LISTENERS)

const server = net.createServer((client) => {
  const id = client.remoteAddress + ':' + client.remotePort
  console.log('Connected: ' + id)
  channel.emit('join', id, client)
  /*client.on('connect', () => {
    console.log('connect -> join')
    channel.emit('join', id, client)
  })*/
  client.on('data', (data) => {
    const _data = data.toString()
    console.log(id + ': ' + _data)
    channel.emit('broadcast', id, _data)
  })

  client.on('close', () => {
    console.log('Closed: ' + id)
    channel.emit('leave', id)
  })
})

server.listen(8888)
