import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PROGRESS_API = "http://localhost:8080/api/progress";

export const courseProgressApi = createApi({
  reducerPath: "courseProgressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PROGRESS_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getCourseDetails: builder.query({
      query: (courseId) => ({
        url: `/${courseId}/details`,
        method: "GET",
      }),
    }),
    getCourseProgress: builder.query({
      query: (courseId) => ({
        url: `/${courseId}/progress`,
        method: "GET",
      }),
    }),
    updateLectureProgress: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lectures/${lectureId}/view`,
        method: "POST",
      }),
    }),
    markCompleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/complete`,
        method: "POST",
      }),
    }),
    markIncompleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/incomplete`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
  useMarkCompleteCourseMutation,
  useMarkIncompleteCourseMutation,
  useGetCourseDetailsQuery,
} = courseProgressApi;
