
import React, { useState } from 'react';
import axios from 'axios';

const API = (import.meta.env.VITE_API_BASE_URL) + '/api';


function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || '');
  const [auth, setAuth] = useState(!!localStorage.getItem('adminToken'));
  const [editExam, setEditExam] = useState(null);
  const [editExamFields, setEditExamFields] = useState({ subject: '', type: '', date: '' });
  const [editRequest, setEditRequest] = useState(null);
  const [editRequestFields, setEditRequestFields] = useState({ subject: '', description: '', date: '', remark: '' });
  // Edit request modal handlers
  const handleEditRequest = (req) => {
    setEditRequest(req);
    setEditRequestFields({
      subject: req.subject || '',
      description: req.description || '',
      date: req.date ? req.date.slice(0, 10) : '',
      remark: req.remark || ''
    });
  };

  const handleEditRequestChange = (e) => {
    setEditRequestFields({ ...editRequestFields, [e.target.name]: e.target.value });
  };

  const handleSaveRequest = async () => {
    try {
      await axios.put(`${API}/exam-requests/${editRequest._id}`, editRequestFields, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditRequest(null);
      fetchRequests(token);
    } catch (err) {
      alert('Error saving request changes');
    }
  };

  const fetchRequests = async (token) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/exam-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Only show pending requests
      setRequests(res.data.filter(r => r.status === 'pending'));
      setAuth(true);
      setError('');
    } catch (err) {
      setError('Unauthorized or error fetching requests.');
      setAuth(false);
    }
    setLoading(false);
  };

  const fetchExams = async () => {
    try {
      const res = await axios.get(`${API}/exams`);
      // Sort exams by date descending
      const sorted = [...res.data].sort((a, b) => new Date(b.date) - new Date(a.date));
      setExams(sorted);
    } catch (err) {
      // ignore for now
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`${API}/exam-requests/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchRequests(token);
      await fetchExams();
    } catch (err) {
      alert('Error approving request');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`${API}/exam-requests/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRequests(token);
    } catch (err) {
      alert('Error rejecting request');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/exam-requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRequests(token);
    } catch (err) {
      alert('Error deleting request');
    }
  };

  // Live exam edit/delete
  const handleEditExam = (exam) => {
    setEditExam(exam);
    setEditExamFields({ subject: exam.subject, type: exam.type, date: exam.date });
  };

  const handleEditExamChange = (e) => {
    setEditExamFields({ ...editExamFields, [e.target.name]: e.target.value });
  };

  const handleSaveExam = async () => {
    try {
      await axios.put(`${API}/exams/${editExam._id}`, editExamFields, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditExam(null);
      fetchExams();
    } catch (err) {
      alert('Error saving changes');
    }
  };

  const handleDeleteExam = async (id) => {
    if (!window.confirm('Delete this exam?')) return;
    try {
      await axios.delete(`${API}/exams/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExams();
    } catch (err) {
      alert('Error deleting exam');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/admin/login`, { username, password });
      if (res.data && res.data.token) {
        setToken(res.data.token);
        setAuth(true);
        localStorage.setItem('adminToken', res.data.token);
        setError('');
        fetchRequests(res.data.token);
        fetchExams();
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed: ' + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  // On mount, if token in localStorage, auto-login
  React.useEffect(() => {
    if (token && auth) {
      fetchRequests(token);
      fetchExams();
    }
  }, [token, auth]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      {!auth && (
        <form onSubmit={handleLogin} className="mb-4 max-w-sm mx-auto bg-white p-6 rounded shadow">
          <div className="mb-4">
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              placeholder="admin"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="border px-2 py-1 w-full"
              autoComplete="username"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border px-2 py-1 w-full"
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>
      )}
      {auth && (
        <>
          {loading ? <div>Loading...</div> : (
            <>
              <div className="mb-10">
                <h3 className="font-semibold mb-4 text-lg">Exam Requests</h3>
                {requests.length === 0 ? <div>No requests.</div> : (
                  <div className="flex flex-col gap-6">
                    {requests.map(req => (
                      <div
                        key={req._id}
                        className="bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col md:flex-row md:items-center md:justify-between transition-transform hover:scale-[1.01] hover:shadow-lg"
                      >
                        <div className="mb-4 md:mb-0">
                          <div className="text-lg font-bold mb-1">Subject: <span className="font-normal">{req.subject}</span></div>
                          <div className="text-gray-700 mb-1">Date: <span className="font-semibold">{new Date(req.date).toLocaleDateString()}</span></div>
                          <div className="text-gray-700 mb-1">Description: <span className="font-semibold">{req.description}</span></div>
                          <div className="text-gray-700 mb-1">Status: <span className="font-semibold capitalize">{req.status}</span></div>
                          <div className="text-gray-700">Remark: <span className="font-semibold">{req.remark || 'N/A'}</span></div>
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-3 items-center">
                          <button
                            onClick={() => handleEditRequest(req)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow-sm transition-colors"
                          >Edit</button>
                          {req.status === 'pending' && <>
                            <button
                              onClick={() => window.confirm('Approve this request?') && handleApprove(req._id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded shadow-sm transition-colors"
                            >Approve</button>
                            <button
                              onClick={() => window.confirm('Reject this request?') && handleReject(req._id)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded shadow-sm transition-colors"
                            >Reject</button>
                          </>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* Edit Request Modal (always rendered at root) */}
              {editRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-md relative">
                    <button
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                      onClick={() => setEditRequest(null)}
                    >&times;</button>
                    <h3 className="text-xl font-bold mb-4">Edit Exam Request</h3>
                    <div className="mb-3">
                      <label className="block mb-1 font-medium">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={editRequestFields.subject}
                        onChange={handleEditRequestChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block mb-1 font-medium">Description</label>
                      <input
                        type="text"
                        name="description"
                        value={editRequestFields.description}
                        onChange={handleEditRequestChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block mb-1 font-medium">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={editRequestFields.date}
                        onChange={handleEditRequestChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block mb-1 font-medium">Remark</label>
                      <input
                        type="text"
                        name="remark"
                        value={editRequestFields.remark}
                        onChange={handleEditRequestChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleSaveRequest}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                      >Save</button>
                      <button
                        onClick={() => setEditRequest(null)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow"
                      >Cancel</button>
                    </div>
                  </div>
                </div>
              )}
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-lg">Live Exams (Edit/Delete)</h3>
                {exams.length === 0 ? <div>No live exams.</div> : (
                  <div className="flex flex-col gap-6">
                    {exams.map(exam => (
                      <div
                        key={exam._id}
                        className="bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col md:flex-row md:items-center md:justify-between transition-transform hover:scale-[1.01] hover:shadow-lg"
                      >
                        <div className="mb-4 md:mb-0">
                          <div className="text-lg font-bold mb-1">Subject: <span className="font-normal">{exam.subject}</span></div>
                          <div className="text-gray-700 mb-1">Type: <span className="font-semibold">{exam.type}</span></div>
                          <div className="text-gray-700 mb-1">Date: <span className="font-semibold">{new Date(exam.date).toLocaleDateString()}</span></div>
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-3 items-center">
                          <button
                            onClick={() => handleEditExam(exam)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow-sm transition-colors"
                          >Edit</button>
                          <button
                            onClick={() => handleDeleteExam(exam._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow-sm transition-colors"
                          >Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit Exam Modal */}
              {editExam && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-md relative">
                    <button
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                      onClick={() => setEditExam(null)}
                    >&times;</button>
                    <h3 className="text-xl font-bold mb-4">Edit Exam</h3>
                    <div className="mb-3">
                      <label className="block mb-1 font-medium">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={editExamFields.subject}
                        onChange={handleEditExamChange}
                        className="border px-2 py-1 w-full rounded"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block mb-1 font-medium">Type</label>
                      <input
                        type="text"
                        name="type"
                        value={editExamFields.type}
                        onChange={handleEditExamChange}
                        className="border px-2 py-1 w-full rounded"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block mb-1 font-medium">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={editExamFields.date}
                        onChange={handleEditExamChange}
                        className="border px-2 py-1 w-full rounded"
                      />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleSaveExam}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-sm"
                      >Save</button>
                      <button
                        onClick={() => setEditExam(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded shadow-sm"
                      >Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AdminPage;
