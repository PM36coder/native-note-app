import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ConnectDb from './config/db.js';
import userAuthRouter from './router/userAuthRoute.js'
import noteRouter from './router/noteRouter.js'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// app.get('/', (req, res) => {
//   res.json({ message: "Welcome to the Note app" });
// });
app.use('/api/user', userAuthRouter)
app.use('/api/user', noteRouter)
ConnectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });