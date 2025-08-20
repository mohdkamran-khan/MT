import Navbar from "@/components/navbar";
import React from "react";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 mt-16">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
