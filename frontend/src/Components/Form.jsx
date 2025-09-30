import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Form() {
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("End Term Exam");
  const [otherType, setOtherType] = useState("");
  const [sessional, setSessional] = useState("");
  const [faAttempt, setFaAttempt] = useState("");
  const [evaluationPhase, setEvaluationPhase] = useState("");
  const [date, setDate] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Determine the final type to send based on selections
    let finalType = type;
    if (type === "Other") {
      finalType = otherType.trim();
    } else if (type === "Sessional Test") {
      if (!sessional) {
        // Guard against empty sessional selection
        alert("Please select ST 1, 2, or 3.");
        return;
      }
      finalType = `Sessional Test ${sessional}`;
    } else if (type === "FA") {
      if (!faAttempt) {
        alert("Please select FA 1, 2, 3, or 4.");
        return;
      }
      finalType = `FA ${faAttempt}`;
    } else if (type === "Evaluation") {
      if (!evaluationPhase) {
        alert("Please select Evaluation 1, 2, 3, or Final.");
        return;
      }
      finalType = evaluationPhase === "Final" ? "Evaluation Final" : `Evaluation ${evaluationPhase}`;
    }
  
    try{
      const response = await fetch("https://remindify-exam-dates-tracker.onrender.com/api/exams",{
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({subject, type: finalType, date}),
      });

      if(!response.ok){
        throw new Error("Failed to add exam");
      }

      const data = await response.json();
      alert(`Added: ${data.subject} ${data.type} on ${data.date}`);
      
      setSubject("");
  setType("End Term Exam");
      setOtherType("");
  setSessional("");
  setFaAttempt("");
  setEvaluationPhase("");
      setDate("");
      navigate("/");

    }catch (err){
      console.error("Error:", err.message);
    }

  };

  const handleTypeChange = (e) => {
    const val = e.target.value;
    setType(val);
    // Reset dependent fields when switching away
    if (val !== "Other") setOtherType("");
    if (val !== "Sessional Test") setSessional("");
    if (val !== "FA") setFaAttempt("");
    if (val !== "Evaluation") setEvaluationPhase("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New Exam</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Subject */}
        <input
          type="text"
          placeholder="Subject Name"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          required
        />

        {/* Type Select */}
        <select
          value={type}
          onChange={handleTypeChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
        >
          <option value="End Term Exam">End Term Exam</option>
          <option value="Sessional Test">Sessional Test</option>
          <option value="FA">FA</option>
          <option value="Evaluation">Evaluation</option>
          <option value="Other">Other</option>
        </select>

        {/* If Sessional Test is selected, ask for ST 1/2/3 */}
        {type === "Sessional Test" && (
          <select
            value={sessional}
            onChange={(e) => setSessional(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            required
          >
            <option value="">Select ST</option>
            <option value="1">ST 1</option>
            <option value="2">ST 2</option>
            <option value="3">ST 3</option>
          </select>
        )}

        {/* If FA is selected, ask for FA 1/2/3/4 */}
        {type === "FA" && (
          <select
            value={faAttempt}
            onChange={(e) => setFaAttempt(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            required
          >
            <option value="">Select FA</option>
            <option value="1">FA 1</option>
            <option value="2">FA 2</option>
            <option value="3">FA 3</option>
            <option value="4">FA 4</option>
          </select>
        )}

        {/* If Evaluation is selected, ask for 1/2/3/Final */}
        {type === "Evaluation" && (
          <select
            value={evaluationPhase}
            onChange={(e) => setEvaluationPhase(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            required
          >
            <option value="">Select Evaluation</option>
            <option value="1">Evaluation 1</option>
            <option value="2">Evaluation 2</option>
            <option value="3">Evaluation 3</option>
            <option value="Final">Evaluation Final</option>
          </select>
        )}

        {/* Show input if "Other" is selected */}
        {type === "Other" && (
          <input
            type="text"
            placeholder="Enter other type"
            value={otherType}
            onChange={(e) => setOtherType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            required
          />
        )}

        {/* Date */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          required
        />

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-full py-2 px-4 hover:bg-blue-700"
        >
          Add
        </button>
      </form>
    </div>
  );
}

export default Form;
