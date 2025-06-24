import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
     downloads: [
        {
            chartId: { type: mongoose.Schema.Types.ObjectId, ref: "Chart" },
            count: { type: Number, default: 1 },
        }]
},{timestamps:true})

userSchema.pre("save",async function (next){
    if(this.isModified("password")){
    this.password=await bcrypt.hash(this.password,10)}
    else
    next()
})
userSchema.methods.generateAccessToken = function() {
    const accessToken = jwt.sign({
        _id: this._id, 
        email: this.email,
        username: this.username,
        role:this.role || 'user'
        
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
       expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    );
    
    return accessToken
};


export const User = mongoose.model("User",userSchema)