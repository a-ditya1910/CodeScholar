import { apiConnector } from "../apiconnector";
import { chatEndpoints } from "../apis";

const { CHAT_API } = chatEndpoints;

// messages: [{ role: "user" | "assistant", content: "..." }]
export async function sendChatMessage(messages, token = null, courseId = null) {
  const headers = token ? { Authorization: `Bearer ${token}` } : null;
  const body = { messages };
  if (courseId) body.courseId = courseId;

  const response = await apiConnector("POST", CHAT_API, body, headers);

  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Chat failed");
  }
  return response.data.message;
}
