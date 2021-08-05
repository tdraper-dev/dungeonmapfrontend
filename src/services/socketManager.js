import io from 'socket.io-client'

let socket;
//${window.location.protocol}//${window.location.host}
const initiateDMSocket = (boardId) => {

  console.log(`Dungeon Master connecting to socket...`);
  socket = io()
  console.log('DMsocket', socket)

  socket.emit('join', {boardId, username: "DungeonMaster"})
  socket.on('user_joined')
  socket.on('user_disconnect')
}

const initiateGuestSocket = (boardId, history, username, callback) => {

  console.log('Guest connecting to socket...')
  socket = io()
  socket.emit('guest', boardId)

  socket.on('guestCheck', (check) => {
    if(check) {
      console.log('guestRegistration')
      socket.emit('join', { boardId, username })
      //socket.on('user_joined')
      //socket.on('user_disconnect')
      socket.on('dm_disconnect', () => {
        console.log('The guests have received notice from the Server, the DM is gone')
        socket.emit('guest_exit')
        return history.goBack()
      })
      return callback()
    } else {
      console.log('no access!')
      socket.disconnect();
      return history.goBack()
    }
  })
}

const userEntryExit = (callback) => {
  if(socket) {
    socket.on('user_joined', (data) => {
      callback(data)
    })
    socket.on('user_disconnect', (data) => {
      callback(data)
    })
  }
}


const createIcon = (newIcon) => {

  if(socket) {
    console.log('you want to create this icon', newIcon)
    socket.emit('create_icon', newIcon)
  }
}

const addIcon = (callback) => {

  if(socket){
      socket.on('add_icon', (iconObj) => {
      console.log('Creating this icon', iconObj)
      return callback(iconObj)
    })
  }
}

const moveIcon = (iconPosition, iconId) => {

  if(socket) {
    console.log('You want to move this icon', iconId)
    socket.emit('move_icon', { iconPosition, iconId })
  }
}

const updateIcon = (callback) => {

  if(socket) {
    socket.on('icon_updated', ({ iconPosition, iconId }) => {
      console.log('Moving this icon', iconId)
      return callback(iconPosition, iconId)
    })
  }
}

const deleteIcon = (id) => {

  if(socket) {
    console.log('You want to delete this icon', id)
    socket.emit('delete_icon', id)
  }
}

const clearIcon = (callback) => {

  if(socket) {
    socket.on('clear_icon', (id) => {
      console.log('Removing this icon: ', id)
      callback(id)
    })
  }
}

const changeMap = () => {

  if(socket) {
    console.log('You want to change the map image')
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
    console.log('You want to send a message')
    socket.emit('send_message', message)
  }
}

const receiveMessage = (callback) => {
  if(socket) {
    socket.on('receive_message', (data) => {
      console.log('receiving new message!')
      return callback(data)
    })
  }
}

const dmDisconnecting = () => {
  if(socket) {
    console.log('The DM is sending "dm_disconnecting" to the Server')
    socket.emit('dm_disconnecting')
    socket.on('guests_removed', () => {
      socket.disconnect()
    })
  }
}

const disconnectSocket = () => {
  if(socket) {
    console.log('Disconnecting socket...');
    socket.disconnect()
    socket = null;
    console.log('THE SOCKET', socket)
  }
}



export default {
  initiateDMSocket,
  initiateGuestSocket,
  userEntryExit,
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