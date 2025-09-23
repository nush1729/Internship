"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { handleLogin, handleSignup, handleGoogleLogin } from "@/services/api";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    setGoogleLoading(true);
    try {
      await handleGoogleLogin(response, navigate);
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const initiateGoogleLogin = () => {
    if (window.google && window.google.accounts) {
      setGoogleLoading(true);
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            const buttonDiv = document.getElementById("google-signin-button");
            if (buttonDiv) {
              buttonDiv.innerHTML = "";
              window.google.accounts.id.renderButton(buttonDiv, {
                theme: "outline",
                size: "large",
                width: "100%",
                text: "continue_with",
                shape: "rectangular",
              });
              buttonDiv.style.display = "block";
            }
          }
          setGoogleLoading(false);
        });
      } catch (error) {
        console.error("Google Sign-In error:", error);
        setGoogleLoading(false);
      }
    } else {
      console.error("Google Sign-In not loaded");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gray-100 overflow-hidden text-gray-800">
      <div className="absolute inset-0 z-0 h-full bg-gradient-to-br from-white via-gray-50 to-blue-100"></div>
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen items-center justify-center lg:p-8">
        <div className="flex-1 flex items-center justify-center p-12">
            <div className="max-w-md text-left space-y-8">
              <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-gray-900">
                <span className="block">Visualize Instantly.</span>
                <span className="block bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text px-2 py-1 rounded-md inline-block">
                  Excel Analytics.
                </span>
              </h1>
              <div className="space-y-10 mt-10">
                <div className="animate-float" style={{ animationDelay: '0s' }}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-9 h-9 flex items-center justify-center rounded-md bg-blue-100 border border-blue-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-3 text-blue-600"><path d="M3 3v18h18" /><path d="M18 17v-6" /><path d="M13 17V9" /><path d="M8 17V5" /></svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Instant Excel Upload
                    </h2>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Drag and drop your Excel files to immediately begin exploring data. Our platform parses sheets and prepares it for fast visual analysis.
                  </p>
                </div>
                <div className="animate-float" style={{ animationDelay: '0.5s' }}>
                   <div className="flex items-center space-x-3 mb-3">
                    <div className="w-9 h-9 flex items-center justify-center rounded-md bg-indigo-100 border border-indigo-200">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-presentation-chart text-indigo-600"><path d="M2 3h20" /><path d="M4 3v13a8 8 0 0 0 16 0V3" /><path d="M12 12v5" /><path d="M8 12v3" /><path d="M16 12v2" /></svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      2D & 3D Chart Builder
                    </h2>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Instantly generate interactive 2D and 3D visualizations from your data — no coding required. Customize and share with ease.
                  </p>
                </div>
              </div>
            </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl py-8 px-4 shadow-lg">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full px-4"
              >
                <TabsList className="grid w-full grid-cols-2 bg-gray-200 text-gray-500 border border-gray-300 rounded-lg mb-6">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md rounded-lg"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md rounded-lg"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl text-gray-800 font-bold">
                      Welcome back
                    </CardTitle>
                    <CardDescription className="text-gray-500 mt-2">
                      Sign in to access your data visualizations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin(loginData, navigate);
                      }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          className="bg-white"
                          placeholder="your.email@example.com"
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="bg-white pr-10"
                            onChange={(e) =>
                              setLoginData({
                                ...loginData,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 hover:bg-gray-100"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-all duration-300"
                      >
                        Sign In
                      </Button>
                    </form>
                    <Separator className="my-6" />
                    <Button
                      onClick={initiateGoogleLogin}
                      disabled={googleLoading}
                      className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold border border-gray-300 py-2 rounded-lg transition-all duration-300 disabled:opacity-50"
                    >
                      {googleLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800 mr-2"></div>
                          Signing in...
                        </div>
                      ) : (
                        "Continue with Google"
                      )}
                    </Button>
                    <div
                      id="google-signin-button"
                      className="w-full mt-2"
                      style={{ display: "none" }}
                    ></div>
                  </CardContent>
                </TabsContent>
                <TabsContent value="signup">
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl text-gray-800 font-bold">
                      Create account
                    </CardTitle>
                    <CardDescription className="text-gray-500 mt-2">
                      Start visualizing your Excel data today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSignup({ ...signupData, role: "user" }, navigate);
                      }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First name</Label>
                          <Input
                            id="first-name"
                            className="bg-white"
                            placeholder="John"
                            value={signupData.firstName}
                            onChange={(e) =>
                              setSignupData({
                                ...signupData,
                                firstName: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last name</Label>
                          <Input
                            id="last-name"
                            className="bg-white"
                            placeholder="Doe"
                            value={signupData.lastName}
                            onChange={(e) =>
                              setSignupData({
                                ...signupData,
                                lastName: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          className="bg-white"
                          placeholder="your.email@example.com"
                          value={signupData.email}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="bg-white pr-10"
                            value={signupData.password}
                            onChange={(e) =>
                              setSignupData({
                                ...signupData,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 hover:bg-gray-100"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirm password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="bg-white pr-10"
                            value={signupData.confirmPassword}
                            onChange={(e) =>
                              setSignupData({
                                ...signupData,
                                confirmPassword: e.target.value,
                              })
                            }
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 hover:bg-gray-100"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full font-bold py-2 rounded-lg transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Create Account
                      </Button>
                    </form>
                    <Separator className="my-6" />
                    <Button
                      onClick={initiateGoogleLogin}
                      disabled={googleLoading}
                      className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold border border-gray-300 py-2 rounded-lg transition-all duration-300 disabled:opacity-50"
                    >
                      {googleLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800 mr-2"></div>
                          Signing in...
                        </div>
                      ) : (
                        "Continue with Google"
                      )}
                    </Button>
                  </CardContent>
                </TabsContent>
              </Tabs>
              <div
                id="google-signin-button"
                className="w-full mt-2"
                style={{ display: "none" }}
              ></div>
            </Card>
        </div>
      </div>
    </div>
  );
}