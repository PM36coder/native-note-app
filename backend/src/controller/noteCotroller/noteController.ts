import { Request, Response } from "express";
import { Note } from "../../model/notesSchema.js";

interface AuthRequest extends Request {
  user?: { userId: string };
}
const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body as { title: string; content: string };
    const user = req.user?.userId;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const existingNote = await Note.findOne({ title, content });

    if (existingNote) {
      res.status(400).json({ message: "Note already exists" });
      return;
    }
    const newNote = await Note.create({ title, content, user });

    res.status(201).json({ message: "Note created successfully", newNote });
  } catch (error: any) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

//! update note
const updateNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const noteId = req.params.id;
    const { title, content } = req.body as { title: string; content: string };
    const user = req.user?.userId;

    if (!title || !content) {
      res.status(400).json({ message: "Title and content are required" });
      return;
    }

    const note = await Note.findById(noteId);
    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    if (note.user.toString() !== user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, user: user },
      { title, content },
      { new: true }
    );

    if (!updatedNote) {
      res.status(404).json({ message: "Note not found or user mismatch" });
      return;
    }

    res.status(200).json({ message: "Note updated successfully", updatedNote });
  } catch (error: any) {
    console.error("error updating note : ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//?delete note

const deleteNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const noteId = req.params.id;
    const user = req.user?.userId;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

// get all notes for a user
const getAllNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user?.userId;
  try {
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const notes = await Note.find({ user: user }).sort({ createNotedAt: -1 });

    if (notes.length === 0) {
      res.status(200).json({ message: "No notes created yet", notes: [] });
      return;
    }

    res.status(200).json({ message: "Notes fetched successfully", notes });
  } catch (error: any) {
    console.error("error getting in notes fetching : ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//! get single note of a user
const getNoteById = async (req: AuthRequest, res: Response): Promise<void> => {
  
    const userId = req.user?.userId;
    const noteId = req.params.id;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized: Please login." });
        return;
    }

    try {
        const note = await Note.findById(noteId);

        
        if (!note) {
            res.status(404).json({ message: "Note not found." });
            return;
        }

        // 3. CORRECTION: Ownership check aur return
        if (note.user.toString() !== userId) {
           
            res.status(401).json({ message: "Unauthorized: You don't own this note." });
            return;
        }

        
        res.status(200).json({ message: "Note fetched successfully", note });

    } catch (error: any) {
        
        if (error.name === 'CastError') {
             res.status(400).json({ message: "Invalid Note ID format." });
             return;
        }
        
        console.error("error getting note: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { createNote, deleteNote, updateNote, getAllNotes,getNoteById };
