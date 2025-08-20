import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import coursesRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import purchaseRoute from "./routes/purchasedCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";

dotenv.config({});

// Connect to the database
connectDB();
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//api's
app.use("/api/media", mediaRoute);
app.use("/api/user", userRoute);
app.use("/api/courses", coursesRoute);
app.use("/api/purchased", purchaseRoute);
app.use("/api/progress", courseProgressRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
