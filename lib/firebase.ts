interface MockAuthObserver {
  next?: (user: any) => void
  error?: (err: any) => void
  complete?: () => void
}

interface MockAuth {
  currentUser: any
  // Accepts either (email, password) or (auth, email, password)
  signInWithEmailAndPassword: (...args: any[]) => Promise<any>
  // Accepts either (email, password) or (auth, email, password)
  createUserWithEmailAndPassword: (...args: any[]) => Promise<any>
  // Accepts either () or (auth)
  signOut: (...args: any[]) => Promise<void>
  // Accepts (callback|observer) or (auth, callback|observer)
  onAuthStateChanged: (...args: any[]) => () => void
}

interface MockDb {
  collection: (name: string) => any
  doc: (path: string) => any
}

interface MockStorage {
  ref: (path: string) => any
}

// Mock Firebase services for development
// Simple subscriber registry
const authSubscribers: Array<(user: any) => void> = []

// Very simple in-memory document store so get/set/update work across the app
const mockStore: Record<string, any> = {}

const notifyAuthSubscribers = (user: any) => {
  for (const cb of authSubscribers) {
    try {
      cb(user)
    } catch (e) {
      // swallow
    }
  }
}

export const auth: MockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: async (...args: any[]) => {
    // Support (auth, email, password) or (email, password)
    const email = args.length === 3 ? args[1] : args[0]
    console.log("[v0] Mock sign in:", email)
    const uid = `uid_${btoa(unescape(encodeURIComponent(email))).replace(/=+/g,'')}`
    const user = { 
      uid, 
      email,
      displayName: email.split('@')[0]
    }
    auth.currentUser = user
    // Notify listeners about sign-in
    notifyAuthSubscribers(user)
    return { user }
  },
  createUserWithEmailAndPassword: async (...args: any[]) => {
    const email = args.length === 3 ? args[1] : args[0]
    console.log("[v0] Mock sign up:", email)
    const uid = `uid_${btoa(unescape(encodeURIComponent(email))).replace(/=+/g,'')}`
    const user = { 
      uid, 
      email,
      displayName: email.split('@')[0]
    }
    auth.currentUser = user
    // Notify listeners about sign-up (treated as signed-in)
    notifyAuthSubscribers(user)
    return { user }
  },
  signOut: async (..._args: any[]) => {
    console.log("[v0] Mock sign out")
    auth.currentUser = null
    notifyAuthSubscribers(null)
  },
  onAuthStateChanged: (...args: any[]) => {
    // Normalize arguments
    const maybeFirst = args[0]
    const maybeSecond = args[1]

    let callbackOrObserver: ((user: any) => void) | MockAuthObserver
    if (typeof maybeFirst === "function" || (maybeFirst && typeof maybeFirst.next === "function")) {
      callbackOrObserver = maybeFirst
    } else {
      callbackOrObserver = maybeSecond
    }

    const cb: (user: any) => void = (user) => {
      if (typeof callbackOrObserver === "function") {
        callbackOrObserver(user)
      } else if (callbackOrObserver && typeof callbackOrObserver.next === "function") {
        callbackOrObserver.next(user)
      }
    }

    // Add subscriber
    authSubscribers.push(cb)
    // Emit current state asynchronously to mimic Firebase behavior
    setTimeout(() => cb(auth.currentUser), 0)

    // Return unsubscribe
    return () => {
      const idx = authSubscribers.indexOf(cb)
      if (idx >= 0) authSubscribers.splice(idx, 1)
    }
  },
}

export const db: MockDb = {
  collection: (name: string) => ({
    doc: (id: string) => ({
      set: async (data: any) => {
        const path = `${name}/${id}`
        mockStore[path] = { ...(mockStore[path] || {}), ...data }
        console.log("[v0] Mock Firestore set:", path, mockStore[path])
      },
      get: async () => {
        const path = `${name}/${id}`
        const exists = Object.prototype.hasOwnProperty.call(mockStore, path)
        console.log("[v0] Mock Firestore get:", path, exists)
        return { exists, data: () => mockStore[path] }
      },
      update: async (data: any) => {
        const path = `${name}/${id}`
        mockStore[path] = { ...(mockStore[path] || {}), ...data }
        console.log("[v0] Mock Firestore update:", path, mockStore[path])
      },
    }),
  }),
  doc: (path: string) => ({
    set: async (data: any) => {
      mockStore[path] = { ...(mockStore[path] || {}), ...data }
      console.log("[v0] Mock Firestore doc set:", path, mockStore[path])
    },
    get: async () => {
      const exists = Object.prototype.hasOwnProperty.call(mockStore, path)
      console.log("[v0] Mock Firestore doc get:", path, exists)
      return { exists, data: () => mockStore[path] }
    },
    update: async (data: any) => {
      mockStore[path] = { ...(mockStore[path] || {}), ...data }
      console.log("[v0] Mock Firestore doc update:", path, mockStore[path])
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

// Mock realtime database for chat
type Listener = (value: any) => void
const rtdbStore: Record<string, any> = {}
const rtdbListeners: Record<string, Listener[]> = {}

export const rtdb = {
  ref: (path: string) => ({ path }),
}

export const onValue = (ref: { path: string }, cb: Listener) => {
  if (!rtdbListeners[ref.path]) rtdbListeners[ref.path] = []
  rtdbListeners[ref.path].push(cb)
  // fire initial
  cb(rtdbStore[ref.path])
  return () => {
    rtdbListeners[ref.path] = (rtdbListeners[ref.path] || []).filter((l) => l !== cb)
  }
}

export const pushValue = (ref: { path: string }, value: any) => {
  const list = rtdbStore[ref.path] || []
  const newList = [...list, value]
  rtdbStore[ref.path] = newList
  ;(rtdbListeners[ref.path] || []).forEach((cb) => cb(newList))
}

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
export interface FirebaseUser {
  uid: string
  email: string | null
}

const app = null
export default app
