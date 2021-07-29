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

const moveIcon = (iconPosition, iconId) => {
  console.log('Icon position CHANGING...')
  socket.emit('move_icon', { iconPosition, iconId })
}

const updateIcon = (callback) => {
  //console.log('Icon position UPDATING...')
  socket.on('icon_updated', (data) => console.log(data, 'newPosition sent to server and back!'))
  //callback(iconPosition, iconId)
}

const disconnectSocket = () => {
  console.log('Disconnecting socket...');
  socket.disconnect()
}



export default {
  initiateSocket,
  disconnectSocket,
  moveIcon,
  updateIcon
}