const express = require("express");
const router = express.Router();

const {
  createLiveClass,
  getMyLiveClasses,
  joinLiveClass,
  deleteLiveClass,
} = require("../controllers/LiveClass");

const { auth, isInstructor } = require("../middlewares/auth");

router.post("/create", auth, isInstructor, createLiveClass);
router.get("/myClasses", auth, getMyLiveClasses);
router.post("/join", auth, joinLiveClass);
router.post("/delete", auth, isInstructor, deleteLiveClass);

module.exports = router;
