import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex">
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r-gray-300 dark:border-gray-700 bg-[#f0f0f0] dark:bg-[#141414] p-5 sticky top-0 h-screen">
        <div className="space-y-6 mt-6 ml-6">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 transform *:hover:scale-105 transition-transform duration-200 text-xl"
          >
            <ChartNoAxesColumn size={22} />
            <h1>Dashboard</h1>
          </Link>
          <div className="border-t border-gray-300 my-8"></div>
          <Link
            to="/admin/courses"
            className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 transform *:hover:scale-105 transition-transform duration-200 text-xl"
          >
            <SquareLibrary size={22} />
            <h1>Courses</h1>
          </Link>
        </div>
      </div>
      <div className="flex-1 md:p-10 p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
