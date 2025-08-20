import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const [createLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();
  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
    refetch,
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    await createLecture({ lectureTitle, courseId });
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      setLectureTitle(""); // clear input after success
      toast.success(data?.message || "Lecture Created Successfully");
    }
    if (error) {
      toast.error(error?.data?.message || "Error Creating Lecture");
    }
  }, [isSuccess, error, data, refetch]);

  // ✅ Deduplicate lectures
  const uniqueLectures = useMemo(() => {
    if (!lectureData?.lectures) return [];
    const seen = new Set();
    return lectureData.lectures.filter((lec) => {
      if (seen.has(lec._id)) return false;
      seen.add(lec._id);
      return true;
    });
  }, [lectureData]);

  return (
    <div className="flex-1 mx-10 my-8">
      <div className="mb-5">
        <h1 className="font-bold text-xl mb-3">
          Update Lectures In Your Course
        </h1>
        <p className=" text-sm text-gray-600">
          Add or delete lectures in your course.
        </p>
      </div>
      <div className="space-y-4 ">
        <div className="mb-6">
          <Label className="mb-3 text-lg">Title</Label>
          <Input
            type="text"
            name="courseTitle"
            placeholder="Enter Lecture Name"
            className="h-10"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-6 mt-8 ">
          <Button
            variant="outline"
            className="w-30 h-11"
            onClick={() => navigate(`/admin/courses/${courseId}`)}
          >
            Back to course
          </Button>
          <Button
            className="w-42 h-11"
            disabled={isLoading}
            onClick={createLectureHandler}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-0 h-4 w-4 animate-spin" />
                Adding Lecture...
              </>
            ) : (
              "Add Lecture"
            )}
          </Button>
        </div>

        <div className="border-t border-gray-300 my-8"></div>

        <div className="mt-10">
          {lectureLoading ? (
            <p>Loading lectures...</p>
          ) : lectureError ? (
            <p>Failed to load lectures</p>
          ) : uniqueLectures.length === 0 ? (
            <p>No lecture available</p>
          ) : (
            uniqueLectures.map((lecture, index) => (
              <Lecture
                key={lecture._id}
                lecture={lecture}
                courseId={courseId}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
