import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import examRoutes from './routes/examsRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/exams",examRoutes);

mongoose.connect(process.env.MONGO_URI).then( ()=> console.log("MongoDB Connected")).catch( err=> console.log(err));

app.get('/',(req,res)=>{
    res.send("Backend running");
});

const PORT = process.env.PORT;
app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));
