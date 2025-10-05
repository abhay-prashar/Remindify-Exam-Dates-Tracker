
import express from "express";
import Exams from "../models/exams.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();



router.get("/", async (req, res) =>{
    try{
        const exams = await Exams.find().sort({date: 1});
        res.json(exams);
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit an existing exam (admin only)
// Create new exam (admin only)
router.post("/", adminAuth, async (req, res) => {
    const { subject, type, date } = req.body;
    try {
        const newExam = new Exams({ subject, type, date });
        await newExam.save();
        res.status(201).json(newExam);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Edit an existing exam (admin only)
router.put("/:id", adminAuth, async (req, res) => {
    const { subject, type, date } = req.body;
    try {
        const updated = await Exams.findByIdAndUpdate(
            req.params.id,
            { subject, type, date },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Exam not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete an exam (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
    try {
        const deleted = await Exams.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Exam not found" });
        res.json({ message: "Exam deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export default router;
