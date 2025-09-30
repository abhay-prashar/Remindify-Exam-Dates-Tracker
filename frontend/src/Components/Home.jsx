import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home({ search = "" }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch("https://remindify-exam-dates-tracker.onrender.com/api/exams");
        if (!res.ok) {
          throw new Error("Failed to fetch exams");
        }
        const data = await res.json();

        const today = new Date();
        const upcomingExams = data.filter(
          (exam) => new Date(exam.date) >= new Date(today.setHours(0, 0, 0, 0))
        );

        setExams(upcomingExams);

      } catch (err) {
        console.error("Error fetching exams:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

    const normalizedQuery = (search || "").toString().toLowerCase().trim();
    const filteredExams = exams.filter((exam) => {
      const subject = (exam.subject || "").toString().toLowerCase();
      const type = (exam.type || "").toString().toLowerCase();
      return (
        subject.includes(normalizedQuery) || type.includes(normalizedQuery)
      );
    });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">📚 Upcoming Exams</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-600">
            <i className="inline-block h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" aria-hidden="true" />
            <span className="sr-only">Loading</span>
          </div>
        ) : exams.length === 0 ? (
          <p className="text-gray-500 text-center text-sm">No exams scheduled.</p>
        ) : (
          <div className="space-y-4">
            {filteredExams.map((exam, index) => (
              <div
                key={exam._id}
                className={`flex justify-between items-center p-4 rounded-lg shadow-md transition-shadow duration-300 ${
                  index < 2
                    ? "bg-red-100 border-l-4 border-red-500"
                    : "bg-white hover:shadow-lg"
                }`}
              >
                <div>
                  <p className={`text-lg font-semibold ${index < 2 ? "text-red-800" : "text-gray-800"}`}>
                    {exam.subject}
                  </p>
                  <p className="text-sm text-gray-500">{exam.type}</p>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {new Date(exam.date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
