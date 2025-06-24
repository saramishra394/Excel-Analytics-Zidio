import { aiSupport } from "../Config/Config";

export class Support{
    constructor(){
        this.api=aiSupport
    }

    async insights(chartTitle , data){
        try {
            const token = localStorage.getItem('token')
            const res = await this.api.post('/insights',{chartTitle , data},{
                headers :{
                    Authorization : `Bearer ${token}`
                }
            })

            if(!res.data.success){
                console.log("Error whilt fetching data")
            }

            return res.data.data
        } catch (error) {
            console.log(error)
        }
    }
}

const aiInsights = new Support()
export default aiInsights