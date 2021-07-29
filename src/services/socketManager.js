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

const disconnectSocket = () => {
  console.log('Disconnecting socket...');
  socket.disconnect()
}



export default {
  initiateSocket,
  disconnectSocket
}