import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { joinLiveClass } from "../services/operations/liveClassAPI";
import Watermark from "../components/common/Watermark";

// Jitsi toolbar WITHOUT recording / download / share-video / fullscreen buttons
// (fullscreen removed so the watermark overlay can't be escaped)
const TOOLBAR_BUTTONS = [
  "microphone",
  "camera",
  "desktop",
  "hangup",
  "chat",
  "raisehand",
  "tileview",
  "settings",
  "participants-pane",
];

export default function LiveClassRoom() {
  const { classId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await joinLiveClass(classId, token);
      setRoom(data);
      setLoading(false);
      if (!data) {
        // not authorized / not found -> send back
        navigate("/dashboard/live-classes");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  if (loading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] place-items-center text-richblack-5">
        Loading room…
      </div>
    );
  }

  if (!room) return null;

  const displayName = user ? `${user.firstName} ${user.lastName}` : "Guest";
  const hash =
    `#config.disableDeepLinking=true` +
    `&config.toolbarButtons=${encodeURIComponent(JSON.stringify(TOOLBAR_BUTTONS))}` +
    `&userInfo.displayName=${encodeURIComponent(displayName)}`;
  const src = `https://meet.jit.si/${room.roomName}${hash}`;

  return (
    <div className="mx-auto w-11/12 max-w-maxContent py-6 text-richblack-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{room.title}</h1>
          <p className="text-sm text-richblack-300">{room.courseName}</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/live-classes")}
          className="rounded-md bg-richblack-700 px-4 py-2 text-sm"
        >
          Leave
        </button>
      </div>

      <div
        className="relative overflow-hidden rounded-lg border border-richblack-700"
        onContextMenu={(e) => e.preventDefault()}
      >
        <iframe
          title={room.title}
          src={src}
          allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
          className="h-[75vh] w-full"
        />
        <Watermark text={`${displayName} · ${user?.email || ""}`} />
      </div>
    </div>
  );
}
