import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import {
  useLoadUserQuery,
  useUpdateProfileMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";

function Profile() {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const { data, isLoading, refetch } = useLoadUserQuery();
  const [
    updateProfile,
    { data: updatedUser, isLoading: isUpdating, error, isSuccess, isError },
  ] = useUpdateProfileMutation();

  const user = data && data.user;

  useEffect(() => {
    refetch();
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(updatedUser?.message || "Profile updated successfully");
    }
    if (isError) {
      toast.error(error?.message || "Failed to update profile");
    }
  }, [error, updatedUser, isSuccess, isError]);

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
    }
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);
    await updateProfile(formData);
  };

  if (isLoading) {
    return (
      <>
        <Loader2 className="py-40 px-25 h-30 w-30 animate-spin" />
        <span className="text-2xl px-25 py-40 font-semibold">
          Loading Profile...
        </span>
      </>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 my-7">
      <h1 className="text-2xl font-bold text-center md:text-left">
        <u>MY PROFILE</u>
      </h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5 mt-12">
        <div className="flex flex-row items-center gap-7">
          <div className="*:data-[slot=avatar]: grayscale">
            <Avatar className="w-24 h-24 md:w-40 md:h-40 mb-4 flex">
              <AvatarImage
                className="border-none rounded-md"
                src={user?.photoUrl || "https://github.com/shadcn.png"}
                alt="User Image"
              />
              <AvatarFallback>Profile</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div>
          <div className="mb-2 flex">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Name:
            </h1>
            <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
              {user.name}
            </span>
          </div>
          <div className="mb-2 flex">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Email:
            </h1>
            <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
              {user.email}
            </span>
          </div>
          <div className="mb-2 flex">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Role:
            </h1>
            <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
              {user.role.toUpperCase()}
            </span>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-2">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name:</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="col-span-3 border border-gray-300 rounded-md p-2 py-5"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo:</Label>
                  <Input
                    onChange={onChangeHandler}
                    type="file"
                    accept="image/*"
                    className="col-span-3 border border-gray-300 rounded-md py-2 px-2 h-11"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button disabled={isUpdating} onClick={updateUserHandler}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Please Wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="border-t border-gray-300 my-8"></div>
      <div>
        <h1 className="text-2xl font-bold text-center md:text-left">
          <u>MY COURSES</u>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-5">
          {user.enrolledCourses.length > 0 ? (
            user.enrolledCourses.map((course) => (
              <Course course={course} key={course._id} />
            ))
          ) : (
            <>
              <h1 className="col-span-3 text-center text-3xl">
                Not enrolled in a course yet.
              </h1>
              <p className="col-span-3 text-center text-lg hover:scale-105">
                <a href="/" className="text-gray-600 ">
                  <u>Explore Courses...</u>
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
