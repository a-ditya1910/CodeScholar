import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getVideoOtp } from "../../../services/operations/vdoCipherAPI";

// DRM-encrypted player. The video is served by VdoCipher via an OTP that our
// backend only issues to enrolled users. There is NO downloadable file/URL,
// and on supported devices screen recording is blacked out (HDCP).
export default function VdoPlayer({ courseId, videoId }) {
  const { token } = useSelector((state) => state.auth);
  const [embed, setEmbed] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { otp, playbackInfo } = await getVideoOtp(courseId, videoId, token);
        if (active) setEmbed({ otp, playbackInfo });
      } catch (err) {
        if (active) setError(err.message);
      }
    })();
    return () => {
      active = false;
    };
  }, [courseId, videoId, token]);

  if (error) {
    return (
      <div className="grid aspect-video w-full place-items-center rounded-md bg-richblack-800 text-sm text-richblack-300">
        {error}
      </div>
    );
  }

  if (!embed) {
    return (
      <div className="grid aspect-video w-full place-items-center rounded-md bg-richblack-800 text-sm text-richblack-300">
        Loading secure video…
      </div>
    );
  }

  const src = `https://player.vdocipher.com/v2/?otp=${embed.otp}&playbackInfo=${embed.playbackInfo}`;

  return (
    <iframe
      title="Secure video"
      src={src}
      allow="encrypted-media; fullscreen"
      allowFullScreen
      className="aspect-video w-full rounded-md"
    />
  );
}
