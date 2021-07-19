import axios from 'axios'
const baseUrl = '/api/gameboards'

let token = null

const setToken = (newToken) => {
  !newToken
    ? token = null
    : token = `bearer ${newToken}`
}

const getGameBoards = async (sourceToken) => {
  const config = {
    headers: { Authorization: token },
    cancelToken: sourceToken
  }

  const response = await axios.get(baseUrl, config)
  return response.data
}

const createGameBoard = async (newBoard) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newBoard, config)
  return response.data
}

const deleteGameBoard = async(id) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default {
  setToken, getGameBoards, createGameBoard, deleteGameBoard
}