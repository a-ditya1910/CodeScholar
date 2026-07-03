import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import {
  createLiveClass,
  getMyLiveClasses,
  deleteLiveClass,
} from "../../../services/operations/liveClassAPI";
import IconBtn from "../../common/IconBtn";

export default function LiveClasses() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const isInstructor = user?.accountType === ACCOUNT_TYPE.INSTRUCTOR;

  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    courseId: "",
    title: "",
    description: "",
    scheduledAt: "",
  });

  const loadClasses = async () => {
    const data = await getMyLiveClasses(token);
    setClasses(data);
  };

  useEffect(() => {
    loadClasses();
    if (isInstructor) {
      fetchInstructorCourses(token).then((c) => setCourses(c || []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.courseId || !form.title || !form.scheduledAt) return;
    const created = await createLiveClass(form, token);
    if (created) {
      setForm({ courseId: "", title: "", description: "", scheduledAt: "" });
      loadClasses();
    }
  };

  const handleDelete = async (id) => {
    const ok = await deleteLiveClass(id, token);
    if (ok) loadClasses();
  };

  const isLive = (scheduledAt) => {
    const start = new Date(scheduledAt).getTime();
    const now = Date.now();
    // consider "live" from start time up to 3 hours after
    return now >= start && now <= start + 3 * 60 * 60 * 1000;
  };

  return (
    <div className="text-richblack-5">
      <h1 className="mb-6 text-3xl font-medium">Live Classes</h1>

      {isInstructor && (
        <form
          onSubmit={handleCreate}
          className="mb-8 space-y-4 rounded-lg border border-richblack-700 bg-richblack-800 p-6"
        >
          <p className="text-lg font-semibold">Schedule a live class</p>

          <select
            value={form.courseId}
            onChange={(e) => setForm({ ...form, courseId: e.target.value })}
            className="w-full rounded-md bg-richblack-700 px-3 py-2 text-richblack-5"
            required
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.courseName}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Class title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-md bg-richblack-700 px-3 py-2 text-richblack-5"
            required
          />

          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-md bg-richblack-700 px-3 py-2 text-richblack-5"
          />

          <input
            type="datetime-local"
            value={form.scheduledAt}
            onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
            className="w-full rounded-md bg-richblack-700 px-3 py-2 text-richblack-5"
            required
          />

          <IconBtn text="Schedule" type="submit" />
        </form>
      )}

      <div className="space-y-4">
        {classes.length === 0 && (
          <p className="text-richblack-300">No live classes yet.</p>
        )}

        {classes.map((cls) => {
          const live = isLive(cls.scheduledAt);
          return (
            <div
              key={cls._id}
              className="flex flex-col gap-2 rounded-lg border border-richblack-700 bg-richblack-800 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">{cls.title}</p>
                  {live && (
                    <span className="rounded-full bg-pink-200 px-2 py-0.5 text-xs font-medium text-white">
                      ● LIVE
                    </span>
                  )}
                </div>
                <p className="text-sm text-richblack-300">
                  {cls.course?.courseName} ·{" "}
                  {new Date(cls.scheduledAt).toLocaleString()}
                </p>
                {cls.description && (
                  <p className="mt-1 text-sm text-richblack-200">{cls.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/live-class/${cls._id}`)}
                  className={`rounded-md px-4 py-2 text-sm font-medium ${
                    live
                      ? "bg-yellow-50 text-richblack-900"
                      : "bg-richblack-700 text-richblack-100"
                  }`}
                >
                  {live ? "Join Now" : "Enter Room"}
                </button>
                {isInstructor && (
                  <button
                    onClick={() => handleDelete(cls._id)}
                    className="text-sm text-pink-200"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
