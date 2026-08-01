import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await api.get(`/job-descriptions/${id}`);
      setJobDescription(data.jobDescription);
      setQuestions(data.questions);
    };
    fetchSession();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/answers", {
        questionId: questions[current]._id,
        answerText,
      });
      setFeedback(data);
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    setCurrent((c) => c + 1);
    setAnswerText("");
    setFeedback(null);
  };

  if (!jobDescription || questions.length === 0) {
    return (
      <div className="page">
        <div className="shell">
          <p className="loading-text">Setting the stage...</p>
        </div>
      </div>
    );
  }

  if (current >= questions.length) {
    return (
      <div className="page">
        <div className="shell">
          <div className="topbar">
            <div className="brand">
              Interview<span>Stage</span>
            </div>
            <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
              Back to green room
            </button>
          </div>
          <div className="session-complete">
            <span className="eyebrow">Curtain call</span>
            <h1>That's a wrap</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: 15 }}>
              You answered all {questions.length} questions for {jobDescription.title}.
            </p>
            <div style={{ marginTop: 24 }}>
              <button onClick={() => navigate("/dashboard")}>Back to green room</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="page">
      <div className="shell">
        <div className="topbar">
          <div className="brand">
            Interview<span>Stage</span>
          </div>
          <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
            Back to green room
          </button>
        </div>

        <span className="eyebrow">{jobDescription.title}</span>
        <h1 style={{ fontSize: 26, marginBottom: 28 }}>
          {jobDescription.company ? `Rehearsing for ${jobDescription.company}` : "Rehearsal in progress"}
        </h1>

        <div className="stage-layout">
          <div className="running-order">
            <div className="rail-label">Running order</div>
            {questions.map((item, idx) => (
              <div
                key={item._id}
                className={`rail-item ${idx === current ? "active" : ""} ${idx < current ? "done" : ""}`}
              >
                <span className="rail-num">{idx < current ? "✓" : String(idx + 1).padStart(2, "0")}</span>
                <span>{item.category}</span>
              </div>
            ))}
          </div>

          <div className="spotlight-stage">
            <div className="spotlight-card">
              <div className="q-meta">
                <span className="tag category">{q.category}</span>
                <span className="tag">{q.difficulty}</span>
              </div>
              <div className="q-text">{q.text}</div>

              {!feedback ? (
                <form onSubmit={handleSubmit}>
                  <textarea
                    rows={6}
                    placeholder="Type your answer as you'd say it out loud..."
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    required
                  />
                  <button type="submit" disabled={submitting}>
                    {submitting ? "Scoring your answer..." : "Submit answer"}
                  </button>
                </form>
              ) : (
                <div className="feedback-card">
                  <div className="score-row">
                    <span className="score-number">{feedback.score}</span>
                    <span className="score-label">/ 100</span>
                  </div>
                  <p className="feedback-summary">{feedback.feedbackSummary}</p>
                  <div className="feedback-cols">
                    <div className="feedback-col strengths">
                      <div className="col-label">Strengths</div>
                      <ul>
                        {feedback.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="feedback-col improvements">
                      <div className="col-label">Improve</div>
                      <ul>
                        {feedback.improvements.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <button onClick={nextQuestion}>
                      {current + 1 === questions.length ? "Finish session" : "Next question"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
