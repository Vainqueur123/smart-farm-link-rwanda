interface MockAuth {
  currentUser: any
  signInWithEmailAndPassword: (email: string, password: string) => Promise<any>
  createUserWithEmailAndPassword: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  onAuthStateChanged: (callback: (user: any) => void) => () => void
}

interface MockDb {
  collection: (name: string) => any
  doc: (path: string) => any
}

interface MockStorage {
  ref: (path: string) => any
}

let mockCurrentUser: any = null
const authStateCallbacks: ((user: any) => void)[] = []

const notifyAuthStateChange = (user: any) => {
  mockCurrentUser = user
  authStateCallbacks.forEach((callback) => {
    if (typeof callback === "function") {
      callback(user)
    }
  })
}

// Mock Firebase services for development
export const auth: MockAuth = {
  get currentUser() {
    return mockCurrentUser
  },
  signInWithEmailAndPassword: async (email: string, password: string) => {
    console.log("[v0] Mock sign in:", { currentUser: null })
    const user = { uid: "mock-user-id", email }
    setTimeout(() => notifyAuthStateChange(user), 100)
    return { user }
  },
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    console.log("[v0] Mock sign up:", { currentUser: null })
    const user = { uid: "mock-user-id", email }
    setTimeout(() => notifyAuthStateChange(user), 100)
    return { user }
  },
  signOut: async () => {
    console.log("[v0] Mock sign out")
    notifyAuthStateChange(null)
  },
  onAuthStateChanged: (callback: (user: any) => void) => {
    console.log("[v0] Mock auth state changed")
    if (typeof callback === "function") {
      authStateCallbacks.push(callback)
      // Call immediately with current user state
      setTimeout(() => callback(mockCurrentUser), 100)
    }

    return () => {
      const index = authStateCallbacks.indexOf(callback)
      if (index > -1) {
        authStateCallbacks.splice(index, 1)
      }
    }
  },
}

export const db: MockDb = {
  collection: (name: string) => ({
    doc: (id: string) => ({
      set: async (data: any) => {
        console.log("[v0] Mock Firestore set:", name, id, data)
        return Promise.resolve()
      },
      get: async () => {
        console.log("[v0] Mock Firestore get:", name, id)
        if (name === "farmers" && id === "mock-user-id") {
          return Promise.resolve({
            exists: true,
            data: () => ({
              phone: "+250788123456",
              district: "Kigali",
              farmSize: 2.5,
              primaryCrops: ["maize", "beans", "irish_potato"],
              profileComplete: true,
              registrationDate: new Date(),
            }),
          })
        }
        return Promise.resolve({ exists: false, data: () => null })
      },
      update: async (data: any) => {
        console.log("[v0] Mock Firestore update:", name, id, data)
        return Promise.resolve()
      },
    }),
  }),
  doc: (path: string) => ({
    set: async (data: any) => {
      console.log("[v0] Mock Firestore doc set:", path, data)
      return Promise.resolve()
    },
    get: async () => {
      console.log("[v0] Mock Firestore doc get:", path)
      return Promise.resolve({ exists: false, data: () => null })
    },
    update: async (data: any) => {
      console.log("[v0] Mock Firestore doc update:", path, data)
      return Promise.resolve()
    },
  }),
}

export const storage: MockStorage = {
  ref: (path: string) => ({
    put: async (file: any) => {
      console.log("[v0] Mock Storage upload:", path)
      return Promise.resolve({ ref: { getDownloadURL: () => Promise.resolve("mock-url") } })
    },
  }),
}

export const messaging = null

// Mock Firestore functions
export const doc = (db: any, path: string) => db.doc(path)
export const setDoc = async (docRef: any, data: any) => docRef.set(data)
export const getDoc = async (docRef: any) => docRef.get()
export const updateDoc = async (docRef: any, data: any) => docRef.update(data)

export const signInWithEmailAndPassword = auth.signInWithEmailAndPassword
export const createUserWithEmailAndPassword = auth.createUserWithEmailAndPassword
export const signOut = auth.signOut
export const onAuthStateChanged = auth.onAuthStateChanged

// Mock User type
export interface User {
  uid: string
  email: string | null
}

const app = null
export default app
