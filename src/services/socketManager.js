import io from 'socket.io-client'
let socket;
const server = `${window.location.protocol}//${window.location.host}/gameroom`

const initiateSocket = (boardId) => {
  
  console.log(`Connecting socket...`);
  socket = io(server)

  socket.emit('join', boardId)
  socket.on('user_joined', (data) => console.log(data) )
  socket.on('user_disconnect', (data) => console.log(data) )
}

/*const iniateMaps = () => {
  console.log('Listening for map changes...')
} */

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
  }
}



export default {
  initiateSocket,
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