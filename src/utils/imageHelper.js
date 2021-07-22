import axios from 'axios'

function blobReaderPromise (buffer) {
  let arraybuffer = Uint8Array.from(buffer).buffer;
  let imageBlob = new Blob([arraybuffer])

  return new Promise(function(resolve, reject) {
    let reader = new FileReader()
    reader.readAsDataURL(imageBlob)
    reader.onload = function() {
      resolve(this.result)
    }
  })
}
const convertBuffertoBlob = (buffer) => {
  const base64 = blobReaderPromise(buffer)
    .then(response => response )
  return base64
}


export default {
  convertBuffertoBlob
}