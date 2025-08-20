import Course from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMedia, deleteVideo, uploadMedia } from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res
        .status(400)
        .json({ message: "Course Title and Category are required" });
    }

    const course = await Course.create({
      courseTitle,
      category,
      instructor: req.id,
    });
    return res
      .status(201)
      .json({ course, message: "Course created successfully" });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({ message: "Error creating course", error });
  }
};

export const searchCourse = async (req, res) => {
  try {
    const { query = "", categories = [], sortByPrice = "" } = req.query;

    //create search query
    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { courseSubTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };

    //if categories selected
    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }

    //define sorting order
    const sortOptions = {};
    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1; //sort by price in ascending
    } else if (sortByPrice === "high") {
      sortOptions.coursePrice = -1; //descending
    }

    let courses = await Course.find(searchCriteria)
      .populate({ path: "instructor", select: "name photoUrl" })
      .sort(sortOptions);
    return res.status(200).json({ success: true, courses: courses || [] });
  } catch (error) {
    console.error(error);
  }
};

export const getPublishedCourse = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "instructor",
      select: "name photoUrl",
    });
    if (!courses) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to get published courses",
    });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ instructor: userId });
    if (!courses) {
      return res.status(404).json({
        courses: [],
        message: "No Courses Found",
        error,
      });
    }
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({ message: "Error creating course", error });
  }
};

export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const publish = req.query.publish;
    const {
      courseTitle,
      courseSubTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course Not Found",
      });
    }
    if (publish !== undefined) {
      course.isPublished = publish === "true";
      await course.save();
      const statusMessage = course.isPublished ? "Published" : "Unpublished";
      return res.status(200).json({
        message: `Course is ${statusMessage}`,
      });
    }
    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMedia(publicId);
      }
      courseThumbnail = await uploadMedia(thumbnail.path);
    }

    const updateData = {
      courseTitle,
      courseSubTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };
    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res.status(200).json({
      course,
      message: "Course Updated Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error editing course" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    return res.status(200).json({
      course,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to get course by Id",
    });
  }
};

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.ststus(400).json({
        message: "Lecture title is required",
      });
    }

    const lecture = await Lecture.create({ lectureTitle });
    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(201).json({
      lecture,
      message: "Lecture Created Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create lecture",
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    return res.status(200).json({
      lectures: course.lectures,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to get lecture",
    });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, isPreviewFree, videoInfo } = req.body;
    const { courseId, lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }
    //update lecture
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    const course = await Course.findById(courseId);
    if (course && course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(200).json({
      lecture,
      message: "Lecture Updated Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to update lecture",
    });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }
    //delete lecture from cloudinary
    if (lecture.publicId) {
      await deleteVideo(lecture.publicId);
    }

    //delete lecture from related course
    await Course.updateOne(
      { lectures: lectureId }, //find related course
      { $pull: { lectures: lectureId } } //remove lecture id from course
    );
    return res.status(200).json({
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to delete lecture",
    });
  }
};

export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }
    return res.status(200).json({
      lecture,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to get lecture by Id",
    });
  }
};

//publish course
export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query; //Boolean
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    //publish status
    course.isPublished = publish === "true";
    await course.save();
    const statusMessage = course.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      message: `Course is ${statusMessage}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to publish lecture",
    });
  }
};
