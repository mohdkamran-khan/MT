import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/courses/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  return (
    <div className="relative bg-gradient-to-r from-gray-900 to-gray-500 dark:from-gray-600 dark:to-gray-900 py-16 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-4xl font-bold mb-6 mt-7">
          Empowering You Through Technology
        </h1>
        <p className="text-gray-200 dark:text-gray-400 text-lg mb-8">
          Learn and Upskill With Our Innovative Platform
        </p>

        <form
          onSubmit={searchHandler}
          className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-0"
        >
          <Input
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            className="flex-grow border-none focus-visible:ring-0 px-6 py-6 text-gray-900 placeholder:text-gray-400  dark:text-gray-500 rounded-l-full"
            placeholder="Search for courses, topics, or skills..."
          />

          <Button
            type="submit"
            className="bg-black dark:bg-gray-800 text-white rounded-r-full px-6 py-6 hover:bg-gray-900 dark:hover:bg-gray-700"
          >
            Search
          </Button>
        </form>
        <Button
          onClick={() => navigate(`/courses/search?query`)}
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-full px-5 py-5 mt-8 mb-0 hover:bg-gray-400 hover:dark:bg-gray-700"
        >
          Explore All Courses
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
