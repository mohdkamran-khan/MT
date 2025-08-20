import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Lecture = ({ lecture, index, courseId }) => {
  const navigate = useNavigate();
  const goToUpdateLecture = () => {
    navigate(`${lecture._id}`);
  };

  return (
    <div className="flex items-center justify-between bg-[#eff3f4cc] dark:bg-[#1F1F1F] px-4 py-3 rounded-md my-3">
      <h1 className="font-bold text-gray-800 dark:text-gray-100">
        Lecture -{index + 1}: {lecture.lectureTitle}
      </h1>
      <Edit
        size={20}
        onClick={goToUpdateLecture}
        className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-500"
      />
    </div>
  );
};

export default Lecture;
