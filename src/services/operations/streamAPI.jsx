import { BASE_URL } from "../apis";

// Loads a lecture's video through an authenticated request (JWT in the header)
// and returns a page-scoped blob URL. A copied URL / incognito has no auth
// header, so it gets 401 and cannot load or download the video. The blob URL
// only exists inside this logged-in page and can't be opened anywhere else.
export async function getStreamBlobUrl(courseId, subSectionId, token) {
  const res = await fetch(
    `${BASE_URL}/video/stream/${subSectionId}?courseId=${courseId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) {
    throw new Error("Could not load video");
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
