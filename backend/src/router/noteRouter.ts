import  express  from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createNote, deleteNote } from "../controller/noteCotroller/noteController.js";

const router = express.Router();

router.post('/create', protect, createNote)
router.delete('/delete/:id', protect, deleteNote)
export default router