// added by hawon
"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ScoreGraph from "@/components/score-graph"
import { KidData } from "@/lib/types";

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BarChart3, Users, Award } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const API_KEY = "YOUR_GEMINI_API_KEY";


export interface KidsScoreTrackerProps {
    kidsData: KidData[];
}

export default function KidsScoreTracker({kidsData}: KidsScoreTrackerProps) {
  const [activeTab, setActiveTab] = useState(kidsData[0].id)
  const gementor_said = "Your child's activity is progressing well, but it would be beneficial to encourage them to stay active even on weekends.";
  
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
            <CardDescription className="text-white/70">View your child's quiz progress and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            {/*  <div className="space-y-4">*/}
            <div className="flex flex-col space-y-1.5">
              {/* ScoreGraph is placed inside the card */}
              <ScoreGraph data={kid.scores} />

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="text-sm text-white/70">Total Quizzes</div>
                  <div className="text-xl font-bold">{kid.scores.length}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="text-sm text-white/70">Average Score</div>
                  <div className="text-xl font-bold">
                    {kid.scores.length > 0
                      ? (
                          kid.scores.reduce((total, score) => total + score.score, 0) / kid.scores.length
                        ).toFixed(2)
                      : "0"}
                    %
                  </div>
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

