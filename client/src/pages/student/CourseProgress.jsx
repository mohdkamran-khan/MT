import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useGetCourseProgressQuery,
  useMarkCompleteCourseMutation,
  useMarkIncompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCheck, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;

  const { data, isLoading, isError, error, refetch } =
    useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [
    markCompleteCourse,
    { data: markCompleteData, isSuccess: completedSuccess },
  ] = useMarkCompleteCourseMutation();
  const [
    markIncompleteCourse,
    { data: markIncompleteData, isSuccess: incompletedSuccess },
  ] = useMarkIncompleteCourseMutation();

  const [currentLecture, setCurrentLecture] = useState(null);

  useEffect(() => {
    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData.message);
    }
    if (incompletedSuccess) {
      refetch();
      toast.success(markIncompleteData.message);
    }
  }, [completedSuccess, incompletedSuccess]);

  const courseData = data?.data;
  const courseDetails = courseData?.courseDetails;
  const progress = courseData?.progress || [];
  const completed = courseData?.completed || false;

  // don’t destructure courseDetails until you know it exists
  const initialLecture =
    currentLecture ||
    (courseDetails?.lectures?.length > 0 ? courseDetails.lectures[0] : null);

  const uniqueLectures = courseDetails?.lectures
    ? Array.from(
        new Map(courseDetails.lectures.map((lec) => [lec._id, lec])).values()
      )
    : [];

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };
  //handle selected lecture to watch
  const handleSelectedLecture = (lecture) => {
    setCurrentLecture(lecture);
    //handleLectureProgress(lecture._id);
  };

  const handleCourseCompleted = async () => {
    await markCompleteCourse(courseId);
  };

  const handleCourseIncomplete = async () => {
    await markIncompleteCourse(courseId);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Failed to load course details</p>;
  }
  if (!courseDetails) {
    return <p>No course details found</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between mb-4 mt-1 ml-2">
        <h1 className="text-3xl font-bold mt-2 underline">
          {courseDetails.courseTitle}
        </h1>
        <Button
          className="cursor-pointer h-10"
          onClick={completed ? handleCourseIncomplete : handleCourseCompleted}
          variant={completed ? "outline" : "default"}
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCheck className="h-4 w-4 mr-2" />
              <span>Completed</span>
            </div>
          ) : (
            "Mark As Complete"
          )}
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            <video
              src={currentLecture?.videoUrl || initialLecture.videoUrl}
              controls
              className="w-full h-auto md:rounded-lg"
              onEnded={() => {
                if (currentLecture?._id || initialLecture?._id) {
                  handleLectureProgress(
                    currentLecture?._id || initialLecture._id
                  );
                }
              }}
            />
          </div>
          <div className="mt-2">
            <h3 className="font-medium text-lg mt-4 mb-1">{`Lecture: ${
              courseDetails.lectures.findIndex(
                (lec) => lec._id === (currentLecture?._id || initialLecture._id)
              ) + 1
            } : ${
              currentLecture?.lectureTitle || initialLecture.lectureTitle
            }`}</h3>
          </div>
        </div>
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4 mt-4 underline">
            Course Lectures
          </h2>
          <div className="space-y-4 flex-1 overflow-y-auto">
            {uniqueLectures.map((lecture) => (
              <Card
                key={lecture._id}
                className={`mb-3 cursor-pointer transition transform ${
                  lecture._id === currentLecture?._id
                    ? "bg-gray-200 dark:bg-gray-600"
                    : ""
                }`}
                onClick={() => handleSelectedLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-1">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2
                        size={24}
                        className="text-green-500 mr-2 ml-2"
                      />
                    ) : (
                      <CirclePlay
                        size={24}
                        className="text-gray-500 mr-2 ml-2"
                      />
                    )}
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {lecture.lectureTitle}
                      </CardTitle>
                    </div>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge
                      className="ml-2 mr-2 bg-green-100 text-green-600 h-7 w-20"
                      variant="outline"
                    >
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default CourseProgress;
