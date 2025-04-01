"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Video, ImageIcon, FileText, HelpCircle, Sparkles, Upload, X, Plus, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  generateTextContent, 
  generateQuizQuestions, 
  generateImagePrompt, 
  generateImage,
  generateVideoScript 
} from "@/lib/openai"
import { createPost } from "@/lib/supabase"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function CreatePage() {
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState<string[]>(["education"])
  const [newTag, setNewTag] = useState("")
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiResult, setAiResult] = useState("")
  const [contentType, setContentType] = useState("post")
  const [generatedImage, setGeneratedImage] = useState("")
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null)
  const [targetAudience, setTargetAudience] = useState("high school students")
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleGenerateContent = async () => {
    if (!aiPrompt) return

    setAiGenerating(true)
    setAiResult("")
    setGeneratedImage("")
    setGeneratedQuiz(null)

    try {
      // Different generation based on the selected tab
      switch (contentType) {
        case "post":
          const generatedText = await generateTextContent(
            `Write an educational post about ${aiPrompt} for ${targetAudience}. Make it informative and engaging.`
          )
          setAiResult(generatedText)
          
          // Automatically generate an image for the post
          try {
            toast({
              title: "Generating image",
              description: "Creating a visual for your post. This may take a moment.",
            })
            
            const imagePrompt = await generateImagePrompt(
              `Educational illustration about ${aiPrompt} for ${targetAudience}, visual representation of the concept`
            )
            
            const imageUrl = await generateImage(imagePrompt)
            setGeneratedImage(imageUrl)
          } catch (err) {
            console.error("Error auto-generating image:", err)
            // Don't block the content creation if image fails
          }
          break

        case "video":
          const script = await generateVideoScript(aiPrompt, "5 minutes", targetAudience)
          setAiResult(script)
          
          // Also generate a thumbnail image for the video
          try {
            toast({
              title: "Generating thumbnail",
              description: "Creating a thumbnail for your video. This may take a moment.",
            })
            
            const thumbnailPrompt = await generateImagePrompt(
              `Thumbnail image for educational video about ${aiPrompt}`
            )
            
            const thumbnailUrl = await generateImage(thumbnailPrompt)
            setGeneratedImage(thumbnailUrl)
          } catch (err) {
            console.error("Error generating thumbnail:", err)
          }
          break

        case "image":
          const imagePrompt = await generateImagePrompt(
            `Educational illustration about ${aiPrompt} for ${targetAudience}`
          )
          toast({
            title: "Image prompt generated",
            description: "Now generating the image based on this prompt. This may take a moment.",
          })
          setAiResult(imagePrompt)
          
          // Generate the actual image
          setIsGeneratingImage(true)
          try {
            const imageUrl = await generateImage(imagePrompt)
            setGeneratedImage(imageUrl)
          } catch (err) {
            console.error("Error generating image:", err)
            toast({
              title: "Image generation failed",
              description: "Could not generate the image. Please try again with a different prompt.",
              variant: "destructive"
            })
          } finally {
            setIsGeneratingImage(false)
          }
          break

        case "quiz":
          const quizData = await generateQuizQuestions(aiPrompt, "medium", 5)
          setGeneratedQuiz(quizData)
          setAiResult(JSON.stringify(quizData, null, 2))
          break

        default:
          const defaultContent = await generateTextContent(aiPrompt)
          setAiResult(defaultContent)
      }
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Generation Failed",
        description: "Could not generate content. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setAiGenerating(false)
    }
  }

  // Apply generated quiz data to the quiz form
  const applyGeneratedQuiz = () => {
    if (!generatedQuiz || !generatedQuiz.questions) return
    
    // TODO: Implement applying the quiz data to the quiz form
    toast({
      title: "Quiz Applied",
      description: "Generated quiz questions have been applied to the form.",
    })
  }

  // Set content type based on the selected tab
  const handleTabChange = (value: string) => {
    setContentType(value)
  }

  // Handle publish content
  const handlePublish = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to publish content.",
        variant: "destructive"
      })
      return
    }

    if (!title) {
      toast({
        title: "Title required",
        description: "Please add a title to your content",
        variant: "destructive"
      })
      return
    }

    if (!aiResult && contentType !== "image") {
      toast({
        title: "Content required",
        description: "Please add some content to publish",
        variant: "destructive"
      })
      return
    }

    setIsPublishing(true)

    try {
      const postData = {
        type: contentType,
        title: title,
        description: aiResult,
        media_url: generatedImage || "",
        status: "published"
      }

      // Create the post
      const result = await createPost(user.id, postData)
      
      // Handle tag associations if implemented in your database
      
      toast({
        title: "Content published!",
        description: "Your content has been published successfully",
      })
      
      // Redirect to the home feed or post page
      router.push("/")
    } catch (error) {
      console.error("Error publishing content:", error)
      toast({
        title: "Publishing failed",
        description: "Could not publish your content. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Content</h1>
        <p className="text-muted-foreground">Share your knowledge and inspire others</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="post" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="post" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Post</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span>Video</span>
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span>Image</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>Quiz</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="post" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" placeholder="Enter a descriptive title" className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        placeholder="Share your knowledge..."
                        className="mt-1 min-h-[200px]"
                        value={aiResult}
                        onChange={(e) => setAiResult(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Tags</Label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button onClick={() => handleRemoveTag(tag)} className="ml-1 rounded-full hover:bg-muted">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        <div className="flex items-center gap-2">
                          <Input
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Add a tag"
                            className="h-8 w-32"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAddTag()
                              }
                            }}
                          />
                          <Button variant="outline" size="sm" onClick={handleAddTag} className="h-8 w-8 p-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Attachments</Label>
                      <div className="mt-1 rounded-lg border border-dashed border-muted-foreground/50 p-8">
                        <div className="flex flex-col items-center justify-center text-center">
                          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                          <h3 className="mb-1 text-lg font-medium">Drag & drop files</h3>
                          <p className="mb-4 text-sm text-muted-foreground">or click to browse files</p>
                          <Button variant="outline">Upload Files</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="video" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="video-title">Title</Label>
                      <Input id="video-title" placeholder="Enter a descriptive title for your video" className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="video-description">Script</Label>
                      <Textarea
                        id="video-description"
                        placeholder="Write your video script here..."
                        className="mt-1 min-h-[200px]"
                        value={aiResult}
                        onChange={(e) => setAiResult(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Upload Video</Label>
                      <div className="mt-1 rounded-lg border border-dashed border-muted-foreground/50 p-8">
                        <div className="flex flex-col items-center justify-center text-center">
                          <Video className="mb-2 h-8 w-8 text-muted-foreground" />
                          <h3 className="mb-1 text-lg font-medium">Drag & drop video file</h3>
                          <p className="mb-4 text-sm text-muted-foreground">MP4, MOV, or WebM format (max 100MB)</p>
                          <Button variant="outline">Upload Video</Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Thumbnail</Label>
                      <div className="mt-1 rounded-lg border border-dashed border-muted-foreground/50 p-4">
                        <div className="flex flex-col items-center justify-center text-center">
                          <ImageIcon className="mb-2 h-6 w-6 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">Upload a thumbnail image</p>
                          <Button size="sm" variant="outline">
                            Select Image
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="image" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="image-title">Title</Label>
                      <Input id="image-title" placeholder="Enter a title for your image post" className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="image-caption">Caption/Prompt</Label>
                      <Textarea
                        id="image-caption"
                        placeholder="Add a caption or describe the image you want to generate..."
                        className="mt-1 min-h-[100px]"
                        value={aiResult}
                        onChange={(e) => setAiResult(e.target.value)}
                      />
                    </div>

                    {isGeneratingImage ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="mt-2 text-sm text-muted-foreground">Generating image...</p>
                      </div>
                    ) : generatedImage ? (
                      <div className="rounded-lg border p-2">
                        <img 
                          src={generatedImage} 
                          alt="Generated" 
                          className="w-full rounded-md object-cover"
                        />
                        <div className="mt-2 flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setGeneratedImage("")}
                          >
                            Generate New
                          </Button>
                          <Button size="sm">Use This Image</Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Label>Upload Image</Label>
                        <div className="mt-1 rounded-lg border border-dashed border-muted-foreground/50 p-8">
                          <div className="flex flex-col items-center justify-center text-center">
                            <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                            <h3 className="mb-1 text-lg font-medium">Drag & drop image</h3>
                            <p className="mb-4 text-sm text-muted-foreground">Or use the AI generator to create one</p>
                            <Button variant="outline">Upload Image</Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quiz" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="quiz-title">Quiz Title</Label>
                      <Input id="quiz-title" placeholder="Enter a title for your quiz" className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="quiz-description">Description</Label>
                      <Textarea
                        id="quiz-description"
                        placeholder="Describe what your quiz is about..."
                        className="mt-1 min-h-[100px]"
                      />
                    </div>

                    {generatedQuiz && generatedQuiz.questions && generatedQuiz.questions.length > 0 && (
                      <div className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="font-medium">Generated Quiz</h3>
                          <Button size="sm" onClick={applyGeneratedQuiz}>
                            Apply Quiz
                          </Button>
                        </div>
                        <div className="max-h-40 overflow-y-auto rounded bg-muted p-2">
                          <pre className="text-xs">{JSON.stringify(generatedQuiz, null, 2)}</pre>
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <Label>Questions</Label>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-1 h-4 w-4" />
                          Add Question
                        </Button>
                      </div>

                      <Card className="border border-muted">
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Question 1</CardTitle>
                            <Button variant="ghost" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-3">
                            <Input placeholder="Enter your question" />

                            <div>
                              <Label className="mb-2 block text-sm">Options</Label>
                              <div className="space-y-2">
                                {[1, 2, 3, 4].map((i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name="correct-answer"
                                      id={`option-${i}`}
                                      className="h-4 w-4 text-primary"
                                    />
                                    <Input placeholder={`Option ${i}`} className="flex-1" />
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                              <Button variant="ghost" size="sm" className="mt-2">
                                <Plus className="mr-1 h-4 w-4" />
                                Add Option
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline">Save Draft</Button>
            <Button onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish"
              )}
            </Button>
          </div>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Content Generator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="target-audience">Target Audience</Label>
                  <Select 
                    value={targetAudience} 
                    onValueChange={setTargetAudience}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elementary school students">Elementary School</SelectItem>
                      <SelectItem value="middle school students">Middle School</SelectItem>
                      <SelectItem value="high school students">High School</SelectItem>
                      <SelectItem value="college students">College</SelectItem>
                      <SelectItem value="adult learners">Adult Learners</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ai-prompt">What would you like to create?</Label>
                  <Textarea
                    id="ai-prompt"
                    placeholder={
                      contentType === "post" 
                        ? "E.g., Create a post about photosynthesis"
                        : contentType === "video"
                        ? "E.g., Create a script for a video about the solar system"
                        : contentType === "image"
                        ? "E.g., Create an educational illustration about cell division"
                        : "E.g., Create quiz questions about world history"
                    }
                    className="mt-1 min-h-[100px]"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleGenerateContent} 
                  className="w-full" 
                  disabled={aiGenerating || !aiPrompt}
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Content"
                  )}
                </Button>

                {aiResult && !generatedImage && !generatedQuiz && (
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 font-medium">Generated Content</h3>
                    <p className="text-sm whitespace-pre-line">{aiResult}</p>
                    <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => setAiResult("")}>
                      Clear
                    </Button>
                  </div>
                )}

                <div className="rounded-lg bg-muted p-4">
                  <h3 className="mb-2 text-sm font-medium">Tips</h3>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Be specific about your topic</li>
                    <li>• Include key points you want to cover</li>
                    <li>• Specify learning objectives</li>
                    <li>• Consider your audience's knowledge level</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

