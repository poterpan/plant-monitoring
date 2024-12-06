"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageOff } from "lucide-react"
import Image from "next/image"
import { ImageInfo } from "@/services/api"

interface LatestImageProps {
  image: ImageInfo | null
  isLoading: boolean
}

export function LatestImage({ image, isLoading }: LatestImageProps) {
  // 日期格式化函數
  const formatDate = (dateString: string) => {
    // 將 YYYYMMDD 格式轉換為 YYYY-MM-DD
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)
    return new Date(`${year}-${month}-${day}`).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest Plant Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center bg-muted">
            Loading...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!image?.exists || !image.url) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest Plant Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center bg-muted">
            <div className="text-center">
              <ImageOff className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No image available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const fullImageUrl = image.url.startsWith('http') 
    ? image.url 
    : `http://localhost:8000${image.url}`

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Plant Image</CardTitle>
        {image.date && (
          <p className="text-sm text-muted-foreground">
            Captured on: {formatDate(image.date)}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
          <Image
            src={fullImageUrl}
            alt="Latest plant image"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </CardContent>
    </Card>
  )
}