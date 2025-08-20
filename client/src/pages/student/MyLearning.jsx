import React from "react";
import Course from "./Course";
import { useLoadUserQuery } from "@/features/api/authApi";

function MyLearning() {
  const { data, isLoading } = useLoadUserQuery();
  const myLearning = data?.user.enrolledCourses || [];

  return (
    <div className="max-w-7xl mx-auto my-10 px-4 md:px-6 ml-4">
      <h1 className="text-2xl font-bold">My Courses</h1>
      <p className="text-gray-600 mt-4 dark:text-gray-400">
        Here you can find all the courses you are enrolled in.
      </p>
      <div className="my-5 mt-4">
        {isLoading ? (
          <MyLearningSkeleton />
        ) : myLearning.length === 0 ? (
          <div className="border-t border-gray-200 mt-4 pt-4">
            <h1 className="text-4xl font-bold">
              You are not enrolled in any course yet.
            </h1>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {myLearning.map((course, index) => (
              <Course key={index} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyLearning;

// Skeleton loader for My Learning page
const MyLearningSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="h-40 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4 animate-pulse"
        ></div>
      ))}
    </div>
  );
};
