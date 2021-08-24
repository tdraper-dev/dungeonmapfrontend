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




function readFile(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()

    reader.addEventListener("loadend", e => resolve(e.target.result))
    reader.addEventListener("error", reject)

    reader.readAsArrayBuffer(file)
  })
}

const getAsByteArray = async(file) => {
  return new Uint8Array(await readFile(file))
}


export default {
  convertBuffertoBlob,
  getAsByteArray
}