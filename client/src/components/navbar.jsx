import React, { useEffect } from "react";
import { BrainCircuit, Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

function Navbar() {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const logoutUserHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Logged out successfully");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10 p-2">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex items-center justify-between gap-10 h-full">
        <a href="/">
          <div className="flex items-center gap-2 hover:scale-105">
            <BrainCircuit size={"30"} />
            <h1 className="hidden md:block font-extrabold text-2xl">
              TechLearn
            </h1>
          </div>
        </a>
        {/* User & dark mode icon */}
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="*:data-[slot=avatar]: grayscale">
                  <Avatar className="cursor-pointer w-15 h-12 flex">
                    <AvatarImage
                      className="border-none rounded-md"
                      src={user?.photoUrl || "https://github.com/shadcn.png"}
                      alt="ProfilePhoto"
                    />
                    <AvatarFallback>Profile</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to="my-learning">My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutUserHandler}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/admin/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="w-20 h-10 relative"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                className="w-20 h-10 relative"
                onClick={() => navigate("/login")}
              >
                Sign Up
              </Button>
            </div>
          )}
          {/* Dark Mode Icon */}
          <DarkMode />
        </div>
      </div>
      <div className="flex md:hidden items-center justify-between gap-2 h-full px-4">
        <Link to="/">
          <div className="flex items-center gap-2">
            <BrainCircuit size={"30"} />
            <h1 className="font-extrabold text-2xl">TechLearn</h1>
          </div>
        </Link>
        <MobileNavbar user={user} />
      </div>
    </div>
  );
}

export default Navbar;

{
  /* Mobile Navbar*/
}
const MobileNavbar = ({ user }) => {
  const navigate = useNavigate();

  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();

  const logoutUserHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Logged out successfully");
      navigate("/login");
    }
  }, [isSuccess, data, navigate]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full bg-gray-200 hover:bg-gray-200 cursor-pointer"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="flex flex-row items-center justify-between mt-10">
          <SheetTitle className="font-extrabold text-2xl">
            <Link to="/">TechLearn</Link>
          </SheetTitle>
          <DarkMode />
        </SheetHeader>
        <Separator className="mr-2" />
        <nav className="flex flex-col space-y-4 ml-4">
          <a href="/my-learning">
            <span className="text-lg hover:text-gray-400">My Learning</span>
          </a>
          <a href="/profile">
            <span className="text-lg hover:text-gray-400">My Profile</span>
          </a>
          <span
            onClick={logoutUserHandler}
            className="text-lg cursor-pointer hover:text-gray-400"
          >
            Log out
          </span>
        </nav>
        <Separator className="mr-2" />
        {user?.role === "instructor" && (
          <SheetFooter className="mt-0">
            <Button
              onClick={() => navigate("/admin/dashboard")}
              type="submit"
              className="cursor-pointer"
            >
              Dashboard
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
