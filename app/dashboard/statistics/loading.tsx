import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-64" />
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-80 w-full" />
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  )
}
