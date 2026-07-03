import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { generateQuiz } from "../../../services/operations/quizAPI";

const DIFFICULTIES = ["basic", "medium", "hard"];

export default function AiQuiz({ courseId }) {
  const { token } = useSelector((state) => state.auth);

  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // { [questionIndex]: optionIndex }
  const [submitted, setSubmitted] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setQuiz(null);
    setAnswers({});
    setSubmitted(false);
    try {
      const data = await generateQuiz(courseId, difficulty, 5, token);
      setQuiz(data);
    } catch (err) {
      toast.error(err.message || "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const score = quiz
    ? quiz.reduce((acc, q, i) => (answers[i] === q.answerIndex ? acc + 1 : acc), 0)
    : 0;

  return (
    <div className="mt-6 rounded-lg border border-richblack-700 bg-richblack-800 p-5">
      <h2 className="text-2xl font-semibold text-richblack-5">AI Quiz</h2>
      <p className="mt-1 text-sm text-richblack-300">
        Test your understanding with AI-generated questions for this course.
      </p>

      {/* Difficulty + generate */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`rounded-md px-3 py-1 text-sm capitalize ${
                difficulty === d
                  ? "bg-yellow-50 text-richblack-900"
                  : "bg-richblack-700 text-richblack-100"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="rounded-md bg-yellow-50 px-4 py-1 text-sm font-medium text-richblack-900 disabled:opacity-50"
        >
          {loading ? "Generating…" : quiz ? "Regenerate" : "Generate Quiz"}
        </button>
      </div>

      {/* Questions */}
      {quiz && (
        <div className="mt-6 space-y-6">
          {quiz.map((q, qi) => (
            <div key={qi}>
              <p className="font-medium text-richblack-5">
                {qi + 1}. {q.question}
              </p>
              <div className="mt-2 space-y-2">
                {q.options.map((opt, oi) => {
                  const chosen = answers[qi] === oi;
                  const correct = q.answerIndex === oi;
                  let cls = "border-richblack-600 bg-richblack-700 text-richblack-100";
                  if (submitted) {
                    if (correct)
                      cls = "border-caribbeangreen-300 bg-caribbeangreen-800 text-caribbeangreen-5";
                    else if (chosen)
                      cls = "border-pink-300 bg-pink-800 text-pink-5";
                  } else if (chosen) {
                    cls = "border-yellow-50 bg-richblack-600 text-richblack-5";
                  }
                  return (
                    <button
                      key={oi}
                      disabled={submitted}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [qi]: oi }))
                      }
                      className={`block w-full rounded-md border px-3 py-2 text-left text-sm ${cls}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <p className="mt-2 text-xs text-richblack-300">
                  <span className="font-semibold text-richblack-100">Answer:</span>{" "}
                  {q.options[q.answerIndex]}
                  {q.explanation ? ` — ${q.explanation}` : ""}
                </p>
              )}
            </div>
          ))}

          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              disabled={Object.keys(answers).length !== quiz.length}
              className="rounded-md bg-yellow-50 px-4 py-2 text-sm font-medium text-richblack-900 disabled:opacity-50"
            >
              Submit
            </button>
          ) : (
            <p className="text-lg font-semibold text-yellow-50">
              You scored {score} / {quiz.length}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
