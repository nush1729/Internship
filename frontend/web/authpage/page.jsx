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
import { Eye, EyeOff, FileUp, BarChart3, Presentation } from "lucide-react";
import { handleLogin, handleSignup, handleGoogleLogin } from "@/services/api";
import { useNavigate } from "react-router-dom";
import Aurora from "@/components/ui/aurora";
import GradientText from "@/components/ui/gradienttext";

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
    <div className="relative min-h-screen w-full bg-[#0a0a23] text-white overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40 h-full">
        <Aurora
          colorStops={["#0038ff", "#00d4ff", "#002233"]}
          amplitude={0.8}
          blend={1}
        />
      </div>
      <div className="absolute inset-0 z-0 opacity-40 scale-y-[-1]">
        <Aurora
          colorStops={["#0038ff", "#00d4ff", "#002233"]}
          amplitude={0.8}
          blend={1}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
        {/* Top Content Section */}
        <div className="w-full max-w-4xl text-center mb-12">
          <GradientText
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4"
            colors={["#00ffff", "#66D9EF", "#b8e2f4"]}
          >
            Excel Analytics
          </GradientText>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Drag, drop, and visualize. Instantly generate interactive 2D & 3D
            charts from your Excel data — no coding required.
          </p>
          <div className="flex justify-center items-center gap-8 mt-8 text-slate-400">
            <div className="flex items-center gap-2">
              <FileUp className="w-5 h-5 text-cyan-400" />
              <span>Instant Upload</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <span>2D & 3D Charts</span>
            </div>
            <div className="flex items-center gap-2">
              <Presentation className="w-5 h-5 text-cyan-400" />
              <span>Easy Sharing</span>
            </div>
          </div>
        </div>

        {/* Auth Card Section */}
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-lg border border-blue-900/50 rounded-xl py-8 px-4 shadow-2xl shadow-blue-500/10">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full px-4"
          >
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 text-slate-400 border border-slate-700 rounded-lg mb-6">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-slate-700/50 data-[state=active]:text-cyan-300 data-[state=active]:shadow-md rounded-md"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-slate-700/50 data-[state=active]:text-cyan-300 data-[state=active]:shadow-md rounded-md"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl text-white font-bold">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-slate-400 mt-2">
                  Sign in to access your dashboard
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
                    <Label htmlFor="login-email" className="text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400"
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
                    <Label htmlFor="login-password" className="text-slate-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 pr-10 focus:border-cyan-400"
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
                        className="absolute right-0 top-0 h-full px-3 py-2 text-slate-400 hover:bg-slate-700/50 hover:text-white"
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
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 rounded-lg transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </form>
                <Separator className="my-6 bg-slate-700" />
                <Button
                  onClick={initiateGoogleLogin}
                  disabled={googleLoading}
                  className="w-full bg-slate-800/50 hover:bg-slate-700/50 text-white font-bold border border-slate-700 py-2 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  {googleLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl text-white font-bold">
                  Create an Account
                </CardTitle>
                <CardDescription className="text-slate-400 mt-2">
                  Join now and start visualizing
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
                      <Label htmlFor="first-name" className="text-slate-300">
                        First name
                      </Label>
                      <Input
                        id="first-name"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400"
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
                      <Label htmlFor="last-name" className="text-slate-300">
                        Last name
                      </Label>
                      <Input
                        id="last-name"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400"
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
                    <Label htmlFor="signup-email" className="text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400"
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
                    <Label
                      htmlFor="signup-password"
                      className="text-slate-300"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 pr-10 focus:border-cyan-400"
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
                        className="absolute right-0 top-0 h-full px-3 py-2 text-slate-400 hover:bg-slate-700/50 hover:text-white"
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
                    <Label
                      htmlFor="confirm-password"
                      className="text-slate-300"
                    >
                      Confirm password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 pr-10 focus:border-cyan-400"
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
                        className="absolute right-0 top-0 h-full px-3 py-2 text-slate-400 hover:bg-slate-700/50 hover:text-white"
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
                    className="w-full font-bold py-2 rounded-lg transition-all duration-300 bg-cyan-500 hover:bg-cyan-600 text-black"
                  >
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}