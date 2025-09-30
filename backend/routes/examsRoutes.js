import express from "express";
import Exams from "../models/exams.js";

const router = express.Router();

router.get("/", async (req, res) =>{
    try{
        const exams = await Exams.find().sort({date: 1});
        res.json(exams);
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) =>{
    const { subject, type, date } = req.body;

    try{
        const newExam = new Exams({ subject, type, date });
        await newExam.save();
        res.status(201).json(newExam);
    }catch (err){
        res.status(500).json({message: err.message});
    }
});

export default router;
