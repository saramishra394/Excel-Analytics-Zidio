import { admin } from "../Config/Config.js"




export class Admin {
  constructor() {
    this.api = admin
  }

 
  async createUser(data) {
    try {
      const token = localStorage.getItem('token')
      const res = await this.api.post("/create-user", data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.data.success) {
        return false
      }

      return true
    } catch (error) {
      console.error("Error creating user:", error)
      return null
    }
  }

  
  async deleteUser(userId) {
    try {
      const token = localStorage.getItem('token')
      const res = await this.api.delete("/delete-user",userId, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.data.success) {
        console.error("User deletion failed:", res.data.message)
        return null
      }

      return res.data.message
    } catch (error) {
      console.error("Error deleting user:", error)
      return null
    }
  }

  
  async getAllUsers() {
    try {
      const token = localStorage.getItem('token')
      const res = await this.api.get("/get-allUser", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.data.success) {
        console.error("Fetching users failed:", res.data.message)
        return []
      }

      return res.data.data
    } catch (error) {
      console.error("Error fetching all users:", error)
      return []
    }
  }

  async getSingleUser(userId){
    try {
      const token = localStorage.getItem('token')
      const res = await this.api.get(`/get-user/${userId}`,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      })
      
      console.log(res)
      if(!res.data.success){
        console.log('Error while fetching user')
        return false
      }

      return res.data.data

    } catch (error) {
      console.log(error)
    }
  }
}

const adminService = new Admin()
export default adminService
