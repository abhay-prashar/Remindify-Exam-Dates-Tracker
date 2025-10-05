import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";



import examRoutes from './routes/examsRoutes.js';
import examRequestRoutes from './routes/examRequestRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/exams", examRoutes);
app.use("/api/exam-requests", examRequestRoutes);
app.use("/api/admin", adminRoutes);

mongoose.connect(process.env.MONGO_URI).then( ()=> console.log("MongoDB Connected")).catch( err=> console.log(err));

app.get('/',(req,res)=>{
    res.send("Backend running");
});

console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD);

const PORT = process.env.PORT;
app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));
