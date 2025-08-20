import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getCourseById,
  getCourseLecture,
  getCreatorCourses,
  getLectureById,
  getPublishedCourse,
  removeLecture,
  searchCourse,
  togglePublishCourse,
} from "../controllers/course.controller.js";
import upload from "../utils/multer.cjs";

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/search").get(isAuthenticated, searchCourse);
router.route("/published-courses").get(getPublishedCourse);
router.route("/").get(isAuthenticated, getCreatorCourses);
router
  .route("/:courseId")
  .put(isAuthenticated, upload.single("courseThumbnail"), editCourse)
  .patch(isAuthenticated, editCourse); // for publish toggle
router.route("/:courseId").get(isAuthenticated, getCourseById);
router.route("/:courseId/lectures").post(isAuthenticated, createLecture);
router.route("/:courseId/lectures").get(isAuthenticated, getCourseLecture);
router
  .route("/:courseId/lectures/:lectureId")
  .post(isAuthenticated, editLecture);
router.route("/lectures/:lectureId").delete(isAuthenticated, removeLecture);
router.route("/lectures/:lectureId").get(isAuthenticated, getLectureById);
router.route("/:courseId").patch(isAuthenticated, togglePublishCourse);

export default router;
