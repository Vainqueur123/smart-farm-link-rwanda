"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  auth,
  db,
} from "./firebase"
import type { User, UserRole, FarmerProfile, BuyerProfile } from "./types"

interface AuthContextType {
  user: User | null
  farmerProfile: FarmerProfile | null
  buyerProfile: BuyerProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<User | null>
  signUp: (email: string, password: string, userType: UserRole) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (profile: Partial<FarmerProfile | BuyerProfile>) => Promise<void>
  refreshProfile: () => Promise<void>
  checkAccountExists: (email: string) => Promise<boolean>
  hasRole: (role: UserRole) => boolean
  isAdmin: () => boolean
  isFarmer: () => boolean
  isBuyer: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null)
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Load user data and role-based profile
        const userData = await loadUserData(firebaseUser.uid)
        setUser(userData)
        
        if (userData?.role === 'farmer') {
          await loadFarmerProfile(firebaseUser.uid)
        } else if (userData?.role === 'buyer') {
          await loadBuyerProfile(firebaseUser.uid)
        }
      } else {
        setUser(null)
        setFarmerProfile(null)
        setBuyerProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const loadUserData = async (userId: string): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, `users/${userId}`))
      if (userDoc && (userDoc as any).exists) {
        const data = typeof (userDoc as any).data === "function" ? (userDoc as any).data() : (userDoc as any)
        return {
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate?.() || data.lastLoginAt,
        } as User
      } else {
        // No user document found
        return null
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      return null
    }
  }

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
        // No farmer profile found - user needs to complete onboarding
        setFarmerProfile(null)
      }
    } catch (error) {
      console.error("Error loading farmer profile:", error)
    }
  }

  const loadBuyerProfile = async (userId: string) => {
    try {
      const profileDoc = await getDoc(doc(db, `buyers/${userId}`))
      if (profileDoc && (profileDoc as any).exists) {
        const data = typeof (profileDoc as any).data === "function" ? (profileDoc as any).data() : (profileDoc as any)
        setBuyerProfile({
          ...data,
          registrationDate: data.registrationDate?.toDate?.() || data.registrationDate || new Date(),
        } as BuyerProfile)
      } else {
        // No buyer profile found - user needs to complete onboarding
        setBuyerProfile(null)
      }
    } catch (error) {
      console.error("Error loading buyer profile:", error)
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

  const signIn = async (email: string, password: string): Promise<User | null> => {
    console.log("[AuthContext] Sign in called with:", email)
    setLoading(true)
    
    try {
      let userData: User | null = null;
      
      // Admin bypass: seed if needed and skip existence check
      if (email === 'admin@smartfarm.rw' && password === 'admin123') {
        const adminUid = `admin_${btoa('admin@smartfarm.rw')}`
        userData = {
          id: adminUid,
          email,
          role: 'admin',
          name: 'Administrator',
          isActive: true,
          isVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        await setDoc(doc(db, `users/${adminUid}`), userData)
      } else {
        // First check if account exists
        const accountExists = await checkAccountExists(email)
        if (!accountExists) {
          throw new Error("Account does not exist")
        }
      }
      
      const result = await signInWithEmailAndPassword(email, password)
      
      // If we don't have userData yet (non-admin case), load it
      if (!userData) {
        const userDoc = await getDoc(doc(db, `users/${result.user.uid}`))
        if (userDoc.exists()) {
          const data = userDoc.data()
          userData = {
            ...data,
            id: userDoc.id,
            createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || new Date(),
          } as User
        }
      }
      
      console.log("[AuthContext] Sign in successful")
      return userData
    } catch (error: any) {
      console.error("[AuthContext] Sign in error:", error)
      if (error.message === "Account does not exist") {
        throw new Error("Account does not exist")
      }
      throw new Error("Invalid credentials")
    }
  }

  const signUp = async (email: string, password: string, userType: UserRole) => {
    try {
      // Check if account already exists
      const accountExists = await checkAccountExists(email)
      if (accountExists) {
        throw new Error("Account already exists")
      }
      
      const result = await createUserWithEmailAndPassword(email, password)
      const userId = result.user.uid
      
      // Create user document with role
      const userData: User = {
        id: userId,
        email,
        role: userType,
        name: email.split('@')[0], // Use email prefix as default name
        isActive: true,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      await setDoc(doc(db, `users/${userId}`), userData)
      
      // Create role-specific profile
      if (userType === 'farmer') {
        const farmerProfile: FarmerProfile = {
          id: userId,
          userId,
          name: userData.name,
          phone: "",
          district: "Kicukiro",
          sector: "",
          cell: "",
          village: "",
          language: "en",
          farmSize: 0,
          primaryCrops: [],
          experienceLevel: "beginner",
          hasSmartphone: true,
          preferredContactMethod: "app",
          registrationDate: new Date(),
          profileComplete: false,
        }
        await setDoc(doc(db, `farmers/${userId}`), farmerProfile)
      } else if (userType === 'buyer') {
        const buyerProfile: BuyerProfile = {
          id: userId,
          userId,
          name: userData.name,
          businessType: "individual",
          location: {
            district: "Kicukiro",
            address: ""
          },
          preferredCategories: [],
          budgetRange: {
            min: 0,
            max: 0
          },
          paymentMethods: [],
          deliveryPreferences: {
            pickup: true,
            delivery: false,
            maxDistance: 10
          },
          registrationDate: new Date(),
          profileComplete: false,
        }
        await setDoc(doc(db, `buyers/${userId}`), buyerProfile)
      }
      
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

  const updateProfile = async (profileData: Partial<FarmerProfile | BuyerProfile>) => {
    if (!user) throw new Error("No authenticated user")

    if (user.role === 'farmer') {
      const updatedProfile = { ...farmerProfile, ...profileData }
      await updateDoc(doc(db, `farmers/${user.id}`), updatedProfile)
      setFarmerProfile(updatedProfile as FarmerProfile)
    } else if (user.role === 'buyer') {
      const updatedProfile = { ...buyerProfile, ...profileData }
      await updateDoc(doc(db, `buyers/${user.id}`), updatedProfile)
      setBuyerProfile(updatedProfile as BuyerProfile)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      if (user.role === 'farmer') {
        await loadFarmerProfile(user.id)
      } else if (user.role === 'buyer') {
        await loadBuyerProfile(user.id)
      }
    }
  }

  // Role-based helper functions
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role
  }

  const isAdmin = (): boolean => {
    return user?.role === 'admin'
  }

  const isFarmer = (): boolean => {
    return user?.role === 'farmer'
  }

  const isBuyer = (): boolean => {
    return user?.role === 'buyer'
  }

  const value = {
    user,
    farmerProfile,
    buyerProfile,
    loading,
    signIn,
    signUp,
    logout,
    updateProfile,
    refreshProfile,
    checkAccountExists,
    hasRole,
    isAdmin,
    isFarmer,
    isBuyer,
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
