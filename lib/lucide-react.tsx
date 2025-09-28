// Mock Lucide React icons for development
import type React from "react"

interface IconProps {
  className?: string
  size?: number | string
}

// Simple SVG icon component
const createIcon = (path: string, viewBox = "0 0 24 24") => {
  return ({ className = "", size = 24 }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  )
}

// Export all the icons used in the application
export const Sprout = createIcon("M7 20h10m-5-8v8m0-8c0-5.5-3-8-7-8s-7 2.5-7 8c0 5.5 3 8 7 8s7-2.5 7-8z")
export const Users = createIcon(
  "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m5-9a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm13 9v-2a4 4 0 0 0-3-3.87m-3-12a4 4 0 0 1 0 7.75",
)
export const TrendingUp = createIcon("M3 17l6-6 4 4 8-8m0 0v6m0-6h-6")
export const Shield = createIcon("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z")
export const Globe = createIcon(
  "M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9",
)
export const Smartphone = createIcon("M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 15h.01")
export const Loader2 = createIcon("M21 12a9 9 0 1 1-6.219-8.56")
export const MapPin = createIcon("M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z m-9-3a3 3 0 1 1 0-6 3 3 0 0 1 0 6")
export const User = createIcon("M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z")
export const Settings = createIcon(
  "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
)
export const Calendar = createIcon(
  "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
)
export const Droplets = createIcon(
  "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.14 3 12.25c0 2.22 1.8 4.05 4 4.05z",
)
export const CheckCircle = createIcon("M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3")
export const Clock = createIcon("M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2")
export const Plus = createIcon("M12 5v14m-7-7h14")
export const Check = createIcon("M20 6L9 17l-5-5")
export const ChevronDown = createIcon("M6 9l6 6 6-6")
export const ChevronUp = createIcon("M18 15l-6-6-6 6")
export const ChevronLeft = createIcon("M15 18l-6-6 6-6")
export const ChevronRight = createIcon("M9 18l6-6-6-6")
export const X = createIcon("M18 6L6 18M6 6l12 12")
export const Search = createIcon("M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z")
export const Phone = createIcon(
  "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
)
export const Star = createIcon(
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
)
export const Upload = createIcon("M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5l5-5 5 5m-5-5v12")
export const AlertCircle = createIcon(
  "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4m0 4h.01",
)
export const ArrowLeft = createIcon("M19 12H5m7-7l-7 7 7 7")
export const ArrowUpRight = createIcon("M7 17L17 7m0 0H7m10 0v10")
export const ArrowDownLeft = createIcon("M17 7L7 17m0 0h10M7 17V7")
export const XCircle = createIcon(
  "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M15 9l-6 6m0-6l6 6",
)
export const Eye = createIcon("M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z")
export const Download = createIcon("M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5l5 5 5-5m-5 5V3")
export const Mic = createIcon(
  "M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z M19 10v1a7 7 0 0 1-14 0v-1m7 8v4m-4 0h8",
)
export const MicOff = createIcon(
  "M17 3a3 3 0 0 0-6 0v5m6 0v1a7 7 0 0 1-.11 1.23M9 9v2a3 3 0 0 0 5.12 2.12M19 10v1a7 7 0 0 1-7 7m-7-8v-1m7 8v4m-4 0h8 M2 2l20 20",
)
export const Volume2 = createIcon("M11 5L6 9H2v6h4l5 4V5z M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07")
export const VolumeX = createIcon("M11 5L6 9H2v6h4l5 4V5z M23 9l-6 6m0-6l6 6")
export const Languages = createIcon("M5 8l6 6m-7 0l6.5-6.5M2 5h12M7 2h1l4 14 4-14h1")
export const Wifi = createIcon(
  "M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01",
)
export const WifiOff = createIcon(
  "M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01",
)
export const Send = createIcon("M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z")
export const Home = createIcon("M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10")
export const ShoppingCart = createIcon(
  "M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6",
)
export const CreditCard = createIcon(
  "M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M1 10h22",
)
export const LogOut = createIcon("M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5-5-5m5 5H9")
export const Menu = createIcon("M4 6h16M4 12h16M4 18h16")
export const Bell = createIcon("M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0")
export const Trash2 = createIcon(
  "M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6m4-6v6",
)
export const RefreshCw = createIcon(
  "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M3 21v-5h5",
)
export const Cloud = createIcon("M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z")
export const Sun = createIcon(
  "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 2v2m0 16v2m10-10h-2M4 12H2m15.314-6.314l-1.414 1.414M7.757 17.657l-1.414 1.414M20.485 20.485l-1.414-1.414M7.757 6.343L6.343 7.757",
)
export const CloudRain = createIcon("M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M16 14v6m-4-6v6m-4-6v6")
export const Wind = createIcon("M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2m10.6 11.4A2 2 0 1 0 14 16H2")
export const Thermometer = createIcon("M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z")
export const Circle = createIcon("M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z")

// Icon type for TypeScript
export type LucideIcon = React.ComponentType<IconProps>

// Additional icons that might be needed
export const ChevronDownIcon = ChevronDown
export const MoreHorizontal = createIcon("M12 12h.01M19 12h.01M5 12h.01")
export const SearchIcon = Search
export const CheckIcon = Check
export const ChevronRightIcon = ChevronRight
export const CircleIcon = Circle
export const XIcon = X
export const MinusIcon = createIcon("M5 12h14")
export const GripVerticalIcon = createIcon("M9 12h.01M15 12h.01M9 16h.01M15 16h.01M9 8h.01M15 8h.01")
export const PanelLeftIcon = createIcon("M3 3h6v18H3zM21 9v6")
export const ArrowRight = createIcon("M5 12h14m-7-7l7 7-7 7")
