import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createCheckoutSession,
  stripeWebhook,
  getAllPurchasedCourses,
  getCourseDetailWithStatus,
} from "../controllers/purchasedCourse.controller.js";

const router = express.Router();

router
  .route("/checkout/create-checkout-session")
  .post(isAuthenticated, createCheckoutSession);
router
  .route("/webhook")
  .post(express.raw({ type: "application/json" }), stripeWebhook);
router
  .route("/courses/:courseId/details-with-status")
  .get(isAuthenticated, getCourseDetailWithStatus);
router.route("/").get(isAuthenticated, getAllPurchasedCourses);

export default router;
