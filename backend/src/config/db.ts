import mongoose from "mongoose";
import dotenv from "dotenv"


dotenv.config()
const ConnectDb = async () => {
    try {
        // read the MONGO_URI env var (fix typo: MonMONGO_URI -> MONGO_URI)
        const uri = process.env.MONGO_URI as string | undefined
        if (!uri) {
            console.error('MONGO_URI is not defined in environment')
            process.exit(1)
        }
        await mongoose.connect(uri)
        console.log("✅ Database Connected Successfully")
    } catch (error) {
        console.error("❌ Database connection failed", error)
        process.exit(1)
    }
}

export default ConnectDb