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
import type { FarmerProfile, BuyerProfile, AdvisorProfile, AdminProfile, UserRole, Notification, Message, Chat } from "./types"

interface AuthContextType {
  user: User | null
  userProfile: FarmerProfile | BuyerProfile | AdvisorProfile | AdminProfile | null
  farmerProfile: FarmerProfile | null
  buyerProfile: BuyerProfile | null
  advisorProfile: AdvisorProfile | null
  adminProfile: AdminProfile | null
  userRole: UserRole | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userType: UserRole, profileData: any) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (profile: Partial<FarmerProfile | BuyerProfile | AdvisorProfile | AdminProfile>) => Promise<void>
  refreshProfile: () => Promise<void>
  checkAccountExists: (email: string) => Promise<boolean>
  notifications: Notification[]
  messages: Message[]
  chats: Chat[]
  markNotificationAsRead: (notificationId: string) => Promise<void>
  sendMessage: (receiverId: string, content: string, type?: "text" | "image" | "voice" | "file", productId?: string) => Promise<void>
  getChatWithUser: (userId: string, productId?: string) => Promise<Chat | null>
  addNotification: (payload: Omit<Notification, "id" | "createdAt" | "isRead"> & Partial<Pick<Notification, "isRead">>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<FarmerProfile | BuyerProfile | AdvisorProfile | AdminProfile | null>(null)
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null)
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile | null>(null)
  const [advisorProfile, setAdvisorProfile] = useState<AdvisorProfile | null>(null)
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user: User | null) => {
      setUser(user)
      if (user) {
        await loadUserProfile(user.uid)
        await loadNotifications(user.uid)
        await loadMessages(user.uid)
        await loadChats(user.uid)
      } else {
        setUserProfile(null)
        setFarmerProfile(null)
        setBuyerProfile(null)
        setAdvisorProfile(null)
        setAdminProfile(null)
        setUserRole(null)
        setNotifications([])
        setMessages([])
        setChats([])
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      // Try to load from different collections based on user role
      const farmerDoc = await getDoc(doc(db, `farmers/${userId}`))
      const buyerDoc = await getDoc(doc(db, `buyers/${userId}`))
      const advisorDoc = await getDoc(doc(db, `advisors/${userId}`))
      const adminDoc = await getDoc(doc(db, `admins/${userId}`))

      if (farmerDoc && (farmerDoc as any).exists) {
        const data = typeof (farmerDoc as any).data === "function" ? (farmerDoc as any).data() : (farmerDoc as any)
        const profile: FarmerProfile = {
          ...data,
          registrationDate: data.registrationDate?.toDate?.() || data.registrationDate || new Date(),
          joinDate: data.joinDate?.toDate?.() || data.joinDate || new Date(),
        } as FarmerProfile
        setUserProfile(profile)
        setFarmerProfile(profile)
        setUserRole("farmer")
      } else if (buyerDoc && (buyerDoc as any).exists) {
        const data = typeof (buyerDoc as any).data === "function" ? (buyerDoc as any).data() : (buyerDoc as any)
        const profile: BuyerProfile = {
          ...data,
          registrationDate: data.registrationDate?.toDate?.() || data.registrationDate || new Date(),
          joinDate: data.joinDate?.toDate?.() || data.joinDate || new Date(),
        } as BuyerProfile
        setUserProfile(profile)
        setBuyerProfile(profile)
        setUserRole("buyer")
      } else if (advisorDoc && (advisorDoc as any).exists) {
        const data = typeof (advisorDoc as any).data === "function" ? (advisorDoc as any).data() : (advisorDoc as any)
        const profile: AdvisorProfile = {
          ...data,
          registrationDate: data.registrationDate?.toDate?.() || data.registrationDate || new Date(),
          joinDate: data.joinDate?.toDate?.() || data.joinDate || new Date(),
        } as AdvisorProfile
        setUserProfile(profile)
        setAdvisorProfile(profile)
        setUserRole("advisor")
      } else if (adminDoc && (adminDoc as any).exists) {
        const data = typeof (adminDoc as any).data === "function" ? (adminDoc as any).data() : (adminDoc as any)
        const profile: AdminProfile = {
          ...data,
          registrationDate: data.registrationDate?.toDate?.() || data.registrationDate || new Date(),
          joinDate: data.joinDate?.toDate?.() || data.joinDate || new Date(),
        } as AdminProfile
        setUserProfile(profile)
        setAdminProfile(profile)
        setUserRole("admin")
      } else {
        // No profile found - user needs to complete onboarding
        setUserProfile(null)
        setFarmerProfile(null)
        setBuyerProfile(null)
        setAdvisorProfile(null)
        setAdminProfile(null)
        setUserRole(null)
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
    }
  }

  const loadNotifications = async (userId: string) => {
    try {
      // Load from mock Firestore document `notifications/{userId}` as an array
      const snap = await getDoc(doc(db, `notifications/${userId}`))
      const data = (snap as any)?.data ? (snap as any).data() : null
      setNotifications(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error loading notifications:", error)
    }
  }

  const loadMessages = async (userId: string) => {
    try {
      // In a real app, this would load from Firestore
      // For now, return empty array
      setMessages([])
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const loadChats = async (userId: string) => {
    try {
      // In a real app, this would load from Firestore
      // For now, return empty array
      setChats([])
    } catch (error) {
      console.error("Error loading chats:", error)
    }
  }

  const checkAccountExists = async (email: string): Promise<boolean> => {
    try {
      // In a real app, this would check Firebase Auth or your database
      // For mock purposes, we'll simulate checking existing accounts
      const existingAccounts = [
        'jean.nkurunziza@smartfarm.rw',
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
      // Add a login success notification
      const now = new Date()
      const notif: Notification = {
        id: now.getTime().toString(),
        userId: auth.currentUser?.uid || "",
        title: "Login Successful",
        content: "You have successfully logged in.",
        type: "info",
        isRead: false,
        createdAt: now,
      }
      // Persist and update state
      const userId = auth.currentUser?.uid
      if (userId) {
        const existingSnap = await getDoc(doc(db, `notifications/${userId}`))
        const list = (existingSnap as any)?.data ? (existingSnap as any).data() : []
        const next = Array.isArray(list) ? [...list, notif] : [notif]
        await updateDoc(doc(db, `notifications/${userId}`), next)
        setNotifications(next)
      }
    } catch (error: any) {
      console.error("[AuthContext] Sign in error:", error)
      if (error.message === "Account does not exist") {
        throw new Error("Account does not exist")
      }
      throw new Error("Invalid credentials")
    }
  }

  const signUp = async (email: string, password: string, userType: UserRole, profileData: any) => {
    try {
      // Check if account already exists
      const accountExists = await checkAccountExists(email)
      if (accountExists) {
        throw new Error("Account already exists")
      }
      
      const userCredential = await createUserWithEmailAndPassword(email, password)
      const user = userCredential.user
      
      // Create profile based on user type
      const baseProfile = {
        id: user.uid,
        email: email,
        registrationDate: new Date(),
        joinDate: new Date(),
        profileComplete: false,
        isVerified: false,
        ...profileData
      }

      // Store profile in appropriate collection
      const collectionName = userType === 'farmer' ? 'farmers' : 
                           userType === 'buyer' ? 'buyers' : 
                           userType === 'advisor' ? 'advisors' : 'admins'
      
      await updateDoc(doc(db, `${collectionName}/${user.uid}`), baseProfile)
      
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
      await loadUserProfile(user.uid)
    }
  }

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      // In a real app, this would update Firestore
      setNotifications(prev => {
        const next = prev.map(notif => notif.id === notificationId ? { ...notif, isRead: true } : notif)
        const userId = auth.currentUser?.uid
        if (userId) {
          updateDoc(doc(db, `notifications/${userId}`), next)
        }
        return next
      })
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const addNotification: AuthContextType["addNotification"] = async (payload) => {
    try {
      if (!auth.currentUser) return
      const now = new Date()
      const notif: Notification = {
        id: now.getTime().toString(),
        userId: auth.currentUser.uid,
        title: payload.title,
        content: payload.content,
        type: payload.type || "info",
        isRead: payload.isRead ?? false,
        createdAt: now,
      }
      const snap = await getDoc(doc(db, `notifications/${auth.currentUser.uid}`))
      const list = (snap as any)?.data ? (snap as any).data() : []
      const next = Array.isArray(list) ? [...list, notif] : [notif]
      await updateDoc(doc(db, `notifications/${auth.currentUser.uid}`), next)
      setNotifications(next)
    } catch (error) {
      console.error("Error adding notification:", error)
    }
  }

  const sendMessage = async (receiverId: string, content: string, type: "text" | "image" | "voice" | "file" = "text", productId?: string) => {
    try {
      if (!user) throw new Error("No authenticated user")
      
      const message: Message = {
        id: Date.now().toString(),
        senderId: user.uid,
        receiverId,
        content,
        type,
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        productId
      }
      
      // In a real app, this would save to Firestore
      setMessages(prev => [...prev, message])
      
      // Update or create chat
      const existingChat = chats.find(chat => 
        chat.participants.includes(receiverId) && 
        (!productId || chat.productId === productId)
      )
      
      if (existingChat) {
        setChats(prev => 
          prev.map(chat => 
            chat.id === existingChat.id 
              ? { ...chat, lastMessage: message, lastActivity: new Date() }
              : chat
          )
        )
      } else {
        const newChat: Chat = {
          id: Date.now().toString(),
          participants: [user.uid, receiverId],
          lastMessage: message,
          lastActivity: new Date(),
          productId,
          isActive: true,
          createdAt: new Date()
        }
        setChats(prev => [...prev, newChat])
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const getChatWithUser = async (userId: string, productId?: string): Promise<Chat | null> => {
    try {
      return chats.find(chat => 
        chat.participants.includes(userId) && 
        (!productId || chat.productId === productId)
      ) || null
    } catch (error) {
      console.error("Error getting chat:", error)
      return null
    }
  }

  const value = {
    user,
    userProfile,
    farmerProfile,
    buyerProfile,
    advisorProfile,
    adminProfile,
    userRole,
    loading,
    signIn,
    signUp,
    logout,
    updateProfile,
    refreshProfile,
    checkAccountExists,
    notifications,
    messages,
    chats,
    markNotificationAsRead,
    sendMessage,
    getChatWithUser,
    addNotification,
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
