import axios from 'axios'
const baseUrl = '/api/gameboards'

let token = null

const setToken = (newToken) => {
  !newToken
    ? token = null
    : token = `bearer ${newToken}`
}

const retrieveToken = () => {
  return token;
}

const getGameBoards = async (sourceToken) => {
  const config = {
    headers: { Authorization: token },
    cancelToken: sourceToken
  }

  const response = await axios.get(baseUrl, config)
  return response.data
}

const getGameBoard = async (boardId, sourceToken) => {
  const config = {
    cancelToken: sourceToken
  }
  const response = await axios.get(`${baseUrl}/${boardId}`, config)
  return response.data
}

const createGameBoard = async (newBoard) => {
  const config = {
    headers: {
      Authorization: token,
      'Content-type': 'multipart/form-data'
    }
  }

  const formData = new FormData();
  formData.append('myImage', newBoard.mapImage)
  formData.append('title', newBoard.name)

  const response = await axios.post(baseUrl, formData, config)
  return response.data
}

//const updateGameBoardImage = async()

const deleteGameBoard = async(id) => {
  console.log('id', id)
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default {
  setToken, getGameBoards, getGameBoard, createGameBoard, deleteGameBoard, retrieveToken
}