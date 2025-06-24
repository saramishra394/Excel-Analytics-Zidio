import { toast } from "react-toastify"
import { user } from "../Config/Config.js"

export class AuthService {
  
  constructor() {
    this.api = user 
  }

  async register(data) {
    try {
      
      localStorage.removeItem('token')
      const res = await this.api.post('/register', data)
      if (!res.data.success) {
        console.log("Error while registering user")
        return null
      }
      const token = res.data.accessToken
      localStorage.setItem('token',token)
      
      return res.data.data
    } catch (error) {
      console.error("Register Error:", error?.response?.data || error.message)
    }
  }

  async login(data) {
    try {
      localStorage?.removeItem('token')  
      const res = await this.api.post('/login', data)
      if (!res.data.success) {
        console.log("Error while logging in user")
        return null
      }
      const token = res.data?.accessToken
      localStorage.setItem('token', token)
      return res.data.data
    } catch (error) {
      console.error("Login Error:", error?.response?.data || error.message)
    }
  }

  async logout() {
    try {
      const res = await this.api.post('/logout')
      if (!res.data.success) {
        console.log("Error while logging out")
        return false
      }
      localStorage.removeItem('token')
      return true
    } catch (error) {
      console.error("Logout Error:", error?.response?.data || error.message)
    }
  }

  async updateAccountDetails(userId, data) {
    try {
      const token = localStorage.getItem('token')
      const res = await this.api.post(`/update-account/${userId}`, data,{
        headers: {
             Authorization: `Bearer ${token}`
        }
      })
      if (!res.data.success) {
        console.log("Error while updating account")
        return null
      }
      return res.data.data
    } catch (error) {
      console.error("Update Account Error:", error?.response?.data || error.message)
    }
  }

  async getCurrentUser(){
    try {
      

      const token = localStorage.getItem('token')
      const res = await this.api.get('/currentUser',{
        headers: {
             Authorization: `Bearer ${token}`
        }
      })
      
      if(!res.data.success){
        console.log("Cant find user")
      }
      
      return res.data.data
    } catch (error) {
      console.log("error fetching data from backend")
      console.log(error)
    }
  }

  async userHistory(userId){
    try {      
      
      const token = localStorage.getItem('token')
      const res = await this.api.get(`/history/${userId}`,{
          headers: {
             Authorization: `Bearer ${token}`
        }
      })
      if(!res.data.success){
        console.log("Error while fetching history")
      }
      
      return res.data.data
    } catch (error) {
      console.log(error)
    }
  }

  async updatePassword(userId , data){
    try{
      const token = localStorage.getItem('token')
      const res = await this.api.post(`update-account/${userId}`,data,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      })
      if(!res.data.success){
        return false
      }
      return true
    }catch (error){
      console.log(error)
    }
  }
}

const auth = new AuthService()
export default auth
