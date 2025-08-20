import Course from "../models/course.model.js";
import CourseProgress from "../models/courseProgress.js";

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // fetch user course progress
    let courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    }).populate("courseId");

    // fetch course details with populated lectures
    const courseDetails = await Course.findById(courseId).populate("lectures");

    if (!courseDetails) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // if user has no progress yet, create empty progress
    if (!courseProgress) {
      return res.status(200).json({
        data: {
          courseDetails,
          progress: [],
          completed: false,
        },
      });
    }

    return res.status(200).json({
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;
    //fetch or create courseProgress
    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      //if no progress, create a new record
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }
    //find the lecture progress in course progress
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId === lectureId
    );
    if (lectureIndex !== -1) {
      //if lecture exists, update its status
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      //add new lecture progress
      courseProgress.lectureProgress.push({ lectureId, viewed: true });
    }
    //if all lectures are completed
    const lectureProgressLength = courseProgress.lectureProgress.filter(
      (lectureProg) => lectureProg.viewed
    ).length;

    const course = await Course.findById(courseId);

    if (course.lectures.length === lectureProgressLength)
      courseProgress.completed = true;

    await courseProgress.save();

    return res
      .status(200)
      .json({ message: "Lecture Progress Updated Successfully" });
  } catch (error) {
    console.error(error);
  }
};

export const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    let courseProgress = await CourseProgress.findOne({ courseId, userId });
    // If not found, create a new progress record
    if (!courseProgress) {
      courseProgress = new CourseProgress({
        courseId,
        userId,
        lectureProgress: [], // initialize with empty or build from course lectures
        completed: false,
      });
    }

    // Mark all lectures as viewed
    if (courseProgress.lectureProgress?.length > 0) {
      courseProgress.lectureProgress.forEach(
        (lectureProgress) => (lectureProgress.viewed = true)
      );
    }
    courseProgress.completed = true;

    await courseProgress.save();

    return res.status(200).json({ message: "Course Marked As Completed" });
  } catch (error) {
    console.error(error);
  }
};

export const markAsIncomplete = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      return res.status(404).json({ message: "Course Progress Not Found" });
    }
    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = false)
    );
    courseProgress.completed = false;
    await courseProgress.save();
    return res.status(200).json({ message: "Course Marked As Incomplete" });
  } catch (error) {
    console.error(error);
  }
};

export const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?._id; // from isAuthenticated middleware

    // 1. Fetch course with lectures populated
    let course = await Course.findById(courseId)
      .populate("lectures, lectureTitle videoUrl")
      .lean();

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 2. Deduplicate lectures
    course.lectures = course.lectures.filter(
      (v, i, a) =>
        a.findIndex((t) => t._id.toString() === v._id.toString()) === i
    );

    // 3. Fetch progress if user is logged in
    let progress = [];
    let completed = false;
    if (userId) {
      const progressDoc = await CourseProgress.findOne({
        userId: userId.toString(),
        courseId: courseId.toString(),
      }).lean();
      if (progressDoc) {
        progress = progressDoc.lectureProgress || [];
        completed = progressDoc.completed;
      }
    }

    // 4. Send clean response
    return res.json({ data: { courseDetails: course, progress, completed } });
  } catch (error) {
    console.error("Error fetching course details:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
