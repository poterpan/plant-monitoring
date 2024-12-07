"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageOff } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import api from "@/services/api"

interface PlantImageProps {
  date: Date | null
}

interface ImageInfo {
  url: string | null;
  actualDate: string | null;
  isFromDifferentDate: boolean;
}

export function PlantImage({ date }: PlantImageProps) {
  const [imageInfo, setImageInfo] = useState<ImageInfo>({ 
    url: null, 
    actualDate: null,
    isFromDifferentDate: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadImage() {
      if (!date) return;

      setIsLoading(true);
      try {
        // 格式化當前選擇的日期
        const targetDateStr = format(date, "yyyyMMdd");
        
        // 獲取所有可用日期
        const availableDates = await api.getAvailableDates();
        
        if (availableDates.includes(targetDateStr)) {
          // 如果當前日期有照片
          const imageData = await api.getImageByDate(targetDateStr);
          setImageInfo({
            url: imageData.url ? `http://localhost:8000${imageData.url}` : null,
            actualDate: targetDateStr,
            isFromDifferentDate: false
          });
        } else if (availableDates.length > 0) {
          // 找最近的日期
          const nearestDate = availableDates.reduce((nearest, curr) => {
            const currDate = new Date(
              parseInt(curr.slice(0, 4)),
              parseInt(curr.slice(4, 6)) - 1,
              parseInt(curr.slice(6, 8))
            );
            const nearestDate = new Date(
              parseInt(nearest.slice(0, 4)),
              parseInt(nearest.slice(4, 6)) - 1,
              parseInt(nearest.slice(6, 8))
            );
            
            return Math.abs(currDate.getTime() - date.getTime()) < 
                   Math.abs(nearestDate.getTime() - date.getTime()) 
                   ? curr : nearest;
          });
          
          const imageData = await api.getImageByDate(nearestDate);
          setImageInfo({
            url: imageData.url ? `http://localhost:8000${imageData.url}` : null,
            actualDate: nearestDate,
            isFromDifferentDate: true
          });
        }
      } catch (error) {
        console.error('Error loading image:', error);
        setImageInfo({ url: null, actualDate: null, isFromDifferentDate: false });
      } finally {
        setIsLoading(false);
      }
    }

    loadImage();
  }, [date]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plant Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center bg-muted">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!imageInfo.url) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plant Image</CardTitle>
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
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>植物影像</CardTitle>
        {imageInfo.isFromDifferentDate && imageInfo.actualDate && (
          <p className="text-sm text-muted-foreground">
            當日無紀錄 顯示最近的可用影像 ({format(new Date(
              parseInt(imageInfo.actualDate.slice(0, 4)),
              parseInt(imageInfo.actualDate.slice(4, 6)) - 1,
              parseInt(imageInfo.actualDate.slice(6, 8))
            ), "yyyy/MM/dd")})
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
          <Image
            src={imageInfo.url}
            alt="Plant image"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={cn(
              "object-cover",
              imageInfo.isFromDifferentDate && "opacity-80" // 當顯示不同日期的照片時添加半透明效果
            )}
          />
          {imageInfo.isFromDifferentDate && (
            <div className="absolute inset-0 bg-black/20" /> // 額外的半透明遮罩
          )}
        </div>
      </CardContent>
    </Card>
  );
}