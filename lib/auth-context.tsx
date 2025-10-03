"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  doc,
  getDoc,
  updateDoc,
  auth,
  db,
} from "./firebase"
import type { FarmerProfile } from "./types"

interface AuthContextType {
  user: User | null
  farmerProfile: FarmerProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userType: 'farmer' | 'buyer') => Promise<void>
  logout: () => Promise<void>
  updateProfile: (profile: Partial<FarmerProfile>) => Promise<void>
  refreshProfile: () => Promise<void>
  checkAccountExists: (email: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user: User | null) => {
      setUser(user)
      if (user) {
        await loadFarmerProfile(user.uid)
      } else {
        setFarmerProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const loadFarmerProfile = async (userId: string) => {
    try {
      const profileDoc = await getDoc(doc(db, `farmers/${userId}`))
      if (profileDoc && (profileDoc as any).exists) {
        const data = typeof (profileDoc as any).data === "function" ? (profileDoc as any).data() : (profileDoc as any)
        setFarmerProfile({
          ...data,
          registrationDate: data.registrationDate?.toDate?.() || data.registrationDate || new Date(),
        } as FarmerProfile)
      } else {
        // Provide a sensible default profile in mock mode so the app is usable after login
        const defaultProfile: FarmerProfile = {
          id: userId,
          name: user?.displayName || "Demo Farmer",
          phone: "0780000000",
          district: "Kicukiro",
          sector: "Kagarama",
          cell: "",
          village: "",
          language: "en",
          farmSize: 1,
          primaryCrops: ["maize", "beans"],
          experienceLevel: "beginner",
          hasSmartphone: true,
          preferredContactMethod: "app",
          registrationDate: new Date(),
          profileComplete: true,
        }
        setFarmerProfile(defaultProfile)
      }
    } catch (error) {
      console.error("Error loading farmer profile:", error)
    }
  }

  const checkAccountExists = async (email: string): Promise<boolean> => {
    try {
      // In a real app, this would check Firebase Auth or your database
      // For mock purposes, we'll simulate checking existing accounts
      const existingAccounts = [
        'demo@smartfarm.rw',
        'farmer@example.com',
        'buyer@example.com'
      ]
      return existingAccounts.includes(email.toLowerCase())
    } catch (error) {
      console.error("Error checking account existence:", error)
      return false
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log("[AuthContext] Sign in called with:", email)
    try {
      // First check if account exists
      const accountExists = await checkAccountExists(email)
      if (!accountExists) {
        throw new Error("Account does not exist")
      }
      
      await signInWithEmailAndPassword(email, password)
      console.log("[AuthContext] Sign in successful")
    } catch (error: any) {
      console.error("[AuthContext] Sign in error:", error)
      if (error.message === "Account does not exist") {
        throw new Error("Account does not exist")
      }
      throw new Error("Invalid credentials")
    }
  }

  const signUp = async (email: string, password: string, userType: 'farmer' | 'buyer') => {
    try {
      // Check if account already exists
      const accountExists = await checkAccountExists(email)
      if (accountExists) {
        throw new Error("Account already exists")
      }
      
      await createUserWithEmailAndPassword(email, password)
      
      // Store user type in a mock database
      // In a real app, this would be stored in Firestore
      console.log(`User ${email} signed up as ${userType}`)
    } catch (error: any) {
      if (error.message === "Account already exists") {
        throw new Error("Account already exists")
      }
      throw error
    }
  }

  const logout = async () => {
    await signOut()
  }

  const updateProfile = async (profileData: Partial<FarmerProfile>) => {
    if (!user) throw new Error("No authenticated user")

    const updatedProfile = { ...farmerProfile, ...profileData }
    await updateDoc(doc(db, `farmers/${user.uid}`), updatedProfile)
    setFarmerProfile(updatedProfile as FarmerProfile)
  }

  const refreshProfile = async () => {
    if (user) {
      await loadFarmerProfile(user.uid)
    }
  }

  const value = {
    user,
    farmerProfile,
    loading,
    signIn,
    signUp,
    logout,
    updateProfile,
    refreshProfile,
    checkAccountExists,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
