import express from 'express'
import { userRegister } from "../controller/userAuth.js";

const router = express.Router()

router.post('/register', userRegister)

export default router