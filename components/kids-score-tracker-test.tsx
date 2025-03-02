"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ScoreGraph from "@/components/score-graph"
import type { KidData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export interface KidsScoreTrackerProps {
  kidsData: KidData[]
}

export default function KidsScoreTracker({ kidsData }: KidsScoreTrackerProps) {
  const [activeTab, setActiveTab] = useState(kidsData[0].id)
  const [advice, setAdvice] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  // Convert kid data to a string format for the prompt
  const formatKidDataForPrompt = (kid: KidData) => {
    const averageScore =
      kid.scores.length > 0
        ? (kid.scores.reduce((total, score) => total + score.score, 0) / kid.scores.length).toFixed(2)
        : "0"

    const recentScores = kid.scores
      .slice(-5)
      .map((score) => `Date: ${score.date}, Score: ${score.score}%`)
      .join("; ")

    return `
      Child's name: ${kid.name}
      Total quizzes taken: ${kid.scores.length}
      Average score: ${averageScore}%
      Recent scores: ${recentScores}
    `
  }

  // Generate advice using Gemini API
  const generateAdvice = async (kid: KidData) => {
    if (!API_KEY) {
      setAdvice((prev) => ({ ...prev, [kid.id]: "Please configure your Gemini API key to get personalized advice." }))
      return
    }

    setLoading((prev) => ({ ...prev, [kid.id]: true }))

    try {
      const kidDataString = formatKidDataForPrompt(kid)
      console.log("Sending request to Gemini API with data:", kidDataString)

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Based on this child's quiz performance data, provide brief educational advice for parents. Keep your response under 50 words and focus on practical suggestions: ${kidDataString}`,
                },
              ],
            },
          ],
        }),
      })

      if (!response.ok) {
        console.error("API response not OK:", response.status, response.statusText)
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("API response:", data)

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const generatedAdvice = data.candidates[0].content.parts[0].text
        setAdvice((prev) => ({ ...prev, [kid.id]: generatedAdvice }))
      } else {
        console.error("Unexpected API response format:", data)
        setAdvice((prev) => ({ ...prev, [kid.id]: "Unable to generate advice at this time." }))
      }
    } catch (error) {
      console.error("Error generating advice:", error)
      setAdvice((prev) => ({ ...prev, [kid.id]: "Error generating advice. Please try again later." }))
    } finally {
      setLoading((prev) => ({ ...prev, [kid.id]: false }))
    }
  }

  // Generate advice when active tab changes
  useEffect(() => {
    const activeKid = kidsData.find((kid) => kid.id === activeTab)
    if (activeKid && !advice[activeTab] && !loading[activeTab]) {
      generateAdvice(activeKid)
    }
  }, [activeTab, kidsData, advice, loading, generateAdvice]) // Added generateAdvice to dependencies

  return (
    <div className="w-full">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white/10 text-white border-white/10 mb-2">
          {kidsData.map((kid) => (
            <TabsTrigger key={kid.id} value={kid.id} className="data-[state=active]:bg-white/20">
              {kid.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {kidsData.map((kid) => (
          <TabsContent key={kid.id} value={kid.id}>
            <Card className="bg-white/10 backdrop-blur-sm text-white border-white/10 p-4">
              <CardHeader>
                <CardTitle>{kid.name}'s Progress</CardTitle>
                <CardDescription className="text-white/70">
                  View your child's quiz progress and statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-1.5">
                  {/* ScoreGraph is placed inside the card */}
                  <ScoreGraph data={kid.scores} />

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="text-sm text-white/70">Total Quizzes</div>
                      <div className="text-xl font-bold"> 5 </div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="text-sm text-white/70">Average Score</div>
                      <div className="text-xl font-bold">
62%
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-lg mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-white/70" />
                      <div className="text-lg font-bold">Gementor Advice</div>
                    </div>
                    <div className="text-white/90">
                      {loading[kid.id] ? (
                        <div className="flex flex-col items-center py-2">
                          <div className="text-sm mb-2">Generating advice...</div>
                          <Progress value={80} className="h-1.5 w-full" />
                        </div>
                      ) : advice[kid.id] ? (
                        advice[kid.id]
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/10 hover:bg-white/20 border-white/20"
                          onClick={() => generateAdvice(kid)}
                          disabled={loading[kid.id]}
                        >
                          {loading[kid.id] ? "Generating..." : "Generate Advice"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

