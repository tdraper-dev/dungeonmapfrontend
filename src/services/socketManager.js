import io from 'socket.io-client'
let socket;
const server = `${window.location.protocol}//${window.location.host}/gameroom`

const initiateDMSocket = (boardId) => {

  console.log(`Dungeon Master connecting to socket...`, server);
  socket = io(server)
  console.log('DMsocket', socket)

  socket.emit('join', boardId)
  socket.on('user_joined', (data) => console.log(data) )
  socket.on('user_disconnect', (data) => console.log(data) )
}

const initiateGuestSocket = (boardId, history, callback) => {
  console.log('Guest connecting to socket...', server)
  socket = io(server)
  socket.emit('guest', boardId)

  socket.on('guestCheck', (check) => {
    if(check) {
      socket.emit('join', boardId)
      socket.on('user_joined', (data) => console.log(data) )
      socket.on('user_disconnect', (data) => console.log(data) )
      return callback()
    } else {
      console.log('no access!')
      socket.disconnect();
      return history.goBack()
    }
  })
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

const disconnectSocket = () => {
  if(socket) {
    console.log('Disconnecting socket...');
    socket.disconnect()
    console.log('THE SOCKET', socket)
  }
}



export default {
  initiateDMSocket,
  initiateGuestSocket,
  disconnectSocket,
  createIcon,
  addIcon,
  moveIcon,
  updateIcon,
  deleteIcon,
  clearIcon,
  changeMap,
  updateMap
}