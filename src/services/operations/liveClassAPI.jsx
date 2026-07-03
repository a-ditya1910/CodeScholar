import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { liveClassEndpoints } from "../apis";

const {
  CREATE_LIVE_CLASS_API,
  MY_LIVE_CLASSES_API,
  JOIN_LIVE_CLASS_API,
  DELETE_LIVE_CLASS_API,
} = liveClassEndpoints;

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function createLiveClass(data, token) {
  const toastId = toast.loading("Scheduling...");
  try {
    const res = await apiConnector("POST", CREATE_LIVE_CLASS_API, data, authHeader(token));
    if (!res?.data?.success) throw new Error(res?.data?.message);
    toast.success("Live class scheduled");
    return res.data.liveClass;
  } catch (err) {
    toast.error(err.message || "Could not schedule class");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
}

export async function getMyLiveClasses(token) {
  try {
    const res = await apiConnector("GET", MY_LIVE_CLASSES_API, null, authHeader(token));
    if (!res?.data?.success) throw new Error(res?.data?.message);
    return res.data.classes;
  } catch (err) {
    toast.error(err.message || "Could not load classes");
    return [];
  }
}

export async function joinLiveClass(classId, token) {
  try {
    const res = await apiConnector("POST", JOIN_LIVE_CLASS_API, { classId }, authHeader(token));
    if (!res?.data?.success) throw new Error(res?.data?.message);
    return res.data.room;
  } catch (err) {
    toast.error(err.message || "Could not join class");
    return null;
  }
}

export async function deleteLiveClass(classId, token) {
  try {
    const res = await apiConnector("POST", DELETE_LIVE_CLASS_API, { classId }, authHeader(token));
    if (!res?.data?.success) throw new Error(res?.data?.message);
    toast.success("Class deleted");
    return true;
  } catch (err) {
    toast.error(err.message || "Could not delete class");
    return false;
  }
}
