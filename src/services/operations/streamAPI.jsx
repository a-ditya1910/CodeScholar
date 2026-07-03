import { apiConnector } from "../apiconnector";
import { videoStreamEndpoints } from "../apis";

const { STREAM_TOKEN_API, STREAM_BASE } = videoStreamEndpoints;

// Returns a proxied, authenticated stream URL for a lecture. The raw Cloudinary
// URL is never exposed; the returned URL carries a short-lived token.
export async function getStreamUrl(courseId, subSectionId, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : null;
  const res = await apiConnector(
    "POST",
    STREAM_TOKEN_API,
    { courseId, subSectionId },
    headers
  );
  if (!res?.data?.success) {
    throw new Error(res?.data?.message || "Could not load video");
  }
  return `${STREAM_BASE}${subSectionId}?vt=${res.data.streamToken}`;
}
