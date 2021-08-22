import axios from 'axios'
const baseUrl="/api/login"

const login = async (user) => {
  const response = await axios.post(baseUrl, user)
  console.log(response.headers)
  return response.data
}


export default { login }