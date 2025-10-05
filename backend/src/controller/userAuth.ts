import {  User } from "../model/userSchema.js";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'


interface AuthRequest extends Request {
  user?: { userId: string };
}
const userRegister = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract data from request body
        const { fullName, email, password } = req.body as { fullName: string; email:string; password: string}

        // Validate input
        if (!fullName || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already registered" });
            return;
        }

        // Validate password length
        if (password.length < 8) {
            res.status(400).json({ message: "Password must be at least 8 characters" });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
       const user = await User.create({
            fullName,
            email,
            password: hashedPassword
       })


       //* create token
       const token = jwt.sign({userId : user._id, email: user.email,fullName:user.fullName}, process.env.JWT_SECRET as string, {expiresIn : '1h'})

        // Send success response
        res.status(201).json({
            message: "User registered successfully",
            user,
            token
        });
    } catch (error: any) {
        console.error("Registration error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const userLogin = async(req: Request, res: Response): Promise<void>=>{
    try {
        const {email, password} = req.body;

        //Validate Input 

        if(!email || !password){
            res.status(400).json({message:"All fields are required"})
            return
        }

        //! check user is in db
        const user = await User.findOne({email})
            if(!user){
                res.status(400).json({message: "User not found, please register"})
                return
            }
        const isMatchPassword = await bcrypt.compare(password, user!.password)
            if(!isMatchPassword){
                res.status(400).json({message: "Invalid credentials"})
                return
            }
            user.password = undefined as any
            //* create token
            const token = jwt.sign({userId: user._id, email: user.email,fullName:user.fullName}, process.env.JWT_SECRET as string, {expiresIn : '1h'})

             res.status(200).json({
                message: "Login successful",
                user,
                token
            })
    } catch (error:any) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


//!change password

const changePassword = async(req:AuthRequest, res:Response):Promise<void>=>{

    const userId = req.user?.userId
    const {currentPassword, newPassword} = req.body as{currentPassword:string,newPassword:string}

    try {
        
        if(!userId){
            res.status(401).json({message:"Unauthorized"})
            return
        }
        if(!currentPassword || !newPassword){
            res.status(400).json({message:'All fields are required'})
            return
        }

const user = await User.findById(userId).select('+password')

        if(!user){
            res.status(404).json({message:"User not found"})
            return
        }

        const isMatchPassword = await bcrypt.compare(currentPassword, user.password)
        if(!isMatchPassword){
            res.status(400).json({message:"Current password is incorrect"})
            return
        }

        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()

        res.status(200).json({message:"Password changed successfully"})

    } catch (error:any) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
}
export { userRegister ,userLogin,changePassword};