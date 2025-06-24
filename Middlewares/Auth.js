import jwt from 'jsonwebtoken'
import { User } from '../Models/UserModel.js'

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]
    
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      const user = await User.findById(decoded._id).select('-password')
      if (!user) {
        return res.status(401).json({ message: "User not found" })
      }

      req.user = user
      next()
    } catch (err) {
      console.error("JWT error:", err.message)
      return res.status(401).json({ message: "Invalid token" })
    }
  } else {
    return res.status(401).json({ message: "No token provided" })
  }
}

const checkAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(400).json({
      success: false,
      message: "forbidden You are not admin"
    })
  }
  next()
}

export { protect, checkAdmin }
