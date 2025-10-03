// Offline service for data synchronization and caching
export interface OfflineData {
  id: string
  type: "listing" | "transaction" | "message" | "farm_data"
  data: any
  timestamp: number
  synced: boolean
  action: "create" | "update" | "delete"
}

export interface SyncStatus {
  isOnline: boolean
  lastSync: number
  pendingItems: number
  syncInProgress: boolean
}

class OfflineService {
  private dbName = "SmartFarmLinkDB"
  private dbVersion = 1
  private db: IDBDatabase | null = null
  private syncQueue: OfflineData[] = []
  private isOnline = true
  private syncInProgress = false

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeDB()
      this.setupOnlineDetection()
      this.startPeriodicSync()
    }
  }

  private async initializeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        console.log("[v0] Offline database initialized")
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        if (!db.objectStoreNames.contains("offline_data")) {
          const store = db.createObjectStore("offline_data", { keyPath: "id" })
          store.createIndex("type", "type", { unique: false })
          store.createIndex("synced", "synced", { unique: false })
          store.createIndex("timestamp", "timestamp", { unique: false })
        }

        if (!db.objectStoreNames.contains("cached_data")) {
          const cacheStore = db.createObjectStore("cached_data", { keyPath: "key" })
          cacheStore.createIndex("expiry", "expiry", { unique: false })
        }
      }
    })
  }

  private setupOnlineDetection(): void {
    this.isOnline = navigator.onLine

    window.addEventListener("online", () => {
      console.log("[v0] Connection restored - starting sync")
      this.isOnline = true
      this.syncPendingData()
    })

    window.addEventListener("offline", () => {
      console.log("[v0] Connection lost - enabling offline mode")
      this.isOnline = false
    })
  }

  private startPeriodicSync(): void {
    // Sync every 30 seconds when online
    setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.syncPendingData()
      }
    }, 30000)
  }

  async saveOfflineData(data: Omit<OfflineData, "id" | "timestamp" | "synced">): Promise<string> {
    if (!this.db) throw new Error("Database not initialized")

    const offlineData: OfflineData = {
      ...data,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      synced: false,
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offline_data"], "readwrite")
      const store = transaction.objectStore("offline_data")
      const request = store.add(offlineData)

      request.onsuccess = () => {
        console.log("[v0] Saved offline data:", offlineData.id)
        resolve(offlineData.id)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async getPendingData(): Promise<OfflineData[]> {
    if (!this.db) return []

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offline_data"], "readonly")
      const store = transaction.objectStore("offline_data")
      const index = store.index("synced")

      const results: OfflineData[] = []
      // Boolean keys are not valid IndexedDB keys across browsers, so
      // we iterate the index and filter by the record's value instead of using a key range.
      const request = index.openCursor()

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result
        if (cursor) {
          const value = cursor.value as OfflineData
          if (value && value.synced === false) {
            results.push(value)
          }
          cursor.continue()
        } else {
          resolve(results)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  async syncPendingData(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) return

    this.syncInProgress = true
    console.log("[v0] Starting data synchronization")

    try {
      const pendingData = await this.getPendingData()

      for (const item of pendingData) {
        try {
          await this.syncSingleItem(item)
          await this.markAsSynced(item.id)
        } catch (error) {
          console.error("[v0] Failed to sync item:", item.id, error)
        }
      }

      console.log("[v0] Synchronization completed")
    } catch (error) {
      console.error("[v0] Synchronization failed:", error)
    } finally {
      this.syncInProgress = false
    }
  }

  private async syncSingleItem(item: OfflineData): Promise<void> {
    // Simulate API sync - in real implementation, this would call actual APIs
    console.log("[v0] Syncing item:", item.type, item.action)

    switch (item.type) {
      case "listing":
        await this.syncListing(item)
        break
      case "transaction":
        await this.syncTransaction(item)
        break
      case "message":
        await this.syncMessage(item)
        break
      case "farm_data":
        await this.syncFarmData(item)
        break
    }
  }

  private async syncListing(item: OfflineData): Promise<void> {
    // Mock API call for listing sync
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("[v0] Synced listing:", item.data.crop)
  }

  private async syncTransaction(item: OfflineData): Promise<void> {
    // Mock API call for transaction sync
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log("[v0] Synced transaction:", item.data.amount)
  }

  private async syncMessage(item: OfflineData): Promise<void> {
    // Mock API call for message sync
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("[v0] Synced message")
  }

  private async syncFarmData(item: OfflineData): Promise<void> {
    // Mock API call for farm data sync
    await new Promise((resolve) => setTimeout(resolve, 1200))
    console.log("[v0] Synced farm data")
  }

  private async markAsSynced(id: string): Promise<void> {
    if (!this.db) return

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offline_data"], "readwrite")
      const store = transaction.objectStore("offline_data")
      const request = store.get(id)

      request.onsuccess = () => {
        const data = request.result
        if (data) {
          data.synced = true
          const updateRequest = store.put(data)
          updateRequest.onsuccess = () => resolve()
          updateRequest.onerror = () => reject(updateRequest.error)
        } else {
          resolve()
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  async cacheData(key: string, data: any, expiryMinutes = 60): Promise<void> {
    if (!this.db) return

    const cacheItem = {
      key,
      data,
      expiry: Date.now() + expiryMinutes * 60 * 1000,
      timestamp: Date.now(),
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["cached_data"], "readwrite")
      const store = transaction.objectStore("cached_data")
      const request = store.put(cacheItem)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getCachedData(key: string): Promise<any | null> {
    if (!this.db) return null

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["cached_data"], "readonly")
      const store = transaction.objectStore("cached_data")
      const request = store.get(key)

      request.onsuccess = () => {
        const result = request.result
        if (result && result.expiry > Date.now()) {
          resolve(result.data)
        } else {
          resolve(null)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  getSyncStatus(): SyncStatus {
    return {
      isOnline: this.isOnline,
      lastSync: Date.now(), // Mock - would track actual last sync
      pendingItems: this.syncQueue.length,
      syncInProgress: this.syncInProgress,
    }
  }

  // SMS fallback for critical operations when offline
  async sendSMSFallback(phoneNumber: string, message: string): Promise<boolean> {
    console.log("[v0] SMS fallback:", phoneNumber, message)

    // In real implementation, this would integrate with SMS gateway
    // For Rwanda, could use services like Africa's Talking or similar

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("[v0] SMS sent successfully")
        resolve(true)
      }, 2000)
    })
  }
}

export const offlineService = new OfflineService()
