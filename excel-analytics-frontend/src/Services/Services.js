import { toast } from 'react-toastify'
import { chart } from '../Config/Config.js'


export class Service {
  constructor() {
    this.api = chart
  }

  async uploadChart(formData) {
    
    
    try {
      const token = localStorage.getItem('token')

      const res = await this.api.post('/uploadChart', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (!res.data.success) {
        toast.error('Error uploading the chart')
      }

      return res.data.data
    } catch (error) {
        console.log(error)
      toast.error('Error while uploading chart')
    }
  }
  async analyzeChart(chartId) {
    try {
    const token = localStorage.getItem('token')
    
    const res = await this.api.get(`/analyzeChart/${chartId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    

    if (!res.data.success) {
        toast.error('Error while fetching the chart')
        return null
    }

        return res.data.data
    } catch (error) {
        toast.error('Server error while analyzing chart')
        return null
    }
 }

  async getSingleChart(chartId){
    try {
      const token = localStorage.getItem('token')

        const res = await this.api.get(`/getChartData/${chartId}`,{
          headers:{
            Authorization : `Bearer ${token}`
          }
        }
        )
        if(!res.data.success){
            toast.error("Cant find charts")
        }
        
        return res.data.data
        
    } catch (error) {
        console.log(error)
        toast.error("Error while getting the chart")
    }
  }

  async getChartData(chartId){
    try {
    const token = localStorage.getItem('token')
      const res = await this.api.get(`/chartData/${chartId}`,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      })

      if(!res.data.success){
        console.log("Error while fetching data")
      }
      console.log(res.data.data)

      return res.data.data
    } catch (error) {
      console.log(error)
    }
  }

  async downloads(chartId){
    try {
      const token = localStorage.getItem('token')
      const res = this.api.post('/downloads',{chartId},{
        headers:{
          Authorization : `Bearer ${token}`
        }
      })
      if(!res.data.success){
        console.log("error fetching data from backend")
        return false
      }
      return true
    } catch (error) {
      console.log(error)
    }
  }
}

const service = new Service()
export default service
