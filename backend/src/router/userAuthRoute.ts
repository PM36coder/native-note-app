import express from 'express'
import { userLogin, userRegister } from "../controller/userAuth.js";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router()

router.post('/register', userRegister)
router.post('/login', userLogin)
router.get('/me', protect,(req,res)=>{ res.json({message:"User pro route"})})
export default router