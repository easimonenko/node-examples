'use strict';

function Chat(socket) {
  /** @member */
  this.socket = socket
}

Chat.prototype.sendMessage = function (room, text) {
  const message = {
    room: room,
    text: text
  }
  this.socket.emit('message', message)
}

Chat.prototype.changeRoom = function (room) {
  this.socket.emit('join', {
    newRoom: room
  })
}

Chat.prototype.processCommand = function (_command) {
  /** @type {Array<string>} words */
  const words = _command.split(' ')
  const command = words[0].substring(1, words[0].length).toLowerCase()
  let message = ''
  switch(command) {
    case 'join':
      words.shift()
      const room = words.join(' ')
      this.changeRoom(room)
      break
    case 'nick':
      words.shift()
      const name = words.join(' ')
      this.socket.emit('nameAttempt', name)
      break
    default:
      message = 'Unrecognized command.'
      break
  }

  return message
}
