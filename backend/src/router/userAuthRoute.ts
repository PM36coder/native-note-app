import express from 'express'
import { changePassword, userLogin, userRegister } from "../controller/userAuth.js";
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router()

router.post('/register', userRegister)
router.post('/login', userLogin),
router.put('/change-password', protect,changePassword )

export default router