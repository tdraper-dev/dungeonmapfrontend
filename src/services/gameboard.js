import axios from 'axios'
const baseUrl = '/api/gameboards'

let token = null

const setToken = (newToken) => {
  console.log('TOKEN CHECK', token)
  !newToken
    ? token = null
    : token = `bearer ${newToken}`
}

export default {
  setToken
}