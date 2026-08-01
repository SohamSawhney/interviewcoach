import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [jds, setJds] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [form, setForm] = useState({ title: "", company: "", rawText: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJds = async () => {
      try {
        const { data } = await api.get("/job-descriptions");
        setJds(data);
      } finally {
        setLoadingList(false);
      }
    };
    fetchJds();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/job-descriptions", form);
      navigate(`/session/${data.jobDescription._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="shell">
        <div className="topbar">
          <div className="brand">
            Interview<span>Stage</span>
          </div>
          <button className="btn-secondary" onClick={logout}>
            Log out{user?.name ? ` · ${user.name}` : ""}
          </button>
        </div>

        <div className="panel">
          <span className="eyebrow">New rehearsal</span>
          <h2>Start a session</h2>
          <p className="panel-sub">Paste a job description — we'll build questions matched to it.</p>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="title">Role title</label>
              <input
                id="title"
                name="title"
                placeholder="e.g. Backend Engineer"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="company">Company (optional)</label>
              <input id="company" name="company" placeholder="e.g. Acme Corp" value={form.company} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="rawText">Job description</label>
              <textarea
                id="rawText"
                name="rawText"
                placeholder="Paste the full job description here..."
                rows={8}
                value={form.rawText}
                onChange={handleChange}
                required
              />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Writing your questions..." : "Take the stage"}
            </button>
          </form>
        </div>

        <div className="panel">
          <span className="eyebrow">Call sheet</span>
          <h2>Past sessions</h2>
          <p className="panel-sub">Jump back into a rehearsal or start fresh.</p>

          {loadingList ? (
            <p className="loading-text">Loading sessions...</p>
          ) : jds.length === 0 ? (
            <div className="empty-state">No sessions yet — start one above to get your first set of questions.</div>
          ) : (
            <div className="call-sheet">
              {jds.map((jd) => (
                <div key={jd._id} className="ticket" onClick={() => navigate(`/session/${jd._id}`)}>
                  <div>
                    <div className="ticket-title">{jd.title}</div>
                    <div className="ticket-meta">{jd.company || "No company listed"}</div>
                  </div>
                  <div className="ticket-arrow">→</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
