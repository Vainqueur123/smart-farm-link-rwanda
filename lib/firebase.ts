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

// Mock Firebase services for development
export const auth: MockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: async (email: string, password: string) => {
    console.log("[v0] Mock sign in:", email)
    return { user: { uid: "mock-user-id", email } }
  },
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    console.log("[v0] Mock sign up:", email)
    return { user: { uid: "mock-user-id", email } }
  },
  signOut: async () => {
    console.log("[v0] Mock sign out")
  },
  onAuthStateChanged: (callback: (user: any) => void) => {
    console.log("[v0] Mock auth state changed")
    // Simulate no user initially
    setTimeout(() => callback(null), 100)
    return () => {}
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
