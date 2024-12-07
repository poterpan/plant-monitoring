// src/app/page.tsx
"use client"

import { LatestImage } from "@/components/dashboard/latest-image"
import { CurrentReadings } from "@/components/dashboard/current-readings"
import { DailySummary } from "@/components/dashboard/daily-summary"
import { useLatestData, useDailyData, useLatestImage } from "@/hooks/use-sensor-data"

export default function DashboardPage() {
  // 首先獲取最新數據
  const { data: latestData, isLoading: isLoadingLatest } = useLatestData()
  const { data: latestImage, isLoading: isLoadingImage } = useLatestImage()


  // 使用最新數據的時間戳來獲取當天的數據
  const latestTimestamp = latestData?.[0]?.timestamp
  const { data: dailyData, isLoading: isLoadingDaily } = useDailyData(latestTimestamp)

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">總覽</h1>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <LatestImage 
          image={latestImage ?? null} 
          isLoading={isLoadingImage} 
        />
        <CurrentReadings 
          data={latestData ?? []} 
          isLoading={isLoadingLatest} 
        />
      </div>
      
      <div className="mt-8">
        <DailySummary 
          data={dailyData ?? []} 
          isLoading={isLoadingDaily || isLoadingLatest} // 等待兩個查詢都完成
        />
      </div>
    </div>
  )
}