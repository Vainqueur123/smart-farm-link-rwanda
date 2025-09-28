const translations = {
  en: {
    // Navigation
    dashboard: "My Farm Dashboard",
    marketplace: "Marketplace",
    profile: "Profile",
    settings: "Settings",

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
    // Navigation
    dashboard: "Ibikoresho by'Umurima Wanjye",
    marketplace: "Isoko",
    profile: "Umwirondoro",
    settings: "Igenamiterere",

    // Common
    welcome: "Murakaza neza",
    loading: "Birashakisha...",
    save: "Bika",
    cancel: "Kuraguza",
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
    banana: "Amatooke",
    coffee: "Ikawa",
    tea: "Icyayi",
    cassava: "Imyumbati",
    rice: "Umuceri",
    sorghum: "Amasaka",
    wheat: "Ingano",
    groundnuts: "Ubunyobwa",
  },
}

let currentLanguage = "en"

// Mock useTranslation hook
export const useTranslation = () => {
  const t = (key: string) => {
    const translation = translations[currentLanguage as keyof typeof translations]
    return translation[key as keyof typeof translation] || key
  }

  const i18n = {
    changeLanguage: (lng: string) => {
      console.log("[v0] Mock language change:", lng)
      currentLanguage = lng
    },
    language: currentLanguage,
  }

  return { t, i18n }
}

export default {}
