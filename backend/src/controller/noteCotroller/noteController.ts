import { Request,Response } from "express";
import { Note } from "../../model/notesSchema.js";

interface AuthRequest extends Request {
  user?: { userId: string };
}
 const createNote = async (req: AuthRequest, res: Response) => {
    try {
        const { title, content } = req.body;
        const user = req.user?.userId;

        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return
        }

        const existingNote = await Note.findOne({ title, content})

        if(existingNote){
            res.status(400).json({message:"Note already exists"})
            return
        }
        const newNote = await Note.create({ title, content, user });
       

        res.status(201).json({ message: "Note created successfully",  newNote });
    } catch (error:any) {
        console.error("Error creating note:", error);
        res.status(500).json({ message: "Internal server error" });
        return
    }
};


//?delete note

const deleteNote = async (req: AuthRequest, res: Response):Promise<void>=>{

    try {
        const noteId = req.params.id;
        const user = req.user?.userId

        if(!user){
            res.status(401).json({message:"Unauthorized"})
            return
        }


        const note = await Note.findByIdAndDelete(noteId)
        
        if(!note){
            res.status(404).json({message:"Note not found"})
            return
        }
        res.status(200).json({message:"Note deleted successfully"})
    } catch (error:any) {
        console.error("Error deleting note:", error);
        res.status(500).json({ message: "Internal server error" });
       return
    }
}

export { createNote,deleteNote}