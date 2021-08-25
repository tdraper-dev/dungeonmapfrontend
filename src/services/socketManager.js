import io from 'socket.io-client'

let socket;
let verified = false;

//${window.location.protocol}//${window.location.host}
const initiateDMSocket = (boardId) => {

  console.log(`Dungeon Master connecting to socket...`);
  socket = io()

  socket.emit('join', {boardId, username: "DungeonMaster"})
  socket.on('user_joined')
  socket.on('user_disconnect')
}

const guestQuickCheck = (boardId, notify, username, callback) => {

  socket = io()

  socket.emit('guestQuick', boardId)

  socket.on('guestCheckQuick', (check) => {
    if(check) {
      verified = true;
      callback(boardId)
      socket.emit('join', { boardId, username })
      sessionStorage.setItem('guestUserName', username)
    } else {
      disconnectSocket();
      notify.notify({
        notification: 'Session not live or ID incorrect',
        errorType: 'guestJoin'
      })
    } 
  })
}

const initiateGuestSocket = (boardId, history, callback, naming=null) => {
  if(!socket) {
    socket = io()

    socket.emit('guest', boardId)
    
    socket.on('guestCheck', (check) => {
      if(!check) {
        disconnectSocket()
        return history.goBack()
      } else {
        callback()
        const username = sessionStorage.getItem('guestUserName') || naming()
        sessionStorage.setItem('guestUserName', username)
        socket.emit('join', { boardId, username })
      }
    })
  }
      
      socket.on('dm_disconnect', () => {
        disconnectSocket()
        return history.goBack()
      })

      if(verified) {
        return callback()
      }
}

const createIcon = (newIcon) => {

  if(socket) {
    socket.emit('create_icon', newIcon)
  }
}

const addIcon = (callback) => {

  if(socket){
      socket.on('add_icon', (iconObj) => {
      return callback(iconObj)
    })
  }
}

const moveIcon = (iconPosition, iconId) => {

  if(socket) {

    socket.emit('move_icon', { iconPosition, iconId })
  }
}

const updateIcon = (callback) => {

  if(socket) {
    socket.on('icon_updated', ({ iconPosition, iconId }) => {

      return callback(iconPosition, iconId)
    })
  }
}

const deleteIcon = (id) => {

  if(socket) {

    socket.emit('delete_icon', id)
  }
}

const clearIcon = (callback) => {

  if(socket) {
    socket.on('clear_icon', (id) => {

      callback(id)
    })
  }
}

const changeMap = () => {

  if(socket) {

    socket.emit('change_map')
  }
}

const updateMap = (callback) => {
  if(socket) {
    socket.on('update_map', () => callback())
  }
}


const sendMessage = (message) => {
  if(socket) {

    socket.emit('send_message', message)
  }
}

const receiveMessage = (callback) => {
  if(socket) {
    socket.on('receive_message', (data) => {

      return callback(data)
    })
  }
}

const dmDisconnecting = () => {
  if(socket) {

    socket.emit('dm_disconnecting')
  }
}

const disconnectSocket = () => {
  if(socket) {
    socket.disconnect()
    socket = null;
  }
}



export default {
  initiateDMSocket,
  initiateGuestSocket,
  guestQuickCheck,
  disconnectSocket,
  dmDisconnecting,
  createIcon,
  addIcon,
  moveIcon,
  updateIcon,
  deleteIcon,
  clearIcon,
  changeMap,
  updateMap,
  sendMessage,
  receiveMessage
}