import axios from 'axios'
const baseUrl = '/api/images'


/*const retrieveMapImages = async () => {
  const response = await axios.get(baseUrl) || 0;
  if (response) {
  let buffer = Buffer.from(response.data.img.data)
  let arraybuffer = Uint8Array.from(buffer).buffer;
  let imageBlob = new Blob([arraybuffer])
  return imageBlob
  } else {
    return null
  }

}*/

const retrieveMapImage = async (boardId, sourceToken) => {
  const config = {
    cancelToken: sourceToken
  }
  const response = await axios.get(`${baseUrl}/${boardId}`)
  console.log('RESPONSE', response.data)

  return response.data.image.data
}

const saveMapImage = async (file, boardId) => {
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  }
  const formData = new FormData();
  formData.append('myImage', file)
  formData.append('boardId', boardId)
  
  const response = await axios.post(baseUrl, formData, config)
  return response.data.img.data
}

export default {
  saveMapImage, retrieveMapImage
}