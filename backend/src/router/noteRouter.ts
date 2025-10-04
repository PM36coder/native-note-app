import  express  from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createNote, deleteNote, getAllNotes, getNoteById, updateNote } from "../controller/noteCotroller/noteController.js";

const router = express.Router();

router.post('/create', protect, createNote)
router.delete('/delete/:id', protect, deleteNote)
router.put('/update/:id', protect, updateNote)

//get all notes of a user
router.get('/all', protect,getAllNotes)
router.get('/get-note/:id',protect, getNoteById)
export default router