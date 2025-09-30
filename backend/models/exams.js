import mongoose from "mongoose";

const examsSchema = new mongoose.Schema({
    subject : { type: String, required: true },
    type : { type: String, required: true },
    date : { type: String, required: true },
});

export default mongoose.model("exams", examsSchema);
