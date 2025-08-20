import { useGetCourseDetailsWithStatusQuery } from "@/features/api/purchaseApi";
import { Navigate, useParams } from "react-router-dom";

const PurchasedCourseProtectedRoute = ({ children }) => {
  const { courseId } = useParams();
  const { data, isLoading } = useGetCourseDetailsWithStatusQuery(courseId);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return data?.purchased ? (
    children
  ) : (
    <Navigate to={`/course-details/${courseId}`} />
  );
};

export default PurchasedCourseProtectedRoute;
