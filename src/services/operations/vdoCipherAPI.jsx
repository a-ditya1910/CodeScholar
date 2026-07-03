import { apiConnector } from "../apiconnector";
import { vdoCipherEndpoints } from "../apis";

const { VIDEO_OTP_API } = vdoCipherEndpoints;

// Returns { otp, playbackInfo } for a DRM-protected video (enrolled users only)
export async function getVideoOtp(courseId, videoId, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : null;
  const response = await apiConnector(
    "POST",
    VIDEO_OTP_API,
    { courseId, videoId },
    headers
  );
  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Could not load protected video");
  }
  return { otp: response.data.otp, playbackInfo: response.data.playbackInfo };
}
