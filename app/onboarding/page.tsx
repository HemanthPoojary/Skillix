"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  X,
  BookOpen,
  Code,
  Palette,
  Music,
  Film,
  Globe,
  Microscope,
  Calculator,
} from "lucide-react"

const interests = [
  { id: 1, name: "Literature", icon: BookOpen },
  { id: 2, name: "Programming", icon: Code },
  { id: 3, name: "Art", icon: Palette },
  { id: 4, name: "Music", icon: Music },
  { id: 5, name: "Film", icon: Film },
  { id: 6, name: "Languages", icon: Globe },
  { id: 7, name: "Science", icon: Microscope },
  { id: 8, name: "Mathematics", icon: Calculator },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    interests: [] as number[],
    avatar: null as File | null,
    educationLevel: "",
    tags: [] as string[],
    newTag: "",
  })

  const handleNext = () => {
    setStep(step + 1)
  }

  const handlePrev = () => {
    setStep(step - 1)
  }

  const handleComplete = () => {
    // In a real app, you would submit the data to the server
    router.push("/")
  }

  const handleInterestToggle = (id: number) => {
    if (formData.interests.includes(id)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter((i) => i !== id),
      })
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, id],
      })
    }
  }

  const handleAddTag = () => {
    if (formData.newTag && !formData.tags.includes(formData.newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.newTag],
        newTag: "",
      })
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-sm">
              <span>Getting Started</span>
              <span>Step {step} of 4</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="mb-2 text-2xl font-bold">Welcome to Skillix!</h1>
                <p className="text-muted-foreground">Let's set up your profile to get started</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Choose a unique username"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email address"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="education">Education Level</Label>
                  <select
                    id="education"
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">Select your education level</option>
                    <option value="middle-school">Middle School</option>
                    <option value="high-school">High School</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Profile Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="mb-2 text-2xl font-bold">Tell Us About Yourself</h1>
                <p className="text-muted-foreground">Share a bit about yourself with the community</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself, your interests, and what you hope to learn"
                    className="mt-1 min-h-[120px]"
                  />
                </div>

                <div>
                  <Label>Profile Picture</Label>
                  <div className="mt-1 flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-full bg-muted">
                      {formData.avatar ? (
                        <img
                          src={URL.createObjectURL(formData.avatar) || "/placeholder.svg"}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <Button variant="outline" onClick={() => document.getElementById("avatar-upload")?.click()}>
                      Upload Image
                    </Button>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormData({ ...formData, avatar: e.target.files[0] })
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Label>Tags</Label>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Add tags to help others find you based on your skills and interests
                  </p>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="ml-1 rounded-full hover:bg-muted">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={formData.newTag}
                      onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                      placeholder="Add a tag"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                    <Button variant="outline" onClick={handleAddTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="mb-2 text-2xl font-bold">Select Your Interests</h1>
                <p className="text-muted-foreground">Choose topics you're interested in to personalize your feed</p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {interests.map((interest) => {
                  const Icon = interest.icon
                  const isSelected = formData.interests.includes(interest.id)

                  return (
                    <div
                      key={interest.id}
                      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border p-4 transition-all hover:border-primary ${
                        isSelected ? "border-primary bg-primary/10" : "border-muted"
                      }`}
                      onClick={() => handleInterestToggle(interest.id)}
                    >
                      <div
                        className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-center text-sm font-medium">{interest.name}</span>
                      {isSelected && (
                        <div className="mt-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="mb-2 text-2xl font-bold">You're All Set!</h1>
                <p className="text-muted-foreground">Review your information and complete your registration</p>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-lg font-medium">Profile Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Username:</span>
                    <span className="font-medium">@{formData.username}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Education:</span>
                    <span className="font-medium">{formData.educationLevel}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bio:</span>
                    <p className="mt-1">{formData.bio}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Interests:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {formData.interests.map((id) => {
                        const interest = interests.find((i) => i.id === id)
                        return interest ? (
                          <Badge key={id} variant="secondary">
                            {interest.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tags:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-2 text-sm font-medium">What's Next?</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Explore educational content in your feed
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Connect with peers who share your interests
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Join challenges and events to earn points
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Create and share your own educational content
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={handlePrev}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete}>
                Complete Setup
                <Check className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

