const translations = {
  en: {
    // Navigation (lowercase keys)
    dashboard: "My Farm Dashboard",
    marketplace: "Marketplace",
    profile: "Profile",
    settings: "Settings",

    // Navigation (capitalized UI labels used in components)
    Dashboard: "Dashboard",
    "My Farm": "My Farm",
    Marketplace: "Marketplace",
    Transactions: "Transactions",
    Settings: "Settings",

    // Common
    welcome: "Welcome",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    continue: "Continue",
    back: "Back",
    next: "Next",

    // Authentication
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    phoneNumber: "Phone Number",
    password: "Password",
    confirmPassword: "Confirm Password",

    // Farm Management
    myFarm: "My Farm",
    addCrop: "Add Crop",
    activities: "Activities",
    schedule: "Schedule",
    harvest: "Harvest",

    // Marketplace
    buyNow: "Buy Now",
    sellCrop: "Sell Crop",
    pricePerKg: "Price per KG",
    quantity: "Quantity",
    quality: "Quality",

    // Districts
    selectDistrict: "Select Your District",
    province: "Province",

    // Crops
    maize: "Maize",
    beans: "Beans",
    irish_potato: "Irish Potato",
    sweet_potato: "Sweet Potato",
    banana: "Banana",
    coffee: "Coffee",
    tea: "Tea",
    cassava: "Cassava",
    rice: "Rice",
    sorghum: "Sorghum",
    wheat: "Wheat",
    groundnuts: "Groundnuts",
  },
  rw: {
    // Navigation (lowercase keys)
    dashboard: "Ibikoresho by'Umurima Wanjye",
    marketplace: "Isoko",
    profile: "Umwirondoro",
    settings: "Igenamiterere",

    // Navigation (capitalized UI labels used in components)
    Dashboard: "Ikibaho",
    "My Farm": "Umurima Wanjye",
    Marketplace: "Isoko",
    Transactions: "Imicungire y'Amafaranga",
    Settings: "Igenamiterere",
    "FarmLink RW": "FarmLink RW",

    // Common
    welcome: "Murakaza neza",
    loading: "Birashakisha...",
    save: "Bika",
    cancel: "Kuraho",
    continue: "Komeza",
    back: "Subira",
    next: "Ikurikira",

    // Authentication
    signIn: "Injira",
    signUp: "Iyandikishe",
    signOut: "Sohoka",
    phoneNumber: "Nimero ya Telefoni",
    password: "Ijambo ry'Ibanga",
    confirmPassword: "Emeza Ijambo ry'Ibanga",

    // Farm Management
    myFarm: "Umurima Wanjye",
    addCrop: "Ongeraho Igihingwa",
    activities: "Ibikorwa",
    schedule: "Gahunda",
    harvest: "Gusarura",

    // Marketplace
    buyNow: "Gura Ubu",
    sellCrop: "Gucuruza Igihingwa",
    pricePerKg: "Igiciro kuri KG",
    quantity: "Ingano",
    quality: "Ubwiza",

    // Districts
    selectDistrict: "Hitamo Akarere Kawe",
    province: "Intara",

    // Crops
    maize: "Ibigori",
    beans: "Ibishyimbo",
    irish_potato: "Ibirayi",
    sweet_potato: "Ibijumba",
    banana: "Imitoke",
    coffee: "Ikawa",
    tea: "Icyayi",
    cassava: "Imyumbati",
    rice: "Umuceri",
    sorghum: "Amasaka",
    wheat: "Ingano",
    groundnuts: "Ubunyobwa",
  },
} as const

let currentLanguage: "en" | "rw" = "en"
const subscribers = new Set<() => void>()

// Mock useTranslation hook (reactive)
export const useTranslation = () => {
  // Lightweight subscription to force re-render when language changes
  // Use inline React import to avoid a hard dependency at module level
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require("react") as typeof import("react")
  const [lang, setLang] = React.useState(currentLanguage)

  React.useEffect(() => {
    const cb = () => setLang(currentLanguage)
    subscribers.add(cb)
    return () => {
      subscribers.delete(cb)
    }
  }, [])

  const t = (key: string) => {
    const translation = translations[lang]
    return (translation as any)[key] || key
  }

  const i18n = {
    changeLanguage: (lng: string) => {
      const next = (lng === "rw" ? "rw" : "en") as typeof currentLanguage
      if (currentLanguage !== next) {
        console.log("[v0] Mock language change:", next)
        currentLanguage = next
        subscribers.forEach((fn) => {
          try {
            fn()
          } catch {}
        })
      }
    },
    get language() {
      return lang
    },
  }

  return { t, i18n }
}
