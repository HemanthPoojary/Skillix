import { create } from 'zustand'

interface UserProfile {
  name: string
  username: string
  bio: string
  interests: string[]
  avatar: string
}

interface ProfileStore {
  profile: UserProfile
  updateProfile: (profile: Partial<UserProfile>) => void
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: {
    name: "Alex Johnson",
    username: "@alexj",
    bio: "Math enthusiast and science lover. Always learning!",
    interests: ["Math", "Science", "Coding"],
    avatar: "/placeholder.svg?height=128&width=128",
  },
  updateProfile: (newProfile) => 
    set((state) => ({
      profile: { ...state.profile, ...newProfile }
    })),
})) 