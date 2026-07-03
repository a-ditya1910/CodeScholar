import { apiConnector } from "../apiconnector";
import { quizEndpoints } from "../apis";

const { GENERATE_QUIZ_API } = quizEndpoints;

export async function generateQuiz(courseId, difficulty, numQuestions, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : null;
  const response = await apiConnector(
    "POST",
    GENERATE_QUIZ_API,
    { courseId, difficulty, numQuestions },
    headers
  );

  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Failed to generate quiz");
  }
  return response.data.quiz;
}
