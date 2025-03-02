"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart3, Users, Award, LogOut, LayoutDashboard } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import KidsScoreTracker from "@/components/kids-score-tracker-test"
import Chat from "@/components/gementor-chat"
import FetchHiData from "@/components/hi"
import { set } from "date-fns"

// Mock data for 2weeks scores
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
  {name: "Emma", age: 8},
  {name: "Noah", age: 6},
  {name: "Olivia", age: 7}
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
  const userString = localStorage.getItem("user");
  const userData = userString ? JSON.parse(userString) : null;
  const userid = userData ? userData.data : null;
  const [nchild, setNchild] = useState(0);

  useEffect(() => {
    // Simulate API call to fetch data
    const fetchData = async () => {
      try {
        // Replace with actual API calls when ready
        setChildren(mockChildren)
        setQuizHistory(mockQuizHistory)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
      const response = await fetch(`http://localhost:8080/public/child/user/${userid}`,
        {
          method: "GET", // Use GET because the backend expects query parameters
        }
      )
  
      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.")
      }
  
      const data = await response.json()
      // Get the 'user' data from localStorage
      // Store user data in localStorage or sessionStorage
      console.log("User Child:", data.data)
      setNchild(data.data);
      console.log("User Child:", nchild);
      
      const response2 = await fetch(`http://localhost:8080/public/user/child/${userid}`,
        {
          method: "GET", // Use GET because the backend expects query parameters
        }
      )
  
      if (!response2.ok) {
        throw new Error("Login failed. Please check your credentials.")
      }
  
      const data_child = await response2.json()
      // Get the 'user' data from localStorage
      // Store chiuser data in localStorage or sessionStorage
      console.log("User Child:", data_child.data)
      console.log("User Child:", data_child.data[0].name);
      console.log("User Child:", data_child.data[0].age);

      // Populate the mockChildren data from data_child.data
      
      
      const updatedChildren = data_child.data.map((child: { name: any; age: any;}) => ({
        name: child.name,
        age: child.age,
      }));

      setChildren(updatedChildren);

    
    
    
    }

      

    fetchData()
  }, [])

  const calculateOverallProgress = () => {
    const totalCorrect = children.reduce((sum, child) => sum + child.correctAnswers, 0)
    const totalQuestions = children.reduce((sum, child) => sum + child.totalQuestions, 0)
    return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-800 to-indigo-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header with improved styling */}
        <header className="flex justify-between items-center mb-8 bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg">
          <div className="flex items-center">
            <LayoutDashboard className="h-8 w-8 text-purple-300 mr-3" />
            <h1 className="text-3xl font-bold text-white">Parent Dashboard</h1>
          </div>
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </Link>
        </header>

        {/* Statistics cards with subtle animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm text-white border-white/10 hover:bg-white/15 transition-all duration-300 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="mr-2 h-5 w-5 text-purple-300" />
                Children
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{nchild}</div>
              <p className="text-white/70">Registered children</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm text-white border-white/10 hover:bg-white/15 transition-all duration-300 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Award className="mr-2 h-5 w-5 text-purple-300" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{calculateOverallProgress()}%</div>
              <Progress value={calculateOverallProgress()} className="h-2 mt-2 bg-white/20" />
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm text-white border-white/10 hover:bg-white/15 transition-all duration-300 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-purple-300" />
                Total Quizzes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{children.reduce((sum, child) => sum + child.totalQuizzes, 0)}</div>
              <p className="text-white/70">Completed quizzes</p>
            </CardContent>
          </Card>
        </div>

        {/* Main content area with improved tabs */}
        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <Tabs defaultValue="children" className="w-full">
              <TabsList className="w-full bg-white/10 rounded-none border-b border-white/10 justify-start p-1">
                <TabsTrigger 
                  value="children" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 px-6 rounded-t-lg transition-all"
                >
                  Children Progress
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 px-6 rounded-t-lg transition-all"
                >
                  Quiz History
                </TabsTrigger>
                <TabsTrigger 
                  value="analysis" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 px-6 rounded-t-lg transition-all"
                >
                  Activity Analysis
                </TabsTrigger>
              </TabsList>

              {/* Children Progress Tab */}
              <TabsContent value="children" className="p-6 animate-in fade-in-50 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {children.map((child) => (
                    <Card key={child.name} className="bg-white/10 backdrop-blur-sm text-white border-white/10 hover:translate-y-[-4px] transition-all duration-300">
                      <CardHeader className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 pb-2">
                        <CardTitle>{child.name}</CardTitle>
                        <CardDescription className="text-white/70">Age: {child.age}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        {/* <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Quiz Progress</span>
                              <span>{Math.round((child.correctAnswers / child.totalQuestions) * 100)}%</span>
                            </div>
                            <Progress 
                              value={(child.correctAnswers / child.totalQuestions) * 100} 
                              className="h-2 bg-white/20" 
                            />
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
                        </div> */}
                      </CardContent>
                      <CardFooter className="bg-white/5 border-t border-white/10 pt-2 pb-2">
                        <Button variant="ghost" className="text-white/70 hover:text-white w-full">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Quiz History Tab */}
              <TabsContent value="history" className="p-6 animate-in fade-in-50 duration-300">
                <Card className="bg-white/5 backdrop-blur-sm text-white border-white/10">
                  <CardHeader>
                    <CardTitle>Recent Quiz Activity</CardTitle>
                    <CardDescription className="text-white/70">View your children's recent quiz results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {quizHistory.map((item) => (
                        <div 
                          key={item.id} 
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center mr-3">
                              {item.childName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{item.childName}</div>
                              <div className="text-sm text-white/70">{item.quizName}</div>
                            </div>
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

              {/* Activity Analysis Tab */}
              <TabsContent value="analysis" className="p-6 animate-in fade-in-50 duration-300">
                <KidsScoreTracker kidsData={mockKidData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Chat Component */}
        <div className="mt-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/10 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-800/40 to-indigo-800/40">
              <CardTitle>GeMentor Chat</CardTitle>
              <CardDescription className="text-white/70">Chat with our AI assistant about your child's progress</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Chat kidsData={kidsDataString} />
            </CardContent>
          </Card>
        </div>

        {/* Hidden FetchHiData for development purposes */}
        <div className="hidden">
          <FetchHiData />
        </div>
      </div>
    </div>
  )
}