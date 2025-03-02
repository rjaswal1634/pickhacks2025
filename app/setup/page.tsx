"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose"
import * as drawingUtils from "@mediapipe/drawing_utils"

export default function CameraSetup() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const poseRef = useRef<Pose | null>(null)
  const previousHipYRef = useRef<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Function to check if user data exists in localStorage
    const checkLoginStatus = () => {
      const user = localStorage.getItem("user")
      if (user) {
        setIsLoggedIn(true) // User data found, set isLoggedIn to true
        setUsername(JSON.parse(user).username) // Set username from user data
        console.log(`Welcome to Toon Fit ${username} !`)
      } else {
        setIsLoggedIn(false) // No user data, set isLoggedIn to false
        router.push("/login") // Redirect to login page if not logged in
      }
    }

    checkLoginStatus() // Call the function on component mount

    // Initialize MediaPipe Pose
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    })

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })

    poseRef.current = pose

    pose.onResults((results) => {
      const canvas = canvasRef.current
      const video = videoRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!video) return

      // Match canvas size to video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Clear canvas
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }

      // Draw landmarks if detected
      if (results.poseLandmarks) {
        if (ctx) {
          drawingUtils.drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 2,
          })
          drawingUtils.drawLandmarks(ctx, results.poseLandmarks, {
            color: "#FF0000",
            lineWidth: 1,
          })
        }

        // Check if user is centered
        const isCentered = isUserCentered(results, canvas)
        setIsReady(isCentered)

        // Check for jump if camera is ready
        if (isCentered && isJumping(results, canvas)) {
          router.push("/game")
        }
      } else {
        setIsReady(false)
      }
    })

    // Cleanup
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
      pose.close()
    }
  }, [router, username])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          detectPose()
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Unable to access your camera. Please check permissions and try again.")
    }
  }

  const detectPose = async () => {
    if (videoRef.current && poseRef.current) {
      await poseRef.current.send({ image: videoRef.current })
      requestAnimationFrame(detectPose)
    }
  }

  // Check if user is centered
  const isUserCentered = (results: any, canvas: HTMLCanvasElement) => {
    if (results.poseLandmarks) {
      const width = canvas.width
      const midX = width / 2
      const noseX = results.poseLandmarks[0].x * width // Nose X position
      const tolerance = width * 0.2 // 20% tolerance from center
      return Math.abs(noseX - midX) < tolerance
    }
    return false
  }

  // Check if user is jumping
  const isJumping = (results: any, canvas: HTMLCanvasElement) => {
    if (results.poseLandmarks) {
      const height = canvas.height
      const y1 = results.poseLandmarks[27].y * height // Left ankle
      const y2 = results.poseLandmarks[28].y * height // Right ankle
      const hipY = (y1 + y2) / 2
      const threshold = 20 // Increased threshold for clearer jump detection

      if (previousHipYRef.current && previousHipYRef.current - hipY > threshold) {
        previousHipYRef.current = hipY
        return true
      } else {
        previousHipYRef.current = hipY
      }
    }
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Camera Setup</h1>
        <div className="relative aspect-video bg-black/50 rounded-xl overflow-hidden mb-6">
          {!cameraActive ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="w-16 h-16 text-white/50" />
            </div>
          ) : null}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${cameraActive ? "opacity-100" : "opacity-0"}`}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 10 }}
          />

          {cameraActive && (
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
              <div className="absolute inset-0 border-4 border-dashed border-white/30 rounded-lg"></div>
              {isReady && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  Ready! Jump to Continue
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/overlay.png" alt="Body Outline" className="w-full h-full object-contain opacity-50" />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {!cameraActive ? (
            <Button onClick={startCamera} size="lg" className="bg-white text-purple-700 hover:bg-white/90">
              <Camera className="mr-2 h-5 w-5" />
              Enable Camera
            </Button>
          ) : (
            <p className="text-white text-center">
              {isReady ? "Jump to start the game!" : "Position yourself in the center of the frame."}
            </p>
          )}
        </div>

        <p className="text-white/70 text-sm mt-4 text-center">
          We'll use your camera to make the game interactive!
        </p>
      </div>
    </div>
  )
}