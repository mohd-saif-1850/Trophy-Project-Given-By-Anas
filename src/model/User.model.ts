import mongoose, { Schema, Document } from "mongoose";


export interface User extends Document {
    name : string,
    mobileNumber : number,
    email : string,
    password : string,
    verified : boolean,
    otp : number,
    otpExpiry : Date,
    cart : []
}

const UserSchema : Schema <User> = new Schema({
    name : {
        type : String,
        required : true
    },
    mobileNumber : {
        type : Number,
        required : true,
        unique : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    password : {
        type : String
    },
    verified : {
        type : Boolean,
        default : false
    },
    otp : {
        type : Number
    },
    otpExpiry : {
        type : Date
    },
    cart : {
        type : []
    }
},{ timestamps : true })

export const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema))