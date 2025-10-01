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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminCode, setAdminCode] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // prevent double submit
    if (!adminCode.trim()) {
      alert("Admin code is required to add an exam.");
      return;
    }
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
      setIsSubmitting(true);
      const base = import.meta.env.VITE_API_BASE_URL || "";
      const response = await fetch(`${base}/api/exams`,{
        method: "POST",
        headers:{
          "Content-Type": "application/json",
          "x-admin-key": adminCode.trim(),
        },
        body: JSON.stringify({subject, type: finalType, date}),
      });

      if(!response.ok){
        if (response.status === 403) {
          alert("Invalid admin code. You are not allowed to add exams.");
          return;
        }
        const msg = await response.text();
        throw new Error(msg || "Failed to add exam");
      }

      const data = await response.json();
      // alert(`Added: ${data.subject} ${data.type} on ${data.date}`);
      
      setSubject("");
  setType("End Term Exam");
      setOtherType("");
  setSessional("");
  setFaAttempt("");
  setEvaluationPhase("");
      setDate("");
  setAdminCode("");
      navigate("/");

    }catch (err){
      console.error("Error:", err.message);
    } finally {
      setIsSubmitting(false);
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 px-4 pt-3 pb-6">
      <div className="max-w-2xl mx-auto mt-5">
        <div className="bg-white/90 backdrop-blur rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="mb-5 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Add New Exam</h2>
            <p className="mt-2 text-sm text-gray-500">Admins only. Enter the admin code to publish an exam.</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Admin Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin code</label>
              <input
                type="password"
                placeholder="Enter admin code"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white/90 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                placeholder="e.g., Data Structures"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white/90 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Type Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={type}
                onChange={handleTypeChange}
                className="w-full rounded-xl border border-gray-200 bg-white/90 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={isSubmitting}
              >
                <option value="End Term Exam">End Term Exam</option>
                <option value="Sessional Test">Sessional Test</option>
                <option value="FA">FA</option>
                <option value="Evaluation">Evaluation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* If Sessional Test is selected, ask for ST 1/2/3 */}
            {type === "Sessional Test" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sessional</label>
                <select
                  value={sessional}
                  onChange={(e) => setSessional(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white/90 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={isSubmitting}
                  required
                >
                  <option value="">Select ST</option>
                  <option value="1">ST 1</option>
                  <option value="2">ST 2</option>
                  <option value="3">ST 3</option>
                </select>
              </div>
            )}

            {/* If FA is selected, ask for FA 1/2/3/4 */}
            {type === "FA" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FA</label>
                <select
                  value={faAttempt}
                  onChange={(e) => setFaAttempt(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white/90 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={isSubmitting}
                  required
                >
                  <option value="">Select FA</option>
                  <option value="1">FA 1</option>
                  <option value="2">FA 2</option>
                  <option value="3">FA 3</option>
                  <option value="4">FA 4</option>
                </select>
              </div>
            )}

            {/* If Evaluation is selected, ask for 1/2/3/Final */}
            {type === "Evaluation" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Evaluation</label>
                <select
                  value={evaluationPhase}
                  onChange={(e) => setEvaluationPhase(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white/90 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={isSubmitting}
                  required
                >
                  <option value="">Select Evaluation</option>
                  <option value="1">Evaluation 1</option>
                  <option value="2">Evaluation 2</option>
                  <option value="3">Evaluation 3</option>
                  <option value="Final">Evaluation Final</option>
                </select>
              </div>
            )}

            {/* Show input if "Other" is selected */}
            {type === "Other" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Other type</label>
                <input
                  type="text"
                  placeholder="e.g., Lab Assessment"
                  value={otherType}
                  onChange={(e) => setOtherType(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white/90 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={isSubmitting}
                  required
                />
              </div>
            )}

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white/90 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full py-2.5 px-6 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 shadow-sm"
              >
                {isSubmitting && (
                  <i className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                )}
                <span>Add</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;
