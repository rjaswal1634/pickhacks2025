"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Use state to track login status
  const [username, setUsername] = useState(""); // Use state to store username
  useEffect(() => {
    // Function to check if user data exists in localStorage
    const checkLoginStatus = () => {
      const user = localStorage.getItem("user");
      if (user) {
        setIsLoggedIn(true); // User data found, set isLoggedIn to true
        setUsername(JSON.parse(user).username); 
        console.log(`Welcome to Toon Fit ${username} !`); // Set username from user data
      } else {
        setIsLoggedIn(false); // No user data, set isLoggedIn to false
        router.push("/login"); // Redirect to login page if not logged in
      }
    };

    checkLoginStatus(); // Call the function on component mount
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user data from localStorage
    setIsLoggedIn(false); // Update state
    router.push("/"); // Redirect to main landing page
  };

  // Conditionally render the HomePage content only if user is logged in
  if (!isLoggedIn) {
    return null; // Or you could render a loading state, but redirect happens quickly anyway
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Hero Background with Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-8 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
      </div>

      {/* Logout Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          size="sm"
          className="bg-red-600 text-white hover:bg-red-500"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 md:px-6 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-md">Welcome to Toon Fit {username} !</h1>
        
        <h5 className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          Its time to begin your adventure with Fun Workouts and Cartoons.
        </h5>

        <div className="mt-8 animate-bounce">
          <Link href="/setup">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-white/90 text-lg px-8 py-6 rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Start Game
            </Button>
          </Link>
        </div>
      </div>

      {/* Floating cartoon characters for decoration */}
      <div className="absolute bottom-10 left-10 animate-float-slow hidden md:block">
        <div className="w-24 h-24 bg-yellow-400 rounded-full opacity-90 shadow-lg"></div>
      </div>
      
      <div className="absolute top-20 right-10 animate-float hidden md:block">
        <div className="w-16 h-16 bg-blue-500 rounded-full opacity-80 shadow-lg"></div>
      </div>
    </div>
  );
}