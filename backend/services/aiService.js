import "dotenv/config";

const MODEL = "gemini-2.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const callGemini = async (systemPrompt, userPrompt) => {
  const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1500,
        // Ask Gemini to return raw JSON directly instead of wrapping it in prose/fences
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("\n") || "";
  // Strip markdown code fences just in case the model still wraps JSON in them
  return text.replace(/```json|```/g, "").trim();
};

/**
 * Generates interview questions tailored to a job description.
 * Returns an array of { text, category, difficulty }
 */
export const generateQuestions = async (jobDescriptionText, experienceLevel = "entry") => {
  const systemPrompt = `You are an expert technical interviewer. Given a job description, generate 8 relevant interview questions.
Respond ONLY with a JSON array, no preamble, no markdown fences. Each item must have exactly these fields:
"text" (string), "category" (one of: behavioral, technical, situational, culture-fit), "difficulty" (one of: easy, medium, hard).
Tailor difficulty and technical depth to a candidate at the "${experienceLevel}" level.`;

  const userPrompt = `Job description:\n\n${jobDescriptionText}`;

  const raw = await callGemini(systemPrompt, userPrompt);
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error("Failed to parse AI question generation response as JSON");
  }
};

/**
 * Scores a candidate's answer to a specific question.
 * Returns { score, strengths, improvements, feedbackSummary }
 */
export const scoreAnswer = async (questionText, answerText) => {
  const systemPrompt = `You are an expert interview coach. Evaluate a candidate's answer to an interview question.
Respond ONLY with a JSON object, no preamble, no markdown fences. It must have exactly these fields:
"score" (integer 0-100), "strengths" (array of short strings), "improvements" (array of short strings), "feedbackSummary" (2-3 sentence string).
Be specific and constructive, not generic.`;

  const userPrompt = `Question: ${questionText}\n\nCandidate's answer: ${answerText}`;

  const raw = await callGemini(systemPrompt, userPrompt);
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error("Failed to parse AI scoring response as JSON");
  }
};
