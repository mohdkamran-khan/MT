import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useGetCreatorCoursesQuery } from "@/features/api/courseApi";
import { Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CourseList = () => {
  const { data, isLoading, refetch } = useGetCreatorCoursesQuery();

  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div>
      <Button
        onClick={() => navigate(`create`)}
        className="mb-3 mt-3 h-12 w-32"
      >
        Create Course
      </Button>
      <div className="border-t border-gray-300 my-8"></div>
      <Table>
        <TableCaption>List of all your courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="w-[100px]">Price(₹)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell>{course.courseTitle}</TableCell>
              <TableCell className="font-medium">
                {course?.coursePrice || "N/A"}
              </TableCell>
              <TableCell>
                <Badge
                  className="h-7 w-22"
                  variant={course?.isPublished ? "success" : "destructive"}
                >
                  {course?.isPublished ? "Published" : "Unpublished"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  className="w-20"
                  onClick={() => navigate(`${course._id}`)}
                >
                  <Edit />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseList;
