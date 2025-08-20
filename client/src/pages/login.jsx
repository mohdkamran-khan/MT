import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import {
  useRegisterUserMutation,
  useLoginUserMutation,
} from "@/features/api/authApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });

  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginLoading,
      isSuccess: loginSuccess,
    },
  ] = useLoginUserMutation();
  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerLoading,
      isSuccess: registerSuccess,
    },
  ] = useRegisterUserMutation();

  const navigate = useNavigate();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };
  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    //console.log(inputData);
    const action = type === "signup" ? registerUser : loginUser;
    await action(inputData);
  };

  useEffect(() => {
    if (registerSuccess && registerData) {
      toast.success(registerData.message || "Signup successful");
    }
    if (registerError) {
      toast.error(registerError.data.message || "Signup failed");
    }
    if (loginError) {
      toast.error(loginError.data.message || "Login failed");
    }
    if (loginSuccess && loginData) {
      toast.success(loginData.message || "Login successful");
      navigate("/"); // Redirect to home page after successful login
    }
  }, [
    loginLoading,
    registerLoading,
    loginData,
    registerData,
    loginError,
    registerError,
  ]);

  return (
    <div className="flex w-full items-center justify-center h-screen">
      <Tabs defaultValue="login" className="w-[400px] h-[550px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Create a new account and click signup when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">
                  Name<sup style={{ color: "#fc0303ff" }}>*</sup>
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={signupInput.name}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">
                  E-mail<sup style={{ color: "#fc0303ff" }}>*</sup>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={signupInput.email}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">
                  Password<sup style={{ color: "#fc0303ff" }}>*</sup>
                </Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={signupInput.password}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="muted" style={{ color: "#6c757d", opacity: 0.8 }}>
                <sup style={{ color: "#fc0303ff" }}>*</sup> Required fields
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={registerLoading}
                onClick={() => handleRegistration("signup")}
              >
                {registerLoading ? (
                  <span>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing up...Please Wait
                  </span>
                ) : (
                  "Signup"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Enter E-mail</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={loginInput.email}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Enter password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={loginLoading}
                onClick={() => handleRegistration("login")}
              >
                {loginLoading ? (
                  <span>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...Please Wait
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default Login;
