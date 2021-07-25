import axios from 'axios'
const baseUrl = '/api/icons'

const getIcons = async(boardId) => {
  const response = await axios.get(`${baseUrl}/${boardId}`)
  console.log('ICONS ', response.data)
  return response.data
}

const createIcon = async(iconInfo) => {
  const response = await axios.post(baseUrl, iconInfo)
  console.log('NEW ICON ', response.data)
  return response.data
}

export default {
  getIcons,
  createIcon
}