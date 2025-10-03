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

    // Landing page
    heroTitle: "Smart Farm Link Rwanda",
    heroSub:
      "Empowering farmers across all 30 districts of Rwanda with smart agriculture technology. From seedling to sale, we're digitizing Rwanda's agricultural future.",
    getStarted: "Get Started",
    installApp: "Install App",
    featuresTitle: "Everything you need to succeed",
    featuresSubtitle: "Comprehensive tools designed specifically for Rwandan farmers",
    feature_smartFarm: "Smart Farm Management",
    feature_smartFarm_desc: "Track crops, schedule activities, and get district-specific recommendations",
    feature_marketPrices: "Real-Time Market Prices",
    feature_marketPrices_desc: "Compare prices across all 30 districts and find the best deals",
    feature_connectBuyers: "Connect with Buyers",
    feature_connectBuyers_desc: "Direct marketplace connecting farmers with buyers nationwide",
    feature_securePayments: "Secure Payments",
    feature_securePayments_desc: "Mobile money integration with escrow protection",
    feature_bilingual: "Bilingual Support",
    feature_bilingual_desc: "Available in Kinyarwanda and English",
    feature_offline: "Works Offline",
    feature_offline_desc: "Full functionality even without internet connection",
    stats_districts: "Districts Covered",
    stats_farmers: "Farmers Ready",
    stats_support: "Support Available",
    cta_title: "Ready to transform your farming?",
    cta_sub:
      "Join thousands of farmers already using Smart Farm Link Rwanda to increase their income and improve their harvests.",
    startJourney: "Start Your Journey Today",
    role_select_title: "Choose your role",
    role_select_sub: "Are you signing up as a Buyer or a Farmer?",
    role_farmer: "I'm a Farmer",
    role_buyer: "I'm a Buyer",

    // Auth pages
    signinDescription: "Enter your credentials to access your farm dashboard",
    signupDescription: "Create your account to start smart farming",
    noAccountQuestion: "Don't have an account?",
    haveAccountQuestion: "Already have an account?",
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
    // Settings and common UI phrases
    "Manage your account and app preferences": "Tunganya konti yawe n'ibyo ukunda muri porogaramu",
    "Profile Information": "Amakuru y'Umwirondoro",
    "Phone Number": "Nimero ya Telefoni",
    "District": "Akarere",
    "Sector": "Umurenge",
    "Farm Size": "Ingano y'Umurima",
    "Edit Profile": "Hindura Umwirondoro",
    "Language Settings": "Igenamiterere ry'Ururimi",
    "App Language": "Ururimi rwa Porogaramu",
    "Choose your preferred language for the app interface": "Hitamo ururimi ukunda gukoresha muri porogaramu",
    "Notifications": "Amakuru",
    "Notification Preferences": "Uko ushaka kwakira Amakuru",
    "Market Price Alerts": "Amamenyesha y'Ibiciro by'Isoko",
    "Get notified when crop prices change in your district": "Menyeshwa igihe ibiciro by'ibihingwa bihindutse mu karere kawe",
    "Payment Updates": "Amakuru y'Imisanzu/Amakuru y'Ishyura",
    "Receive notifications about payment status changes": "Akira ubutumwa ku mihindagurikire y'ishyura",
    "Weather Updates": "Amakuru y'Ihehere ry'Ikirere",
    "Get weather forecasts and farming recommendations": "Menya ibyerekeye iteganyagihe n'inama z'ubuhinzi",
    "Farming Tips": "Inama z'Ubuhinzi",
    "Receive helpful farming tips and best practices": "Akira inama z'ingirakamaro n'imigenzo myiza y'ubuhinzi",
    "SMS Backup": "Ubwishingizi bwa SMS",
    "Receive important notifications via SMS when offline": "Akira ubutumwa bw'ingenzi bwa SMS uri offline",
    "SMS": "SMS",
    "Offline": "Utari kuri Internet",
    "Offline & Sync Settings": "Igenamiterere rya Offline n'Isync",
    "Offline Mode": "Uburyo bwa Offline",
    "Allow the app to work without internet connection": "Emerera porogaramu gukora idafite interineti",
    "Auto Sync": "Isync Yikora",
    "Automatically sync data when connection is available": "Huzanya amakuru byikora igihe interineti ibonetse",
    "Cache Images": "Bika Amafoto mu Bubiko",
    "Download images for offline viewing": "Manura amafoto kugira ngo urebe uri offline",
    "Storage Used": "Ububiko Bukoreshejwe",
    "Offline data and cache": "Amakuru ya offline n'ububiko bw'igihe gito",
    "Pending Sync Items": "Ibintu bitegereje Guhuza",
    "Data waiting to be synced": "Amakuru ategereje guhuza",
    "items": "ibintu",
    "Sync Now": "Huzanya Ubu",
    "Clear Cache": "Siba Ububiko bw'igihe gito",
    "Privacy": "Ubumenyi bwite",
    "Privacy & Security": "Ubumenyi bwite n'Umutekano",
    "Share Location": "Sangira Aho Uri",
    "Allow the app to use your location for district-specific features": "Emerera porogaramu gukoresha aho uri ku byerekeye akarere",
    "Public Profile": "Umwirondoro Ugaragara",
    "Make your farmer profile visible to other users": "Koresha umwirondoro wawe w'umuhinzi ubonekera abandi",
    "Data Collection": "Gukusanya Amakuru",
    "Allow anonymous usage data collection to improve the app": "Emerera gukusanya amakuru adafite amazina ngo haterwe imbere porogaramu",
    "Download My Data": "Manura Amakuru Yanjye",
    "Download a copy of all your data stored in Smart Farm Link": "Manura kopi y'amakuru yawe yose abitswe muri Smart Farm Link",

    // Landing page
    heroTitle: "Smart Farm Link Rwanda",
    heroSub:
      "Guhuza no gutera inkunga abahinzi mu turere twose 30 tw'u Rwanda hifashishijwe ikoranabuhanga. Uhereye ku kitemba kugeza ku isoko, turimo gushinga ejo hazaza h'ubuhinzi mu Rwanda.",
    getStarted: "Tangira",
    installApp: "Shyiramo Porogaramu",
    featuresTitle: "Byose ukeneye kugira ngo ugere ku ntsinzi",
    featuresSubtitle: "Ibikoresho byateguwe by'umwihariko ku bahinzi b'Abanyarwanda",
    feature_smartFarm: "Igenzura ry'Umurima Ry'ubwenge",
    feature_smartFarm_desc: "Kurikira ibihingwa, tegura gahunda, kandi ubone inama zishingiye ku karere",
    feature_marketPrices: "Ibiciro by'Isoko mu Igihe Nyacyo",
    feature_marketPrices_desc: "Gereranya ibiciro mu turere twose 30 ubone ibyoroshye",
    feature_connectBuyers: "Hura n'Abaguzi",
    feature_connectBuyers_desc: "Isoko rihuza abahinzi n'abaguzi mu gihugu hose",
    feature_securePayments: "Kwishyura Bizewe",
    feature_securePayments_desc: "Guhuza Mobile Money n'ubwishingizi bwa escrow",
    feature_bilingual: "Inkunga mu ndimi ebyiri",
    feature_bilingual_desc: "Iri mu Kinyarwanda no mu Cyongereza",
    feature_offline: "Ikora n'utari kuri interineti",
    feature_offline_desc: "Imikorere yose n'utagira interineti",
    stats_districts: "Uturere Duhari",
    stats_farmers: "Abahinzi Bateguye",
    stats_support: "Ubufasha Buboneka",
    cta_title: "Witeguye guhindura ubuhinzi bwawe?",
    cta_sub:
      "Jya mu bihumbi by'abahinzi basanzwe bakoresha Smart Farm Link Rwanda kongera inyungu no kunoza umusaruro.",
    startJourney: "Tangiza Urugendo Rwawe Uyu Munsi",
    role_select_title: "Hitamo uruhare rwawe",
    role_select_sub: "Uri kwiyandikisha nka Mugura cyangwa Umuhinzi?",
    role_farmer: "Ndi Umuhinzi",
    role_buyer: "Ndi Umugura",

    // Auth pages
    signinDescription: "Injiza ibisabwa kugira ngo winjire ku kibaho cy' umurima",
    signupDescription: "Hanga konti yawe utangire ubuhinzi bw'ubwenge",
    noAccountQuestion: "Nta konti ufite?",
    haveAccountQuestion: "Usanzwe ufite konti?",
  },
} as const

let currentLanguage: "en" | "rw" = "rw"
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
