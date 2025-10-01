import express from "express";
import Exams from "../models/exams.js";

const router = express.Router();

// Simple admin-key middleware to protect write operations
const requireAdmin = (req, res, next) => {
    const adminKey = process.env.ADMIN_KEY;
    if (!adminKey) {
        return res.status(500).json({ message: "Server admin key not configured" });
    }
    const provided = req.header("x-admin-key");
    if (!provided || provided !== adminKey) {
        return res.status(403).json({ message: "Forbidden: invalid admin key" });
    }
    next();
};

router.get("/", async (req, res) =>{
    try{
        const exams = await Exams.find().sort({date: 1});
        res.json(exams);
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", requireAdmin, async (req, res) =>{
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
