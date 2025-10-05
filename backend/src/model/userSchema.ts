import {Schema ,model , Document } from "mongoose"

export interface IUser extends Document{
    fullName : string;
    email: string;
    password : string;
    // OTP fields are optional / nullable because not every user will have an OTP set
    otp?: string | null;
    otpExpire?: Date | null;
    createdAt?: Date;
}

const userSchema = new Schema<IUser>({
    fullName : {type : String , required : true, trim : true},
    email : {type : String , required : true, unique : true, trim : true, lowercase: true,},
    password : {type : String , required : true, minlength: 8, trim: true},
    otp : {type : String, default: null},
    otpExpire: {type : Date, default: null}
},{timestamps : true})

export const User = model<IUser>('User', userSchema)