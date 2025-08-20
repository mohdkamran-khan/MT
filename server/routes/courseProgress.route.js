import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getCourseProgress,
  markAsCompleted,
  markAsIncomplete,
  updateLectureProgress,
  getCourseDetails,
} from "../controllers/courseProgress.controller.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log("CourseProgress route hit:", req.method, req.originalUrl);
  next();
});

router.route("/:courseId/details").get(isAuthenticated, getCourseDetails);
router.route("/:courseId/progress").get(isAuthenticated, getCourseProgress);
router
  .route("/:courseId/lectures/:lectureId/view")
  .post(isAuthenticated, updateLectureProgress);
router.route("/:courseId/complete").post(isAuthenticated, markAsCompleted);
router.route("/:courseId/incomplete").post(isAuthenticated, markAsIncomplete);

export default router;
