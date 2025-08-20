import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";

const EditCourse = () => {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl">Add Course Details</h1>
        <Link to="lectures">
          <Button
            className="hover:text-gray-700 transform hover:scale-105 hover:dark:text-gray-400"
            variant="link"
          >
            Go To Lectures &gt;
          </Button>
        </Link>
      </div>
      <CourseTab />
    </div>
  );
};

export default EditCourse;
