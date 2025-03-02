import React, { useState, useEffect } from "react";
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const ToonFitTutor = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_GOOGLE_API_KEY is not defined");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const synth = window.speechSynthesis;

  const speak = (text, callback) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    utterance.voice = voices[0];
    utterance.rate = 1;
    utterance.onend = callback;
    synth.speak(utterance);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isActive) {
        setIsActive(true);
        greetUser();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isActive]);

  const greetUser = () => {
    speak(
      "Welcome to Toon Fit! Get ready for a fun workout adventure with your favorite cartoons!",
      () => {
        askUser();
      }
    );
  };

  const askUser = () => {
    speak("What kind of workout would you like to do today?", () => {
      startListening();
    });
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition API is not supported in your browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setPrompt(text);
      setConversationHistory((prevHistory) => [
        ...prevHistory,
        { speaker: "User", text: text },
      ]);
      speak(`You said: ${text}`, () => {
        generateResponse(text);
      });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const generateResponse = async (input) => {
    if (!input) {
      alert("Please provide some input.");
      return;
    }
    try {
      const fullPrompt = `You are a virtual fitness trainer in a world of cartoons. The user said: "${input}". Provide a fun and engaging workout suggestion that incorporates cartoon elements.`;
      const result = await model.generateContent(fullPrompt);
      const responseText = result.response.text();
      setResponse(responseText);
      setConversationHistory((prevHistory) => [
        ...prevHistory,
        { speaker: "Agent", text: responseText },
      ]);
      speak(responseText, () => {
        askUser();
      });
    } catch (error) {
      console.error("Error generating response:", error);
      setResponse("An error occurred. Please try again.");
      speak("Sorry, an error occurred. Please try again.", () => {
        askUser();
      });
    }
  };

  return (
    <div>
      {/* UI Removed */}
    </div>
  );
};

export default ToonFitTutor;