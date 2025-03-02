"use client"

import * as React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface RegistrationData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [fullName, setfullName] = useState("") // Changed setName to setfullName for clarity
  const [userType, setUserType] = useState<"parent-dash" | "parent">("parent")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      setLoading(true)
  
      // Construct the URL with query parameters
      const response = await fetch(
        `http://localhost:8080/public/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
          method: "POST", // Use GET because the backend expects query parameters
        }
      )
  
      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.")
      }
  
      const data = await response.json()
  
      // Store user data in localStorage or sessionStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...data,
          userType,
        })
      )
  
      // Redirect based on user type
      if (userType === "parent") {
        router.push("/home")
      } else {
        router.push("/parent-dashboard")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const registrationData: RegistrationData = {
      fullName,
      username,
      email,
      password,
      role: "USER", // Set default role to "USER" and not taking input from form
    };

    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:8080/public/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      })

      if (!response.ok) {
        throw new Error("Registration failed. Please try again.")
      }

      // Registration successful
      setIsLogin(true)
      setError("Registration successful! Please log in.");
      resetForm();
    } catch (err) {
      console.error("Registration error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setUsername("")
    setPassword("")
    setEmail("")
    setfullName("") // Changed setName to setfullName for clarity
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
      <div className="absolute inset-0 bg-grid-white/10 bg-grid-8 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>

      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Lets Get Started by knowing you</CardTitle>
          <CardDescription className="text-center">
            {isLogin ? "Before starting the adventure ask your parent to login" : "Create your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant={error.includes("successful") ? "default" : "destructive"} className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            <div className="space-y-4">
              <Tabs
                defaultValue={userType}
                onValueChange={(value: "parent" | "parent-dash") => setUserType(value)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="parent"> Game login</TabsTrigger>
                  <TabsTrigger value="parent-dash">Dashboard Login</TabsTrigger>
                </TabsList>
              </Tabs>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={fullName} onChange={(e) => setfullName(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Username</Label>
                    <Input id="username" type="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                disabled={loading}
              >
                {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                resetForm();
              }}
              className="text-purple-600 hover:underline font-medium"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}