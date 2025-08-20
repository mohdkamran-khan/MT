import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

function Course({ course }) {
  return (
    <Link to={`/course-details/${course._id}`}>
      <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-lg overflow-hidden hover:cursor-pointer">
        <div className="relative">
          <img
            src={course.courseThumbnail}
            alt="Course Name"
            className="w-full h-36"
          />
        </div>
        <CardContent className="px-2 py-4 space-y-3">
          <h1 className="hover:underline font-bold text-lg truncate">
            {course.courseTitle}
          </h1>
          <div className="flex items-center justify-evenly">
            <div className="*:data-[slot=avatar]: grayscale">
              <Avatar className="w-10 h-10 flex">
                <AvatarImage
                  className="border-none rounded-md"
                  src={
                    course.instructor?.photoUrl ||
                    "https://github.com/shadcn.png"
                  }
                  alt="@shadcn"
                />
                <AvatarFallback>Educator</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {course.instructor?.name}
            </span>
            <Badge className="px-2 py-1 text-sm">{course.courseLevel}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">₹{course.coursePrice}</span>
            <span className="text-sm text-gray-500">Duration: 2 hours</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default Course;
