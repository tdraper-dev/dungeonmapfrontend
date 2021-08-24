import axios from 'axios'
import { default64 } from '../images/default64.js'
const baseUrl = '/api/gameboards'

let token = null

let defaultImage;
fetch(default64)
.then((res) => res.blob())
.then((blob) => {
  console.log(blob);
  defaultImage=blob
});


const setToken = (newToken) => {
  !newToken
    ? token = null
    : token = `bearer ${newToken}`
}

const retrieveToken = () => {
  return token;
}

const getGameBoards = async (sourceToken = null) => {
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
  formData.append('myImage', newBoard.mapImage || defaultImage)
  formData.append('title', newBoard.name)

  const response = await axios.post(baseUrl, formData, config)
  return response.data
}

const updateGameBoardImage = async(file, boardId) => {
  const formData = new FormData();
  formData.append('myImage', file)

  const response = await axios.put(`${baseUrl}/${boardId}`, formData)
  return response.data
}

const deleteGameBoard = async(id) => {
  console.log('id', id)
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default {
  setToken, 
  getGameBoards, 
  getGameBoard, 
  createGameBoard, 
  updateGameBoardImage,
  deleteGameBoard, 
  retrieveToken
}