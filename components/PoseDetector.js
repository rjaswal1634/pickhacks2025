"use client" // Make sure it's a client component if used in /app directory

import { useEffect, useRef } from "react";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose"; // Import POSE_CONNECTIONS
import * as drawingUtils from "@mediapipe/drawing_utils";

const PoseDetector = ({ onPoseUpdate }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseRef = useRef(null);
  const previousHipYRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    console.log("videoRef.current (PoseDetector):", video);
    console.log("canvasRef.current (PoseDetector):", canvas);

    if (!video || !canvas) {
      console.error("Video or Canvas element not found in PoseDetector!");
      return;
    }

    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`; // Pinned version
      },
    });

    poseRef.current = pose;

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Failed to get canvas 2D context in PoseDetector!");
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.poseLandmarks) {
        drawingUtils.drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, { // Use POSE_CONNECTIONS
          color: "#00FF00",
          lineWidth: 2,
        });
        drawingUtils.drawLandmarks(ctx, results.poseLandmarks, {
          color: "#FF0000",
          lineWidth: 1,
        });
      }

      // Calculate pose states
      const poseStates = {
        isHandRaised: isHandRaised(results, canvas),
        isJumping: isJumping(results, canvas),
        isLeaningLeft: isLeaningLeft(results, canvas),
        isLeaningRight: isLeaningRight(results, canvas),
        isCentered: isCentered(results, canvas),
      };

      // Send pose states to parent via callback
      if (onPoseUpdate) {
        onPoseUpdate(poseStates);
      }
    });

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
            detectPose();
          };
        }
      } catch (error) {
        console.error("Error accessing camera in PoseDetector:", error);
        if (error instanceof Error) {
          alert(`Unable to access your camera in PoseDetector. Error details: ${error.message}. Please check permissions and try again.`);
        } else {
          alert("Unable to access your camera in PoseDetector. Please check permissions and try again.");
        }
      }
    };

    const detectPose = async () => {
      if (videoRef.current && poseRef.current) {
        await poseRef.current.send({ image: videoRef.current });
        requestAnimationFrame(detectPose);
      }
    };

    startWebcam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (poseRef.current) {
        poseRef.current.close();
      }
    };
  }, [onPoseUpdate]);

  // Pose detection functions (unchanged)
  const isHandRaised = (results, canvas) => {
    if (results.poseLandmarks) {
      const height = canvas.height;
      const y1 = results.poseLandmarks[15].y * height; // Left wrist
      const y2 = results.poseLandmarks[16].y * height; // Right wrist
      const y3 = results.poseLandmarks[11].y * height; // Left shoulder
      const y4 = results.poseLandmarks[12].y * height; // Right shoulder
      return y1 < y3 || y2 < y4;
    }
    return false;
  };

  const isJumping = (results, canvas) => {
    if (results.poseLandmarks) {
      const height = canvas.height;
      const y1 = results.poseLandmarks[27].y * height; // Left ankle
      const y2 = results.poseLandmarks[28].y * height; // Right ankle
      const hipY = (y1 + y2) / 2;
      const threshold = 10;

      if (previousHipYRef.current && previousHipYRef.current - hipY > threshold) {
        previousHipYRef.current = hipY;
        return true;
      } else {
        previousHipYRef.current = hipY;
      }
    }
    return false;
  };

  const isLeaningRight = (results, canvas) => {
    const threshold = 100;
    const width = canvas.width;
    const midX = width / 2;
    if (results.poseLandmarks) {
      const x = results.poseLandmarks[0].x * width; // Nose
      return midX - x > threshold;
    }
    return false;
  };

  const isLeaningLeft = (results, canvas) => {
    const threshold = 100;
    const width = canvas.width;
    const midX = width / 2;
    if (results.poseLandmarks) {
      const x = results.poseLandmarks[0].x * width; // Nose
      return x - midX > threshold;
    }
    return false;
  };

  const isCentered = (results, canvas) => {
    const threshold = 50;
    const width = canvas.width;
    const midX = width / 2;
    if (results.poseLandmarks) {
      const x = results.poseLandmarks[0].x * width; // Nose
      return Math.abs(x - midX) < threshold;
    }
    return false;
  };

  return (
    <div style={{ position: "relative" }}>
      <video ref={videoRef} style={{ width: "100%", height: "100%", objectFit: "cover" }} autoPlay playsInline muted />
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
    </div>
  );
};

export default PoseDetector;