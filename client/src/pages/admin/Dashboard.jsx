import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  const { data, isSuccess, isError, isLoading } =
    useGetAllPurchasedCoursesQuery();

  if (isLoading) return <h1>Loading...</h1>;
  if (isError)
    return <h1 className="text-red-500">Failed to get purchased courses</h1>;

  //destructure from data
  const purchasedCourses = data?.data || [];

  const courseData = purchasedCourses.map((purchase) => ({
    name: purchase.courseId.courseTitle,
    price: purchase.courseId.coursePrice,
  }));

  const totalRevenue = purchasedCourses.reduce(
    (acc, element) => acc + (element.amount || 0),
    0
  );
  const totalSales = purchasedCourses.length;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 sm:mt- md:mt-0">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Courses Sold</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
            {totalSales}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
            ₹{totalRevenue}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Course Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                angle={-30} //rotated label for better visuals
                textAnchor="end"
                interval={0} //display all labels
              />
              <YAxis stroke="#6b7280" />
              <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4a90e2"
                strokeWidth={3}
                dot={{ stroke: "#4a90e2", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
