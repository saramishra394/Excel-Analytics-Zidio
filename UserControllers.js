import { Chart } from "../Models/ChartModel.js";
import { User } from "../Models/UserModel.js";
import bcrypt from "bcryptjs";

const registerUser = async (req , res) =>{
    
    const {username , email , password } = req.body
    try {
        if(!username || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All the fields are required"
            })
        }
         const existingUser = await User.findOne({email})
            if(existingUser){
            return res.status(400).json({success: false, message:"Email already registered"})
        }

          const userCount = await User.countDocuments()
          const role = userCount === 0 ? 'admin' : 'user'

        const user = await User.create({
            username,
            email,
            password,
            role
        })

        const accessToken = user.generateAccessToken()

        return res.status(200).json({
            success:true,
            message:"User Registered Successfully",
            accessToken,

            data:{
                _id:user._id,
                username:user.username,
                email:user.email,
                
            }
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:"Something Went Wrong While Registration"
        })
    }
}

 const loginUser = async(req,res) =>{
    const {email , password} = req.body
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"All The Fields Are Required"
        })
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({
            success:false,
            message:"Cannot Find Email , Please Register"
        })
    }
    const isCorrectPassword = await bcrypt.compare(password,user.password)

    if(!isCorrectPassword){
        return res.status(400).json({
            success:false,
            message:"Password Is Incorrect , Please Enter Valid Password"
        })
    }
    const accessToken = user.generateAccessToken()

    return res.status(200).json({
        success:true,
        message:"Login Successfull",
        accessToken,
        data:{
            _id:user._id,
            username:user.username,
            email:user.email,
            role:user.role
            
        }
    })
 } 
 
 const updateAccountDetails = async(req,res) => {
    const {oldPassword , newPassword , confirmNewPassword} = req.body
    const {userId} = req.params
    if(userId !== req.user._id){
        return res.status(400).json({
            succes:false,
            message:"Not Authorized"
        })
    }
    const user = await User.findById(req.user._id)
    if(!user){
        return res.status(404).json({
            success:false,
            message:"Can't Find User"
        })
    }

    const isCorrectPassword = await bcrypt.compare(oldPassword , user.password)
    if(!isCorrectPassword){
        return res.status(400).json({
            message:false,
            message:"Password Is Incorrect"
        })
    }

    if(newPassword !== confirmNewPassword){
        return res.status(400).json({
            success:false,
            message:"Please Enter Same Password In Both Fields"
        })
    }

    user.password = newPassword
    await user.save()

    return res.status(200).json({
        success:true,
        message:"Password Changed Successfully"
    })

 }


 const logoutUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully"
  })
}

 const getCurrentUser = async (req , res) => {
    try {
        const userId = req.user?._id
        if(!userId){
            return res.status(400).json({
                success:false,
                message:"Please login"
            })
        }
        const user = await User.findById(userId).select('-password')
        if(!user){
             return res.status(400).json({
                success:false,
                message:"Cant find any user"
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
            message:"internal server error"
        })
    }
 }
 
 const userHistory = async (req , res) => {
    try {
        const {userId} = req.params

        if(!userId){
            return res.status(400).json({
                success : false,
                message : "Cant find history"
            })
        }

        const history = await Chart.find({user : userId})

        if(!history){
            return res.status(400).json({
                success : false ,
                messgae :" Dont have any history"
            })
        }
        

        return res.status(200).json({
            success : true ,
            message : "History fetched succesfully",
            data : history
         })

        

    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
 }


 const downloadCount = async (req, res) => {
  try {
    const userId = req.user?._id  
    const { chartId } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Please login",
      })
    }

    if (!chartId) {
      return res.status(400).json({
        success: false,
        message: "Please select a chart to download",
      })
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    const existingDownload = user.downloads.find(
      (entry) => entry.chartId.toString() === chartId
    )

    if (existingDownload) {
      existingDownload.count += 1
    } else {
    
      user.downloads.push({ chartId, count: 1 })
    }

    await user.save()

    return res.status(200).json({
      success: true,
      message: "Download count updated",
    })

  } catch (error) {
    console.error("Error in downloadCount:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}


    
 



 export {registerUser , loginUser , updateAccountDetails ,logoutUser , getCurrentUser, userHistory ,downloadCount}