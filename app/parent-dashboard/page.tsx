"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart3, Users, Award } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// import KidsScoreTracker from "@/components/kids-score-tracker"
import KidsScoreTracker from "@/components/kids-score-tracker"
import Chat from "@/components/gementor-chat-test"

// temp
import FetchDataExample from "@/components/hi"
import PikachuAttributes from "@/components/pokemon"

// mock data for 2weeks scores
const mockKidData = [
  {
    id: "1",
    name: "Emma",
    scores: [
      { date: "2025-02-01", score: 85 },
      { date: "2025-02-05", score: 78 },
      { date: "2025-02-09", score: 92 },
      { date: "2025-02-13", score: 88 },
      { date: "2025-02-17", score: 95 },
      { date: "2025-02-21", score: 90 },
      { date: "2025-02-25", score: 93 },
      { date: "2025-02-28", score: 97 },
    ],
  },
  {
    id: "2",
    name: "Noah",
    scores: [
      { date: "2025-02-01", score: 72 },
      { date: "2025-02-05", score: 80 },
      { date: "2025-02-09", score: 75 },
      { date: "2025-02-13", score: 85 },
      { date: "2025-02-17", score: 82 },
      { date: "2025-02-21", score: 88 },
      { date: "2025-02-25", score: 90 },
      { date: "2025-02-28", score: 86 },
    ],
  },
  {
    id: "3",
    name: "Olivia",
    scores: [
      { date: "2025-02-01", score: 90 },
      { date: "2025-02-05", score: 85 },
      { date: "2025-02-09", score: 82 },
      { date: "2025-02-13", score: 78 },
      { date: "2025-02-17", score: 88 },
      { date: "2025-02-21", score: 92 },
      { date: "2025-02-25", score: 95 },
      { date: "2025-02-28", score: 91 },
    ],
  },
]



// Mock data - replace with actual API calls to your Java server
const mockChildren = [
  { id: 1, name: "Emma", age: 8, totalQuizzes: 12, correctAnswers: 45, totalQuestions: 60 },
  { id: 2, name: "Noah", age: 10, totalQuizzes: 8, correctAnswers: 30, totalQuestions: 40 },
  { id: 3, name: "Olivia", age: 7, totalQuizzes: 5, correctAnswers: 15, totalQuestions: 25 },
]

const mockQuizHistory = [
  { id: 1, childName: "Emma", quizName: "Cartoon Classics", score: "8/10", date: "2023-05-15" },
  { id: 2, childName: "Noah", quizName: "Disney Heroes", score: "7/10", date: "2023-05-14" },
  { id: 3, childName: "Olivia", quizName: "Superhero Quiz", score: "9/10", date: "2023-05-12" },
  { id: 4, childName: "Olivia", quizName: "Cartoon Classics", score: "6/10", date: "2023-05-10" },
  { id: 5, childName: "Noah", quizName: "Anime Characters", score: "8/10", date: "2023-05-08" },
]

const kidsDataString = JSON.stringify({ mockKidData, mockChildren, mockQuizHistory });

export default function ParentDashboard() {
  const [children, setChildren] = useState(mockChildren)
  const [quizHistory, setQuizHistory] = useState(mockQuizHistory)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch data
    const fetchData = async () => {
      try {
        // Replace with actual API calls
        // const childrenResponse = await fetch('YOUR_JAVA_SERVER_API_URL/children');
        // const childrenData = await childrenResponse.json();
        // setChildren(childrenData);

        // const historyResponse = await fetch('YOUR_JAVA_SERVER_API_URL/quiz-history');
        // const historyData = await historyResponse.json();
        // setQuizHistory(historyData);

        // Using mock data for now
        setChildren(mockChildren)
        setQuizHistory(mockQuizHistory)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const calculateOverallProgress = () => {
    const totalCorrect = children.reduce((sum, child) => sum + child.correctAnswers, 0)
    const totalQuestions = children.reduce((sum, child) => sum + child.totalQuestions, 0)
    return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="mr-4 bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">Parent Dashboard</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm text-white border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Children
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{children.length}</div>
              <p className="text-white/70">Registered children</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm text-white border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{calculateOverallProgress()}%</div>
              <Progress value={calculateOverallProgress()} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm text-white border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Total Quizzes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{children.reduce((sum, child) => sum + child.totalQuizzes, 0)}</div>
              <p className="text-white/70">Completed quizzes</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="children" className="w-full">
          <TabsList className="bg-white/10 text-white border-white/10 mb-6">
            <TabsTrigger value="children" className="data-[state=active]:bg-white/20">
              Children Progress
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white/20">
              Quiz History
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-white/20">
              Activity Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="children" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children.map((child) => (
                <Card key={child.id} className="bg-white/10 backdrop-blur-sm text-white border-white/10">
                  <CardHeader>
                    <CardTitle>{child.name}</CardTitle>
                    <CardDescription className="text-white/70">Age: {child.age}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Quiz Progress</span>
                          <span>{Math.round((child.correctAnswers / child.totalQuestions) * 100)}%</span>
                        </div>
                        <Progress value={(child.correctAnswers / child.totalQuestions) * 100} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-3 rounded-lg">
                          <div className="text-sm text-white/70">Quizzes</div>
                          <div className="text-xl font-bold">{child.totalQuizzes}</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg">
                          <div className="text-sm text-white/70">Correct</div>
                          <div className="text-xl font-bold">
                            {child.correctAnswers}/{child.totalQuestions}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <Card className="bg-white/10 backdrop-blur-sm text-white border-white/10">
              <CardHeader>
                <CardTitle>Recent Quiz Activity</CardTitle>
                <CardDescription className="text-white/70">View your children's recent quiz results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quizHistory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <div className="font-medium">{item.childName}</div>
                        <div className="text-sm text-white/70">{item.quizName}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{item.score}</div>
                        <div className="text-sm text-white/70">{new Date(item.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="analysis" className="mt-0 flex flex-col gap-4">
            <div className="space-y-4">
              <KidsScoreTracker kidsData={mockKidData} />
            </div>
          </TabsContent>
            <div>
              <Chat kidsData={kidsDataString}/>
            </div>
            <div>
              <FetchDataExample />
              
            </div>
        </Tabs>
      </div>
    </div>
  )
}

