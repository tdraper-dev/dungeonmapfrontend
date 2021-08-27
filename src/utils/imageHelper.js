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

const thumbnailPreviewBuilder = async(file = {blank: 'blank'}) => {
  const regTest = /image\/(png|jpeg)/
  
  try {
    if(regTest.test(file.type)) {
      
      const fileBuffer = await getAsByteArray(file)
      const newImage = await convertBuffertoBlob(fileBuffer)
      return newImage
    } else {
      throw new Error()
    }
  } catch(error) {
    throw {
      error: new Error(),
      notification: 'Image file types accepted are .png or .jpeg',
      errorType: 'mapImage',
    }
  }
}

function b64toBlob(dataURI, type) {
  return new Blob([Buffer.from(dataURI.split(',')[1], 'base64')], { 
    type: type 
   });
 }


export default {
  convertBuffertoBlob,
  getAsByteArray,
  thumbnailPreviewBuilder,
  b64toBlob
}