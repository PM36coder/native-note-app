import {Schema ,model , Document} from 'mongoose'

interface INote extends Document{
    title: string;
    content:string;
    user: Schema.Types.ObjectId
}

const noteSchema = new Schema<INote>({
    title: {type:String, required:true, trim:true},
    content: {type:String, required:true,trim:true},
    user: {type: Schema.Types.ObjectId, ref:"User", required:true }
},{timestamps:true})

export const Note = model<INote>('Note', noteSchema)