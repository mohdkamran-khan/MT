import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { toast } from "sonner";

const CreateCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const [createCourse, { data, error, isSuccess, isLoading }] =
    useCreateCourseMutation();

  const navigate = useNavigate();

  const getSelectedCategory = (value) => {
    setCategory(value);
  };
  const createCourseHandler = async () => {
    await createCourse({ courseTitle, category });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course Created Successfully");
      navigate("/admin/courses");
    }
  }),
    [isSuccess, error];

  return (
    <div className="flex-1 mx-10 my-8">
      <div className="mb-5">
        <h1 className="font-bold text-xl">Create A New Course</h1>
        <p className=" text-sm text-gray-600">
          Add details below to create a new course.
        </p>
      </div>
      <div className="space-y-4 ">
        <div className="mb-6">
          <Label className="mb-3 text-lg">Title</Label>
          <Input
            type="text"
            name="courseTitle"
            placeholder="Enter Course Name"
            className="h-10"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
          ></Input>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="mb-3 text-lg">Catergory</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="AI/ML">AI/ML</SelectItem>
                <SelectItem value="Backend Development">
                  Backend Development
                </SelectItem>
                <SelectItem value="C/C++">C/C++</SelectItem>
                <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                <SelectItem value="DataScience">DataScience</SelectItem>
                <SelectItem value="Docker">Docker</SelectItem>
                <SelectItem value="Frontend Development">
                  Frontend Development
                </SelectItem>
                <SelectItem value="Fullstack Development">
                  Fullstack Development
                </SelectItem>
                <SelectItem value="Fullstack Java">Fullstack Java</SelectItem>
                <SelectItem value="HTML/CSS">HTML/CSS</SelectItem>
                <SelectItem value="Javascript">Javascript</SelectItem>
                <SelectItem value="MERN Stack Development">
                  MERN Stack Development
                </SelectItem>
                <SelectItem value="MongoDB">MongoDB</SelectItem>
                <SelectItem value="MySQL">MySQL</SelectItem>
                <SelectItem value="NextJS">Next JS</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-6 mt-8 ">
          <Button
            variant="outline"
            className="w-24 h-11"
            onClick={() => navigate("/admin/courses")}
          >
            Cancel
          </Button>
          <Button
            className="w-40 h-11"
            disabled={isLoading}
            onClick={createCourseHandler}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-0 h-4 w-4 animate-spin" />
                Creating Course...
              </>
            ) : (
              "Create Course"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
