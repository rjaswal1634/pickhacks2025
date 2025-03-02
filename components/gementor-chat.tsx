"use client"

import type React from "react"
import { useState, useEffect } from "react"

// API key should be in an environment variable in production
const API_KEY = "AIzaSyDPk-o3GJGkK_vPyh_15XCFYVhqPy8N9EA"
// Updated to the correct endpoint for the free version of Gemini
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const messageContainer = document.getElementById("message-container")
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: "user", text: input }
    const userInput = input
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)
    setError(null)

    try {
      console.log("Sending request to Gementor API...")
      const requestBody = {
        contents: [
          {
            parts: [{ text: userInput }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }

      console.log("Request body:", JSON.stringify(requestBody, null, 2))

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.text()
        console.error("API Error:", errorData)
        throw new Error(`API error: ${response.status} - ${errorData}`)
      }

      const data = await response.json()
      console.log("API Response:", JSON.stringify(data, null, 2))

      if (
        data.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0
      ) {
        const botReply = data.candidates[0].content.parts[0].text
        setMessages((prev) => [...prev, { role: "bot", text: botReply }])
      } else if (data.promptFeedback && data.promptFeedback.blockReason) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: `Content blocked: ${data.promptFeedback.blockReason}`,
          },
        ])
      } else {
        console.error("Unexpected response structure:", data)
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "Received an unexpected response format from the API.",
          },
        ])
      }
    } catch (error) {
      console.error("Error details:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `Error: ${error instanceof Error ? error.message : "Could not get a response"}`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Gementor Chat</h2>

      <div id="message-container" className="h-96 overflow-y-auto border-b mb-4 p-2">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center mt-32">Send a message to start chatting with Gementor</div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg ${
                msg.role === "user" ? "bg-blue-100 ml-12 text-right" : "bg-gray-200 mr-12"
              }`}
            >
              <div className="font-bold text-xs mb-1">{msg.role === "user" ? "You" : "Gementor"}</div>
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          ))
        )}

        {loading && (
          <div className="mb-2 p-2 rounded-lg bg-gray-200 mr-12">
            <div className="font-bold text-xs mb-1">Gementor</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div
                className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
          disabled={loading || !input.trim()}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      <div className="mt-2 text-xs text-gray-500 text-center">Powered by Gemini</div>
    </div>
  )
}

