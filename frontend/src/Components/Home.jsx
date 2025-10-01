import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home({ search = "" }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const base = import.meta.env.VITE_API_BASE_URL || "";
        const res = await fetch(`${base}/api/exams`);
        if (!res.ok) {
          throw new Error("Failed to fetch exams");
        }
        const data = await res.json();

        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const upcomingExams = data
          .filter((exam) => {
            const d = new Date(exam.date);
            if (isNaN(d)) return false;
            const sod = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            return sod >= startOfToday;
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date));

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

  // helpers
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysUntil = (dateStr) => {
    const now = new Date();
    const t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const d = new Date(dateStr);
    if (isNaN(d)) return Infinity;
    const t1 = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    return Math.round((t1 - t0) / msPerDay);
  };

  const formatBadge = (du) => {
    if (du === 0) return "Today";
    if (du === 1) return "Tomorrow";
    return `${du} days left`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 px-4 pt-3 pb-6">
      <div className="max-w-4xl mx-auto mt-5">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Upcoming Exams
          </h1>
          <p className="mt-2 text-base md:text-lg text-gray-600">
            BE CSE · 5th Semester · 3rd Year
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-600">
            <i className="inline-block h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" aria-hidden="true" />
            <span className="sr-only">Loading</span>
          </div>
        ) : exams.length === 0 ? (
          <p className="text-gray-500 text-center text-sm">No exams scheduled.</p>
        ) : (
          <div className="space-y-4">
            {filteredExams.map((exam) => {
              const du = daysUntil(exam.date);
              const urgent = du <= 5;
              const soon = !urgent && du <= 10;

              const cardBase = "flex justify-between items-center p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300";
              const cardTone = urgent
                ? "bg-gradient-to-r from-rose-50 to-white border-rose-300 border-l-4 shadow-sm"
                : soon
                ? "bg-gradient-to-r from-amber-50 to-white border-amber-300 border-l-4 shadow-sm"
                : "bg-white/80 hover:bg-white/90 border-gray-200 hover:shadow";

              const titleTone = urgent ? "text-rose-800" : soon ? "text-amber-800" : "text-gray-900";
              const badgeTone = urgent
                ? "bg-rose-100 text-rose-800"
                : soon
                ? "bg-amber-100 text-amber-800"
                : "bg-gray-100 text-gray-700";

              return (
                <div key={exam._id} className={`${cardBase} ${cardTone}`}>
                  <div>
                    <p className={`text-lg font-semibold ${titleTone}`}>{exam.subject}</p>
                    <p className="text-sm text-gray-500">{exam.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeTone}`}>
                      {formatBadge(du)}
                    </span>
                    <p className="text-sm font-medium text-gray-700 px-3 py-1 rounded-full bg-gray-100/70">
                      {new Date(exam.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
