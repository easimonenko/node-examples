'use strict';

function divEscapedContentElement(message) {
  return $('<div></div>').text(message)
}

function divSystemContentElement(message) {
  return $('<div></div>').html('<i>' + message + '</i>')
}

/**
 * 
 * @param {Chat} chatApp 
 * @param {*} socket 
 */
function processUserInput(chatApp, socket) {
  /** @type {string} message */
  const message = $('#send-message').val()
  var systemMessage = ''
  if (message.charAt(0) == '/') {
    systemMessage = chatApp.processCommand(message)
    if (systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage))
    }
  }
  else {
    chatApp.sendMessage($('#room').text(), message)
    $('#messages').append(divEscapedContentElement(message))
    $('#messages').scrollTop($('#messages').prop('scrollHeight'))
  }
  $('#send-message').val('')
}

const socket = io.connect()

$(document).ready(() => {
  const chatApp = new Chat(socket)

  socket.on('nameResult', (result) => {
    const message = result.success
      ? 'You are now known as ' + result.name + '.'
      : result.message
    $('#messages').append(divSystemContentElement(message))
  })

  socket.on('joinResult', (result) => {
    $('#room').text(result.room)
    $('#messages').append(divSystemContentElement('Room changed.'))
  })

  socket.on('message', (message) => {
    const newElement = $('<div></div>').text(message.text)
    $('#messages').append(newElement)
  })

  socket.on('rooms', (rooms) => {
    $('#room-list').empty
    for (const room in rooms) {
      const _room = room.substring(1, room.length)
      if (_room != '') {
        $('#room-list').append(divEscapedContentElement(_room))
      }
    }

    $('#room-list div').click(() => {
      chatApp.processCommand('/join ' + $(this).text())
      $('#send-message').focus()
    })
  })

  setInterval(() => {
    socket.emit('rooms')
  }, 1000)

  $('#send-message').focus()

  $('#send-form').submit(() => {
    processUserInput(chatApp, socket)

    return false
  })
})
