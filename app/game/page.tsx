"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import OptionCard from "@/components/option-card";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import YouTube, { YouTubeProps } from "react-youtube";

// Define types for game data
type Question = {
  questionStart: string;
  questionTime?: string;
  questionEnd: string;
  choices: { 
    left: string; 
    right: string; 
    hand: string;
    leftKnee: string;
    rightKnee: string;
  };
  answer: string;
};

type Game = {
  id: number;
  title: string;
  url: string;
  questions: Question[];
};

// Updated gameData with new choice mappings to match available poses
const gameData: Game[] = [
  {
    id: 1,
    title: "Dora Doctor Video 1",
    url: "https://www.youtube.com/watch?v=L8A4XbM5sXA",
    questions: [
      { 
        questionStart: "3:19", 
        questionTime: "3:30", 
        questionEnd: "4:34", 
        choices: { 
          left: "Jungle", 
          right: "Barn", 
          hand: "Hill",
          leftKnee: "Mountain", 
          rightKnee: "Beach" 
        }, 
        answer: "Barn" 
      },
      { 
        questionStart: "4:33", 
        questionTime: "4:45", 
        questionEnd: "4:46", 
        choices: { 
          left: "Jungle", 
          right: "Barn", 
          hand: "Hill",
          leftKnee: "Mountain", 
          rightKnee: "Beach" 
        }, 
        answer: "Jungle" 
      },
      { 
        questionStart: "10:04", 
        questionTime: "10:17", 
        questionEnd: "10:25", 
        choices: { 
          left: "Jungle", 
          right: "Barn", 
          hand: "Hill",
          leftKnee: "Mountain", 
          rightKnee: "Beach" 
        }, 
        answer: "Hill" 
      },
      { 
        questionStart: "15:08", 
        questionTime: "15:25", 
        questionEnd: "15:30", 
        choices: { 
          left: "1", 
          right: "4", 
          hand: "3",
          leftKnee: "2", 
          rightKnee: "5" 
        }, 
        answer: "3" 
      },
      { 
        questionStart: "16:53", 
        questionTime: "17:12", 
        questionEnd: "17:15", 
        choices: { 
          left: "Jungle", 
          right: "Barn", 
          hand: "Hill",
          leftKnee: "Mountain", 
          rightKnee: "Beach" 
        }, 
        answer: "Barn" 
      },
    ],
  },
  {
    id: 2,
    url: "https://www.youtube.com/watch?v=xgjb4gmjbA8",
    title: "Dora Becomes a Firefighter!",
    questions: [
      { 
        questionStart: "1:20", 
        questionTime: "1:24", 
        questionEnd: "1:27", 
        choices: { 
          left: "Red", 
          right: "Yellow", 
          hand: "Orange",
          leftKnee: "Blue", 
          rightKnee: "Green" 
        }, 
        answer: "Red" 
      },
      { 
        questionStart: "4:30", 
        questionTime: "4:35", 
        questionEnd: "4:40", 
        choices: { 
          left: "Town", 
          right: "Barn", 
          hand: "Gas Station",
          leftKnee: "River", 
          rightKnee: "Forest" 
        }, 
        answer: "Barn" 
      },
      { 
        questionStart: "5:18", 
        questionEnd: "6:01", 
        choices: { 
          left: "Town", 
          right: "Big Tree", 
          hand: "Gas Station",
          leftKnee: "Mountain", 
          rightKnee: "Beach" 
        }, 
        answer: "Town" 
      },
      { 
        questionStart: "6:04", 
        questionTime: "6:09", 
        questionEnd: "6:35", 
        choices: { 
          left: "Mountain", 
          right: "Town", 
          hand: "Lake",
          leftKnee: "Forest", 
          rightKnee: "River" 
        }, 
        answer: "Town" 
      },
      { 
        questionStart: "9:08", 
        questionTime: "9:17", 
        questionEnd: "9:22", 
        choices: { 
          left: "Town", 
          right: "Big Tree", 
          hand: "Gas Station",
          leftKnee: "Bridge", 
          rightKnee: "Tunnel" 
        }, 
        answer: "Gas Station" 
      },
      { 
        questionStart: "9:29", 
        questionTime: "9:33", 
        questionEnd: "9:36", 
        choices: { 
          left: "Gas Station", 
          right: "Oasis", 
          hand: "Lake",
          leftKnee: "Desert", 
          rightKnee: "Mountain" 
        }, 
        answer: "Gas Station" 
      },
      { 
        questionStart: "12:53", 
        questionTime: "13:08", 
        questionEnd: "13:10", 
        choices: { 
          left: "Town", 
          right: "Big Tree", 
          hand: "Gas Station",
          leftKnee: "Bridge", 
          rightKnee: "Tunnel" 
        }, 
        answer: "Big Tree" 
      },
    ],
  },
  { id: 3, title: "Video Game 3", url: "https://www.youtube.com/watch?v=L8A4XbM5sXA", questions: [] },
];

const backend_url = "http://localhost:5000";

export default function YoutubeGame() {
  const [selectedVideoGame, setSelectedVideoGame] = useState<Game | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [player, setPlayer] = useState<any>(null);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [score, setScore] = useState(0);
  const [promptMessage, setPromptMessage] = useState("Select a video using gestures: Raise Hand (1), Lean Left (2), Lean Right (3)");
  const [questionActive, setQuestionActive] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [cameraInitialized, setCameraInitialized] = useState(false);
  const [currentPose, setCurrentPose] = useState("No pose detected");
  const [poseDetectionActive, setPoseDetectionActive] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionFrameRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const poseFramesRef = useRef<number>(0);
  const REQUIRED_POSE_FRAMES = 10;

  const router = useRouter();
  const currentQuestionData = selectedVideoGame?.questions[currentQuestionIndex];
  const questionChoices = currentQuestionData?.choices;

  // Camera setup
  useEffect(() => {
    let cleanupCalled = false;
    const startCamera = async () => {
      if (cleanupCalled) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        if (videoRef.current && !cleanupCalled) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current && !cleanupCalled) {
              videoRef.current.play();
              setCameraInitialized(true);
              console.log("Camera initialized");
            }
          };
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };
    startCamera();

    return () => {
      cleanupCalled = true;
      console.log("Cleaning up camera effect");
      if (detectionFrameRef.current) cancelAnimationFrame(detectionFrameRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  // Pose detection control
  useEffect(() => {
    if (cameraInitialized && poseDetectionActive) {
      console.log("Starting pose detection");
      detectPose();
    }
    return () => {
      if (detectionFrameRef.current) {
        cancelAnimationFrame(detectionFrameRef.current);
        detectionFrameRef.current = null;
      }
    };
  }, [cameraInitialized, poseDetectionActive]);

  // Video question timing
  useEffect(() => {
    if (selectedVideoGame && player && videoPlaying) {
      const checkQuestionTime = setInterval(() => {
        if (!player) return;
        const currentTime = player.getCurrentTime();
        if (currentQuestionData && !questionActive) {
          const questionStartInSeconds = timeToSeconds(currentQuestionData.questionStart);
          const questionTimeInSeconds = timeToSeconds(currentQuestionData.questionTime || currentQuestionData.questionStart);
          const questionEndTimeInSeconds = timeToSeconds(currentQuestionData.questionEnd);
          
          // Show question at question time
          if (currentTime >= questionTimeInSeconds && currentTime < questionEndTimeInSeconds) {
            setPromptMessage("Answer using gestures: Lean Left, Lean Right, Raise Hand, Left Knee, Right Knee");
            setQuestionActive(true);
            setVideoPlaying(false);
            player.pauseVideo();
            setPoseDetectionActive(true); // Enable pose detection for answering
            console.log("Question active, pose detection enabled");
          }
        }
      }, 500);

      return () => {
        clearInterval(checkQuestionTime);
      };
    }
  }, [selectedVideoGame, currentQuestionIndex, player, videoPlaying, questionActive, currentQuestionData]);

  const timeToSeconds = (timeString: string) => {
    const parts = timeString.split(":");
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  };

  const handleVideoSelect = (game: Game) => {
    setSelectedVideoGame(game);
    setCurrentQuestionIndex(0);
    setScore(0);
    setPromptMessage(`Playing: ${game.title}`);
    setQuestionActive(false);
    setUserAnswer(null);
    setVideoPlaying(true);
    setGameOver(false);
    setPoseDetectionActive(false); // Stop pose detection after selection until question appears
    console.log("Video selected:", game.title);
  };

  const onPlayerReady = (event: any) => {
    setPlayer(event.target);
    // Make sure the video autoplays
    event.target.playVideo();
    console.log("YouTube player ready, video playing");
  };

  const onPlayerStateChange = (event: any) => {
    // Video ended (state 0)
    if (event.data === 0) {
      setPromptMessage("Video ended! Select a new video.");
      setVideoPlaying(false);
      setGameOver(true);
      setSelectedVideoGame(null);
      setPoseDetectionActive(true); // Restart pose detection for video selection
      console.log("Video ended, returning to selection");
    }
    // Video started playing (state 1)
    else if (event.data === 1) {
      setVideoPlaying(true);
      if (!questionActive) {
        setPoseDetectionActive(false); // Disable pose detection while video is playing
      }
    }
    // Video paused (state 2)
    else if (event.data === 2) {
      // Only update videoPlaying if we didn't pause for a question
      if (!questionActive) {
        setVideoPlaying(false);
      }
    }
  };

  const detectPose = async () => {
    if (!cameraInitialized || !poseDetectionActive) {
      console.log("Pose detection skipped: camera not ready or detection inactive");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) {
      detectionFrameRef.current = requestAnimationFrame(detectPose);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frameBlob = await captureFrameAsBlob(canvas);
    if (!frameBlob) {
      detectionFrameRef.current = requestAnimationFrame(detectPose);
      return;
    }

    const formData = new FormData();
    formData.append("image", frameBlob, "frame.jpg");
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${backend_url}/detect_pose`, {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      let poseName = "No pose detected";
      if (data.hand_raised) poseName = "Hand Raised";
      else if (data.leaning_left) poseName = "Leaning Left";
      else if (data.leaning_right) poseName = "Leaning Right";
      else if (data.left_knee_raised) poseName = "Left Knee Raised";
      else if (data.right_knee_raised) poseName = "Right Knee Raised";

      setCurrentPose(poseName);
      handlePoseUpdate(poseName);
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Pose detection error:", error);
        setCurrentPose("Network error");
      }
    } finally {
      if (poseDetectionActive) detectionFrameRef.current = requestAnimationFrame(detectPose);
    }
  };

  const captureFrameAsBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> =>
    new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.8));

  const handlePoseUpdate = (poseName: string) => {
    if (!poseDetectionActive) return;

    if (!selectedVideoGame) { // Video selection
      if (poseName === "Hand Raised" && poseFramesRef.current >= REQUIRED_POSE_FRAMES) {
        handleVideoSelect(gameData[0]);
        poseFramesRef.current = 0;
      } else if (poseName === "Leaning Left" && poseFramesRef.current >= REQUIRED_POSE_FRAMES) {
        handleVideoSelect(gameData[1]);
        poseFramesRef.current = 0;
      } else if (poseName === "Leaning Right" && poseFramesRef.current >= REQUIRED_POSE_FRAMES) {
        handleVideoSelect(gameData[2]);
        poseFramesRef.current = 0;
      }
    } else if (questionActive && currentQuestionData && !userAnswer) { // Question answering
      let selectedAnswer: string | null = null;
      
      if (poseName === "Leaning Left") selectedAnswer = currentQuestionData.choices.left;
      else if (poseName === "Leaning Right") selectedAnswer = currentQuestionData.choices.right;
      else if (poseName === "Hand Raised") selectedAnswer = currentQuestionData.choices.hand;
      else if (poseName === "Left Knee Raised") selectedAnswer = currentQuestionData.choices.leftKnee;
      else if (poseName === "Right Knee Raised") selectedAnswer = currentQuestionData.choices.rightKnee;

      if (selectedAnswer && poseFramesRef.current >= REQUIRED_POSE_FRAMES) {
        handleAnswerSelect(selectedAnswer);
        poseFramesRef.current = 0;
      }
    }

    if (poseName !== "No pose detected") poseFramesRef.current++;
    else poseFramesRef.current = 0;
  };

  const handleAnswerSelect = (selectedAnswer: string) => {
    if (!questionActive || userAnswer) return;

    setUserAnswer(selectedAnswer);
    setPoseDetectionActive(false); // Stop pose detection during feedback

    const isCorrect = selectedAnswer === currentQuestionData?.answer;
    if (isCorrect) {
      // Explicitly update score using functional update to ensure it's based on latest state
      setScore(prevScore => prevScore + 1);
      setPromptMessage("Correct!");
    } else {
      setPromptMessage(`Wrong! Correct answer: ${currentQuestionData?.answer}`);
    }

    setTimeout(() => {
      setQuestionActive(false);
      setUserAnswer(null);
      setVideoPlaying(true);
      
      if (player && currentQuestionData) {
        // Skip to the end of the question section
        const questionEndTimeInSeconds = timeToSeconds(currentQuestionData.questionEnd);
        player.seekTo(questionEndTimeInSeconds, true);
        player.playVideo();
      }

      if (selectedVideoGame && currentQuestionIndex < selectedVideoGame.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setPromptMessage("Next question coming up!");
      } else if (selectedVideoGame) {
        setPromptMessage("All questions completed! Video will finish.");
        // Let video continue to the end
      }
    }, 2000);
  };

  const resetGame = () => {
    setSelectedVideoGame(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setPromptMessage("Select a video using gestures: Raise Hand (1), Lean Left (2), Lean Right (3)");
    setQuestionActive(false);
    setUserAnswer(null);
    setVideoPlaying(true);
    setGameOver(false);
    setPoseDetectionActive(true);
    if (player) player.stopVideo();
  };

  // Fixed video dimensions with proper aspect ratio
  const youtubeOpts = {
    height: '500',
    width: '800',
    playerVars: {
      autoplay: 1,
      controls: 1,
      start: 0
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 flex flex-col">
      <div className="absolute top-4 right-4 w-64 h-48 bg-black rounded-lg overflow-hidden border-2 border-white/20 shadow-lg z-10">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        {!cameraInitialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-xs">
            Initializing camera...
          </div>
        )}
      </div>

      <div className="p-4">
        <Link href="/">
          <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
            <ArrowLeft className="mr-2 h-4 w-4" /> Exit Game
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {!selectedVideoGame ? (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
              {gameData.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <OptionCard title={game.title} selected={false} onClick={function (): void {
                          throw new Error("Function not implemented.");
                      } } />
                  <div className="mt-4 text-center text-white/70 text-sm">
                    {index === 0 ? "Raise Hand" : index === 1 ? "Lean Left" : "Lean Right"}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        ) : !gameOver ? (
          <>
            <div className="w-[90vw] md:w-[80vw] bg-black/30 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-white text-center mb-6">{selectedVideoGame.title}</h2>
              <div className="flex justify-center mb-6">
                <YouTube videoId={selectedVideoGame.url.split("v=")[1]} opts={youtubeOpts as YouTubeProps['opts']} onReady={onPlayerReady} onStateChange={onPlayerStateChange} className="mx-auto" />
              </div>
              <div className="text-white/70 text-center text-lg">
                Question {currentQuestionIndex + 1} of {selectedVideoGame.questions.length}
              </div>
              <div className="mt-3 bg-white/20 rounded-full h-3 w-full">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full"
                  style={{ width: `${((currentQuestionIndex + 1) / selectedVideoGame.questions.length) * 100}%` }}
                />
              </div>
              <p className="text-white text-center mt-6 p-3 bg-purple-800/50 rounded-lg text-lg">{promptMessage}</p>
            </div>

            {questionActive && currentQuestionData && questionChoices && (
              <div className="w-full max-w-5xl">
                <AnimatePresence>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0 }}
                      className="flex flex-col items-center"
                    >
                      <OptionCard title={`LEFT: ${questionChoices.left}`} selected={userAnswer === questionChoices.left} onClick={function (): void {
                              throw new Error("Function not implemented.");
                          } } />
                      <div className="mt-4 text-center text-white/70 text-sm">Lean Left</div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="flex flex-col items-center"
                    >
                      <OptionCard title={`RIGHT: ${questionChoices.right}`} selected={userAnswer === questionChoices.right} onClick={function (): void {
                              throw new Error("Function not implemented.");
                          } } />
                      <div className="mt-4 text-center text-white/70 text-sm">Lean Right</div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="flex flex-col items-center"
                    >
                      <OptionCard title={`HAND: ${questionChoices.hand}`} selected={userAnswer === questionChoices.hand} onClick={function (): void {
                              throw new Error("Function not implemented.");
                          } } />
                      <div className="mt-4 text-center text-white/70 text-sm">Raise Hand</div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="flex flex-col items-center"
                    >
                      <OptionCard title={`L-KNEE: ${questionChoices.leftKnee}`} selected={userAnswer === questionChoices.leftKnee} onClick={function (): void {
                              throw new Error("Function not implemented.");
                          } } />
                      <div className="mt-4 text-center text-white/70 text-sm">Left Knee Raised</div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="flex flex-col items-center"
                    >
                      <OptionCard title={`R-KNEE: ${questionChoices.rightKnee}`} selected={userAnswer === questionChoices.rightKnee} onClick={function (): void {
                              throw new Error("Function not implemented.");
                          } } />
                      <div className="mt-4 text-center text-white/70 text-sm">Right Knee Raised</div>
                    </motion.div>
                  </div>
                </AnimatePresence>
              </div>
            )}
            <p className="text-2xl text-white/90 mt-8 text-center">Score: {score}</p>
          </>
        ) : (
          <div className="w-full max-w-3xl bg-black/30 backdrop-blur-sm rounded-2xl p-10 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Game Over!</h2>
            <p className="text-2xl text-white/90 mb-8">
              Your final score: {score} out of {selectedVideoGame?.questions.length}
            </p>
            <Button
              onClick={resetGame}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg py-6 px-8"
            >
              Play Again
            </Button>
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center text-sm text-white/50 mb-6 absolute bottom-0 left-0 right-0 p-4"
      >
        Detected Pose: <span className="font-bold">{currentPose}</span>
        {!poseDetectionActive && <span className="ml-2">(Detection paused)</span>}
      </motion.div>
    </div>
  );
}