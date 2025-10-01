import {Schema ,model , Document } from "mongoose"

export interface IUser extends Document{
    fullName : string;
    email: string;
    password : string
    createdAt : Date;
}

const userSchema = new Schema<IUser>({
    fullName : {type : String , required : true, trim : true},
    email : {type : String , required : true, unique : true, trim : true, lowercase: true,},
    password : {type : String , required : true, minlength: 8, trim: true}
},{timestamps : true})

export const User = model<IUser>('User', userSchema)