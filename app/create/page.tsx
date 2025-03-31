"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Video, ImageIcon, FileText, HelpCircle, Sparkles, Upload, X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function CreatePage() {
  const [tags, setTags] = useState<string[]>(["education"])
  const [newTag, setNewTag] = useState("")
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiResult, setAiResult] = useState("")

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleGenerateContent = () => {
    if (!aiPrompt) return

    setAiGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      setAiResult(
        `Here's some educational content about "${aiPrompt}":\n\n${aiPrompt} is a fascinating topic that many students find engaging. When teaching this subject, it's important to focus on practical examples and interactive exercises. Studies show that students retain information better when they can apply concepts in real-world scenarios.`,
      )
      setAiGenerating(false)
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Content</h1>
        <p className="text-muted-foreground">Share your knowledge and inspire others</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="post" className="w-full">
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
                      <Input id="title" placeholder="Enter a descriptive title" className="mt-1" />
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
                      <Label htmlFor="video-description">Description</Label>
                      <Textarea
                        id="video-description"
                        placeholder="Describe what your video is about..."
                        className="mt-1 min-h-[100px]"
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
                      <Label htmlFor="image-caption">Caption</Label>
                      <Textarea
                        id="image-caption"
                        placeholder="Add a caption to your image..."
                        className="mt-1 min-h-[100px]"
                      />
                    </div>

                    <div>
                      <Label>Upload Images</Label>
                      <div className="mt-1 rounded-lg border border-dashed border-muted-foreground/50 p-8">
                        <div className="flex flex-col items-center justify-center text-center">
                          <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                          <h3 className="mb-1 text-lg font-medium">Drag & drop images</h3>
                          <p className="mb-4 text-sm text-muted-foreground">JPG, PNG, or GIF format (max 10MB each)</p>
                          <Button variant="outline">Upload Images</Button>
                        </div>
                      </div>
                    </div>
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
            <Button>Publish</Button>
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
                  <Label htmlFor="ai-prompt">What would you like to create?</Label>
                  <Textarea
                    id="ai-prompt"
                    placeholder="E.g., Create a post about photosynthesis for 5th graders"
                    className="mt-1 min-h-[100px]"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                </div>

                <Button onClick={handleGenerateContent} className="w-full" disabled={aiGenerating || !aiPrompt}>
                  {aiGenerating ? "Generating..." : "Generate Content"}
                </Button>

                {aiResult && (
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
                    <li>• Be specific about your target audience</li>
                    <li>• Mention the educational level</li>
                    <li>• Include the subject or topic</li>
                    <li>• Specify the content format</li>
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

