import mongoose, { Schema } from "mongoose"

const insightSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    insights:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Insights = mongoose.model("Insights", insightSchema)