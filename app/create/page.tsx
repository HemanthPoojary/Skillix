"use client"

import { useState, useEffect, useRef } from "react"
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

// Draft content interface
interface DraftContent {
  contentType: string;
  title: string;
  content: string;
  tags: string[];
  mediaUrl: string;
  quizData: any;
}

export default function CreatePage() {
  const [mounted, setMounted] = useState(false)
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
  const [pageError, setPageError] = useState<string | null>(null)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isApiAvailable, setIsApiAvailable] = useState(true)

  // Handle mounting state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check for saved draft and API availability on component mount
  useEffect(() => {
    if (!mounted) return;

    setPageError(null)
    
    // Check if OpenAI API is properly configured
    const checkApiAvailability = async () => {
      try {
        const testResult = await generateTextContent("test")
        if (testResult.includes("service is currently unavailable") || 
            testResult.includes("failed") || 
            testResult.includes("API key is missing")) {
          setIsApiAvailable(false)
          console.warn("OpenAI API appears to be unavailable")
        } else {
          setIsApiAvailable(true)
        }
      } catch (error) {
        console.error("Error checking API availability:", error)
        setIsApiAvailable(false)
      }
    }
    
    checkApiAvailability()
    
    // Load draft if exists
    const savedDraft = localStorage.getItem('contentDraft')
    if (savedDraft) {
      try {
        const draftData: DraftContent = JSON.parse(savedDraft)
        setContentType(draftData.contentType)
        setTitle(draftData.title)
        setAiResult(draftData.content)
        setTags(draftData.tags)
        setGeneratedImage(draftData.mediaUrl)
        if (draftData.quizData) {
          setGeneratedQuiz(draftData.quizData)
        }
        setHasDraft(true)
        
        toast({
          title: "Draft loaded",
          description: "Your previous draft has been loaded. You can continue editing or publish it.",
        })
      } catch (error) {
        console.error("Error loading draft:", error)
        localStorage.removeItem('contentDraft')
      }
    }
  }, [mounted, toast])

  // If not mounted yet, return null or a loading state
  if (!mounted) {
    return null;
  }

  const handleAddTag = () => {
    try {
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
        setNewTag("")
      }
    } catch (error) {
      console.error("Error adding tag:", error)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    try {
      setTags(tags.filter((tag) => tag !== tagToRemove))
    } catch (error) {
      console.error("Error removing tag:", error)
    }
  }

  const handleGenerateContent = async () => {
    if (!aiPrompt) return
    
    // Check if API is available
    if (!isApiAvailable) {
      toast({
        title: "AI Service Unavailable",
        description: "The AI service is currently unavailable. Please try again later or create content manually.",
        variant: "destructive"
      })
      return
    }

    setAiGenerating(true)
    setAiResult("")
    setGeneratedImage("")
    setGeneratedQuiz(null)

    try {
      // Different generation based on the selected tab
      switch (contentType) {
        case "post":
          try {
            const generatedText = await generateTextContent(
              `Write an educational post about ${aiPrompt} for ${targetAudience}. Make it informative and engaging. Include a clear title at the beginning separated by two newlines from the content.`
            )
            
            // Extract title from the content if it starts with a title pattern
            if (generatedText.includes("\n\n")) {
              const parts = generatedText.split("\n\n", 2)
              if (parts.length >= 2) {
                // Set the title from the first part
                setTitle(parts[0].replace(/^#+ /, '').trim())
                // Set the content from the rest
                setAiResult(generatedText.substring(parts[0].length + 2).trim())
              } else {
                setAiResult(generatedText)
              }
            } else {
              setAiResult(generatedText)
            }
            
            // Automatically generate an image for the post
            try {
              toast({
                title: "Generating image",
                description: "Creating a visual for your post. This may take a moment.",
              })
              
              const imagePrompt = await generateImagePrompt(
                `Educational illustration about ${aiPrompt} for ${targetAudience}, visual representation of the concept`
              )
              
              if (imagePrompt) {
                const imageUrl = await generateImage(imagePrompt)
                if (imageUrl) {
                  setGeneratedImage(imageUrl)
                }
              }
            } catch (err) {
              console.error("Error auto-generating image:", err)
              // Don't block the content creation if image fails
            }
          } catch (err) {
            console.error("Error generating post content:", err)
            toast({
              title: "Content generation failed",
              description: "Could not generate post content. Please try again.",
              variant: "destructive"
            })
          }
          break

        case "video":
          try {
            const script = await generateVideoScript(
              `Create an educational video script about ${aiPrompt} for ${targetAudience}. Include a title at the beginning separated by two newlines from the content.`,
              "5 minutes", 
              targetAudience
            )
            
            // Extract title from the video script
            if (script.includes("\n\n")) {
              const parts = script.split("\n\n", 2)
              if (parts.length >= 2) {
                setTitle(parts[0].replace(/^#+ /, '').trim())
                setAiResult(script.substring(parts[0].length + 2).trim())
              } else {
                setAiResult(script)
              }
            } else {
              setAiResult(script)
            }
            
            // Also generate a thumbnail image for the video
            try {
              toast({
                title: "Generating thumbnail",
                description: "Creating a thumbnail for your video. This may take a moment.",
              })
              
              const thumbnailPrompt = await generateImagePrompt(
                `Thumbnail image for educational video about ${aiPrompt}`
              )
              
              if (thumbnailPrompt) {
                const thumbnailUrl = await generateImage(thumbnailPrompt)
                if (thumbnailUrl) {
                  setGeneratedImage(thumbnailUrl)
                }
              }
            } catch (err) {
              console.error("Error generating thumbnail:", err)
            }
          } catch (err) {
            console.error("Error generating video script:", err)
            toast({
              title: "Script generation failed",
              description: "Could not generate video script. Please try again.",
              variant: "destructive"
            })
          }
          break

        case "image":
          try {
            const imagePrompt = await generateImagePrompt(
              `Educational illustration about ${aiPrompt} for ${targetAudience}. Include a title for this illustration.`
            )
            
            if (!imagePrompt) {
              throw new Error("Failed to generate image prompt")
            }
            
            // Extract title if possible
            const titleMatch = imagePrompt.match(/^(Title: (.+?)(\n|$))/i)
            if (titleMatch && titleMatch[2]) {
              setTitle(titleMatch[2].trim())
            } else {
              // Default title based on the prompt
              setTitle(`${aiPrompt.charAt(0).toUpperCase() + aiPrompt.slice(1)} Illustration`)
            }
            
            toast({
              title: "Image prompt generated",
              description: "Now generating the image based on this prompt. This may take a moment.",
            })
            setAiResult(imagePrompt)
            
            // Generate the actual image
            setIsGeneratingImage(true)
            try {
              const imageUrl = await generateImage(imagePrompt)
              if (imageUrl) {
                setGeneratedImage(imageUrl)
              } else {
                throw new Error("No image URL returned")
              }
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
          } catch (err) {
            console.error("Error with image prompt:", err)
            toast({
              title: "Image prompt failed",
              description: "Could not generate the image prompt. Please try again.",
              variant: "destructive"
            })
            setIsGeneratingImage(false)
          }
          break

        case "quiz":
          try {
            // Set a default quiz title
            setTitle(`Quiz: ${aiPrompt.charAt(0).toUpperCase() + aiPrompt.slice(1)}`)
            
            const quizData = await generateQuizQuestions(aiPrompt, "medium", 5)
            if (quizData) {
              setGeneratedQuiz(quizData)
              setAiResult(JSON.stringify(quizData, null, 2))
            } else {
              throw new Error("No quiz data returned")
            }
          } catch (err) {
            console.error("Error generating quiz:", err)
            toast({
              title: "Quiz generation failed",
              description: "Could not generate quiz questions. Please try again.",
              variant: "destructive"
            })
          }
          break

        default:
          try {
            const defaultContent = await generateTextContent(aiPrompt)
            setAiResult(defaultContent)
          } catch (err) {
            console.error("Error generating default content:", err)
            toast({
              title: "Content generation failed",
              description: "Could not generate content. Please try again.",
              variant: "destructive"
            })
          }
      }
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Generation Failed",
        description: "Could not generate content. Please try again later.",
        variant: "destructive"
      })
      setPageError("Content generation failed. Please refresh the page and try again.")
    } finally {
      setAiGenerating(false)
    }
  }

  // Apply generated quiz data to the quiz form
  const applyGeneratedQuiz = () => {
    try {
      if (!generatedQuiz || !generatedQuiz.questions) {
        toast({
          title: "No quiz data",
          description: "Please generate quiz questions first.",
          variant: "destructive"
        })
        return
      }
      
      // Set the quiz title if not already set
      if (!title && generatedQuiz.title) {
        setTitle(generatedQuiz.title)
      }
      
      toast({
        title: "Quiz Applied",
        description: "Generated quiz questions have been applied to the form.",
      })
    } catch (error) {
      console.error("Error applying quiz:", error)
      toast({
        title: "Error applying quiz",
        description: "Could not apply quiz questions. Please try again.",
        variant: "destructive"
      })
    }
  }

  // This function handles selecting the correct answer for a quiz question
  const handleSelectCorrectAnswer = (questionIndex: number, optionIndex: number) => {
    if (!generatedQuiz || !generatedQuiz.questions) return
    
    const updatedQuiz = {...generatedQuiz}
    updatedQuiz.questions[questionIndex].correctAnswerIndex = optionIndex
    
    setGeneratedQuiz(updatedQuiz)
  }

  // Set content type based on the selected tab
  const handleTabChange = (value: string) => {
    try {
      setContentType(value)
    } catch (error) {
      console.error("Error changing tab:", error)
    }
  }

  // Handle save draft
  const handleSaveDraft = () => {
    if (!title && !aiResult && !generatedImage && !generatedQuiz) {
      toast({
        title: "Nothing to save",
        description: "Please create some content before saving a draft.",
        variant: "destructive"
      })
      return
    }

    setIsSavingDraft(true)

    try {
      const draftContent: DraftContent = {
        contentType,
        title,
        content: aiResult,
        tags,
        mediaUrl: generatedImage,
        quizData: generatedQuiz
      }

      localStorage.setItem('contentDraft', JSON.stringify(draftContent))
      
      setHasDraft(true)
      toast({
        title: "Draft saved",
        description: "Your content has been saved as a draft. You can continue later.",
      })
    } catch (error) {
      console.error("Error saving draft:", error)
      toast({
        title: "Failed to save draft",
        description: "There was an error saving your draft. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSavingDraft(false)
    }
  }

  // Clear draft
  const clearDraft = () => {
    localStorage.removeItem('contentDraft')
    setHasDraft(false)
    setTitle("")
    setAiResult("")
    setTags(["education"])
    setGeneratedImage("")
    setGeneratedQuiz(null)
    
    toast({
      title: "Draft cleared",
      description: "Your draft has been cleared. You can start fresh.",
    })
  }

  // Handle publish content
  const handlePublish = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to publish content",
        variant: "destructive"
      })
      return
    }

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please add a title to your content",
        variant: "destructive"
      })
      return
    }

    try {
      setIsPublishing(true)
      setPageError(null)

      // Prepare post data
      const postData = {
        type: contentType,
        title: title.trim(),
        description: contentType === "quiz" && generatedQuiz 
          ? JSON.stringify(generatedQuiz)
          : aiResult.trim(),
        media_url: generatedImage || "",
        tags: tags
      }

      // Create the post
      const post = await createPost(user.id, postData)
      
      if (!post || !post.id) {
        throw new Error("Failed to create post")
      }

      // Show success message
      toast({
        title: "Success!",
        description: "Your content has been published",
      })

      // Clear form and draft
      localStorage.removeItem('contentDraft')
      setHasDraft(false)
      setTitle("")
      setAiResult("")
      setTags(["education"])
      setGeneratedImage("")
      setGeneratedQuiz(null)
      setAiPrompt("")

      // Navigate to home page and force refresh
      router.push("/")
      router.refresh()

    } catch (error) {
      console.error("Error publishing content:", error)
      
      // Show error message
      toast({
        title: "Publishing failed",
        description: error instanceof Error 
          ? error.message 
          : "Could not publish your content. Please try again.",
        variant: "destructive"
      })
      
      setPageError("Failed to publish content. Please try again.")
    } finally {
      setIsPublishing(false)
    }
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null)
    
    const file = event.target.files?.[0] || null
    if (!file) return
    
    // Check file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg']
    
    if (contentType === 'image' && !validImageTypes.includes(file.type)) {
      setUploadError("Please upload an image file (JPEG, PNG, GIF, or WEBP)")
      return
    }
    
    if (contentType === 'video' && !validVideoTypes.includes(file.type)) {
      setUploadError("Please upload a video file (MP4, WebM, or OGG)")
      return
    }
    
    // Check file size (max 10MB for images, 100MB for videos)
    const maxSize = contentType === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      setUploadError(`File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB`)
      return
    }
    
    setUploadedFile(file)
    
    // Create object URL for preview
    const fileUrl = URL.createObjectURL(file)
    setGeneratedImage(fileUrl)
    
    toast({
      title: "File uploaded",
      description: `Your ${contentType === 'video' ? 'video' : 'image'} has been uploaded successfully.`,
    })
  }
  
  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  // Helper function to generate AI image for current content
  const generateAIImageForContent = async () => {
    if (!aiResult && !title) {
      toast({
        title: "Content required",
        description: "Please generate or write some content first to create a relevant image.",
        variant: "destructive"
      })
      return
    }
    
    setIsGeneratingImage(true)
    
    try {
      toast({
        title: "Generating image",
        description: "Creating an image based on your content. This may take a moment.",
      })
      
      // Use title and content for better context
      const promptBase = aiResult || title
      const imagePrompt = await generateImagePrompt(
        `Educational illustration about ${promptBase} for ${targetAudience}`
      )
      
      if (!imagePrompt) {
        throw new Error("Failed to generate image prompt")
      }
      
      setAiResult(imagePrompt)
      
      const imageUrl = await generateImage(imagePrompt)
      if (imageUrl) {
        setGeneratedImage(imageUrl)
        toast({
          title: "Image created",
          description: "Your AI-generated image is ready.",
        })
      } else {
        throw new Error("No image URL returned")
      }
    } catch (err) {
      console.error("Error generating AI image:", err)
      toast({
        title: "Image generation failed",
        description: "Could not generate the image. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Add a warning component for API unavailability
  const ApiWarningBanner = () => {
    if (isApiAvailable) return null
    
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
        <div className="flex items-center">
          <div className="py-1">
            <svg className="h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="font-bold">AI Service Limited</p>
            <p className="text-sm">The AI content generation service is currently unavailable. You can still create content manually.</p>
          </div>
        </div>
      </div>
    )
  }

  // If there's a critical error, show a fallback UI
  if (pageError) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-red-500">Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{pageError}</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Content</h1>
        <p className="text-muted-foreground">Share your knowledge and inspire others</p>
      </div>
      
      {/* Display API warning if needed */}
      <ApiWarningBanner />

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
                      <Input 
                        id="title" 
                        placeholder="Enter a descriptive title" 
                        className="mt-1" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                      />
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
                      <Label>Image</Label>
                      {generatedImage ? (
                        <div className="mt-2 rounded-lg border p-2">
                          <img 
                            src={generatedImage} 
                            alt="Post image" 
                            className="w-full rounded-md object-cover max-h-[300px]"
                          />
                          <div className="mt-2 flex justify-between">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setGeneratedImage("")}
                            >
                              Remove
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={generateAIImageForContent}
                              disabled={isGeneratingImage}
                            >
                              {isGeneratingImage ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                "Create New with AI"
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 rounded-lg border border-dashed border-muted-foreground/50 p-6">
                          <div className="flex flex-col items-center justify-center text-center">
                            {isGeneratingImage ? (
                              <>
                                <Loader2 className="mb-2 h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">Generating image...</p>
                              </>
                            ) : (
                              <>
                                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                                <h3 className="mb-1 text-lg font-medium">Add an image</h3>
                                <div className="mt-4 flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    onClick={triggerFileUpload}
                                  >
                                    Upload Image
                                  </Button>
                                  <Button 
                                    onClick={generateAIImageForContent}
                                    disabled={isGeneratingImage}
                                  >
                                    Create with AI
                                  </Button>
                                  <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                  />
                                </div>
                                {uploadError && (
                                  <p className="mt-2 text-sm text-red-500">{uploadError}</p>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}
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
                      <Input 
                        id="video-title" 
                        placeholder="Enter a descriptive title for your video" 
                        className="mt-1" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
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
                      {generatedImage ? (
                        <div className="mt-2 rounded-lg border p-2">
                          <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                            <Video className="h-16 w-16 text-muted-foreground/50" />
                          </div>
                          <p className="mt-2 text-sm text-center text-muted-foreground">Video upload simulation (actual upload would be implemented here)</p>
                          <div className="mt-2 flex justify-between">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setGeneratedImage("")}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 rounded-lg border border-dashed border-muted-foreground/50 p-8">
                          <div className="flex flex-col items-center justify-center text-center">
                            <Video className="mb-2 h-8 w-8 text-muted-foreground" />
                            <h3 className="mb-1 text-lg font-medium">Drag & drop video file</h3>
                            <p className="mb-4 text-sm text-muted-foreground">MP4, MOV, or WebM format (max 100MB)</p>
                            <Button 
                              variant="outline"
                              onClick={triggerFileUpload}
                            >
                              Upload Video
                            </Button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept="video/*"
                              onChange={handleFileUpload}
                            />
                            {uploadError && (
                              <p className="mt-2 text-sm text-red-500">{uploadError}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Thumbnail</Label>
                      <div className="mt-1 rounded-lg border border-dashed border-muted-foreground/50 p-4">
                        {generatedImage ? (
                          <div className="flex flex-col items-center">
                            <img 
                              src={generatedImage} 
                              alt="Video thumbnail" 
                              className="w-full rounded-md object-cover max-h-[200px]"
                            />
                            <div className="mt-2 flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setGeneratedImage("")}
                              >
                                Remove
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={generateAIImageForContent}
                                disabled={isGeneratingImage}
                              >
                                {isGeneratingImage ? "Generating..." : "Create New with AI"}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center">
                            {isGeneratingImage ? (
                              <>
                                <Loader2 className="mb-2 h-6 w-6 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">Generating thumbnail...</p>
                              </>
                            ) : (
                              <>
                                <ImageIcon className="mb-2 h-6 w-6 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground">Add a thumbnail image</p>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={triggerFileUpload}
                                  >
                                    Upload Image
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={generateAIImageForContent}
                                    disabled={!aiResult || isGeneratingImage}
                                  >
                                    Create with AI
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
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
                      <Input 
                        id="image-title" 
                        placeholder="Enter a title for your image post" 
                        className="mt-1" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
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
                            Remove
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleGenerateContent}
                            disabled={!aiPrompt || aiGenerating}
                          >
                            Generate New
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Label>Image</Label>
                        <div className="mt-1 rounded-lg border border-dashed border-muted-foreground/50 p-8">
                          <div className="flex flex-col items-center justify-center text-center">
                            <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                            <h3 className="mb-1 text-lg font-medium">Add an image</h3>
                            <p className="mb-4 text-sm text-muted-foreground">Upload or generate with AI</p>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline"
                                onClick={triggerFileUpload}
                              >
                                Upload Image
                              </Button>
                              <Button
                                onClick={handleGenerateContent}
                                disabled={!aiPrompt || aiGenerating}
                              >
                                Generate with AI
                              </Button>
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                              />
                            </div>
                            {uploadError && (
                              <p className="mt-2 text-sm text-red-500">{uploadError}</p>
                            )}
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
                      <Input 
                        id="quiz-title" 
                        placeholder="Enter a title for your quiz" 
                        className="mt-1" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="quiz-description">Description</Label>
                      <Textarea
                        id="quiz-description"
                        placeholder="Describe what your quiz is about..."
                        className="mt-1 min-h-[100px]"
                        value={aiResult.includes('{') ? '' : aiResult}
                        onChange={(e) => setAiResult(e.target.value)}
                      />
                    </div>

                    {generatedQuiz && generatedQuiz.questions && generatedQuiz.questions.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Quiz Questions</h3>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setGeneratedQuiz(null)}
                          >
                            Clear Questions
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {generatedQuiz.questions.map((question: any, qIndex: number) => (
                            <Card key={qIndex} className="border border-muted">
                              <CardHeader className="p-4">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base">Question {qIndex + 1}</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <div className="space-y-3">
                                  <p className="font-medium">{question.question}</p>

                                  <div>
                                    <Label className="mb-2 block text-sm">Options</Label>
                                    <div className="space-y-2">
                                      {question.options.map((option: string, oIndex: number) => (
                                        <div 
                                          key={oIndex} 
                                          className={`flex items-center gap-2 p-2 rounded-md 
                                            ${question.correctAnswerIndex === oIndex ? 'bg-green-100 dark:bg-green-900/20' : ''}`}
                                        >
                                          <input
                                            type="radio"
                                            name={`correct-answer-${qIndex}`}
                                            id={`option-${qIndex}-${oIndex}`}
                                            className="h-4 w-4 text-primary"
                                            checked={question.correctAnswerIndex === oIndex}
                                            onChange={() => handleSelectCorrectAnswer(qIndex, oIndex)}
                                          />
                                          <Label 
                                            htmlFor={`option-${qIndex}-${oIndex}`}
                                            className={`flex-1 cursor-pointer ${question.correctAnswerIndex === oIndex ? 'font-medium' : ''}`}
                                          >
                                            {option}
                                          </Label>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-muted-foreground/50 p-6 text-center">
                        <HelpCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                        <h3 className="mb-1 text-lg font-medium">No quiz questions yet</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                          Use the AI generator to create quiz questions, or add them manually
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={handleGenerateContent} 
                          disabled={!aiPrompt || aiGenerating}
                        >
                          {aiGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            "Generate Quiz Questions"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end gap-2">
            {hasDraft ? (
              <Button variant="outline" onClick={clearDraft}>
                Clear Draft
              </Button>
            ) : (
              <Button variant="outline" onClick={handleSaveDraft} disabled={isSavingDraft}>
                {isSavingDraft ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Draft"
                )}
              </Button>
            )}
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

