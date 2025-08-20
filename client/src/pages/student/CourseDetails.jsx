import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailsWithStatusQuery } from "@/features/api/purchaseApi";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetails = () => {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const { data, isLoading, isError } =
    useGetCourseDetailsWithStatusQuery(courseId);

  const [currentLecture, setCurrentLecture] = useState(null);

  const lectures = useMemo(() => {
    if (!data?.course?.lectures) return [];
    const seen = new Set();
    return data.course.lectures.filter((lec) => {
      const key = lec._id || lec.lectureTitle; // use _id if available, fallback to title
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data]);

  useEffect(() => {
    if (lectures.length > 0) {
      setCurrentLecture(lectures[0]); // default first lecture
    }
  }, [lectures]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    return <h1>Failed to load course details</h1>;
  }

  const { course, purchased } = data;

  const canPlay = (lecture) => {
    if (purchased) return true; // all unlocked if purchased
    return lecture.isPreviewFree === true; // only free previews if not purchased
  };

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  return (
    <div className="mt-6 space-y-5">
      {/* Course Header */}
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">
            {course?.courseTitle}
          </h1>
          <p className="text-base md:text-lg">{course?.courseSubTitle}</p>
          <p>
            Instructor:{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course?.instructor.name}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated: {course?.createdAt.split("T")[0]}</p> | |
            <p>Students Enrolled: {course.enrolledStudents.length}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto mt-8 my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        {/* Left side - description & lectures */}
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: course.description }}
          />

          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>{lectures.length} Lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {lectures.map((lecture, index) => (
                <div
                  key={lecture._id || index}
                  className={`flex items-center gap-3 text-sm cursor-pointer ${
                    canPlay(lecture)
                      ? "hover:text-blue-600"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (canPlay(lecture)) {
                      setCurrentLecture(lecture);
                    }
                  }}
                >
                  <span>
                    {canPlay(lecture) ? (
                      <PlayCircle size={14} />
                    ) : (
                      <Lock size={14} />
                    )}
                  </span>
                  <p>{lecture.lectureTitle}</p>
                  {!canPlay(lecture) && (
                    <span className="ml-2 text-xs">(Locked)</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right side - video & buy section */}
        <div className="w-full lg:w-1/3 mt-2">
          <Card>
            <CardContent className="flex flex-col p-4">
              {currentLecture && (
                <>
                  <div className="w-full aspect-video mb-4 relative">
                    {canPlay(currentLecture) ? (
                      <ReactPlayer
                        url={currentLecture.videoUrl?.replace(
                          "http://",
                          "https://"
                        )}
                        controls
                        width="100%"
                        height="100%"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gray-800 text-white rounded-lg">
                        <p className="text-center">
                          🔒 This lecture is locked. <br />
                          Please purchase the course to unlock.
                        </p>
                      </div>
                    )}
                  </div>
                  <h1 className="font-semibold text-lg">
                    {currentLecture.lectureTitle}
                  </h1>
                  <Separator className="my-2" />
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-evenly">
              <div className="flex space-x-10">
                <h1 className="text-lg md:text-xl font-semibold">
                  ₹{course.coursePrice}
                </h1>
                {purchased ? (
                  <Button onClick={handleContinueCourse} className="w-3xs">
                    Continue Learning
                  </Button>
                ) : (
                  <Button className="w-3xs">
                    <BuyCourseButton courseId={courseId} />
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
