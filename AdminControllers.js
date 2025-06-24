import { Chart } from "../Models/ChartModel.js";
import { User } from "../Models/UserModel.js";

const createUser = async (req , res) => {
    const {username , email , password , role} = req.body
    try {
    
    if (!username || !email || !password){
      return res.status(400).json({
        success:false,
        message:"All Fields Are Required"
      })
    }
    const existingUser = await User.findOne({email})
    if(existingUser){
      return res.status(400).json({
        success:false,
        message:"Email Already Registered"
      })
    }

    if(password.length<=5){
      return res.status(400).json({
        success:false,
        message:"Password Length Should Be Greater Than 5"
      })
    }
    const user = await User.create({
      username:username,
      email:email,
      password:password,
      role:role || 'user'
    })

    return res.status(201).json({
      success:true,
      message:"User Create Successfully",
      data:{
        _id:user._id,
        username:user.username,
        email:user.email,
        role:user.role
      }
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Server Error",
      error: error.message
    })
  }

  
}



const deleteUser = async (req , res) =>{
    
    const { userId } = req.params

    
    try {
        if(!userId){
            return res.status(400).json({
                success:false,
                message:"Please Select a User To Delete"
            })
        }

        
        await User.findByIdAndDelete(userId)
        return res.status(200).json({
            success:true,
            message:"User Deleted Successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success:false,
            message:"User Deletion Failed"
        })
    }
}
 
const getAllUser = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id 

    const users = await User.find({ _id: { $ne: loggedInUserId } });

    if (!users || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Users Found",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching all users",
    })
  }
}


 const getSingleUserHistory = async (req, res) => {
  try {
    console.log("get-user is called")
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      })
    }

    
    const user = await User.findById(userId).populate("downloads") 
    const downloadCount = user?.downloads?.length || 0

    
    const charts = await Chart.find({ user: userId })
      .select("title chartType createdAt user")
      .populate("user", "username") 
      .sort({ createdAt: -1 })

    if (!charts || charts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No charts found for this user"
      })
    }

    const totalCharts = charts.length
    const chartDetails = charts.map(chart => ({
      title: chart.title,
      chartType: chart.chartType,
      createdAt: chart.createdAt,
      username: chart.user.username
    }))

    return res.status(200).json({
      success: true,
      message: "User chart summary fetched successfully",
      data: {
        totalCharts,
        downloadCount,
        chartDetails
      }
    })
  } catch (error) {
    console.error("Error fetching user chart summary:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}



 const searchUser = async (req , res) => {
  try {
    const  search  = req.query.search || ""

    if(!search){
      return res.status(400).json({
        success:false,
        message:"Please enter something to search"
      })
    }
    
    const query = {
      $or:[
        {name : {$regex : search ,$options : "i"}},
        {email :{$regex :search ,$options : "i"}}
      ]
    }

    const user = await User.find(search ? query : {})

    if(user.length === 0){
      return res.status(400).json({
        success:false,
        message:"Dont have any user"
      })
    }

    return res.status(200).json({
      success:true,
      message:"User fetched successfully",
      data:user
    })

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Internal server error"
    })
  }
 }
 
export {createUser ,deleteUser , getAllUser ,searchUser ,getSingleUserHistory }