"use client"

import { useLatestData, useDailyData } from "@/hooks/use-sensor-data"
import { DatePicker } from "@/components/analysis/date-picker"
import { PlantImage } from "@/components/analysis/plant-image"
import { SensorAnalysis } from "@/components/analysis/sensor-analysis"
import { format } from "date-fns"
import { useState } from "react"

export default function AnalysisPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const { data: latestData } = useLatestData()

  // 如果沒有選擇日期，使用最新數據的日期
  const effectiveDate = selectedDate || (latestData?.[0]?.timestamp ? new Date(latestData[0].timestamp) : null)
  
  const { data: dailyData, isLoading } = useDailyData(
    effectiveDate ? effectiveDate.toISOString() : null
  )

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Analysis</h1>
          {effectiveDate && (
            <p className="text-muted-foreground">
              Showing data for {format(effectiveDate, "yyyy/MM/dd")}
              {!selectedDate && " (Latest Data)"}
            </p>
          )}
        </div>
        <DatePicker 
          selected={selectedDate} 
          onSelect={setSelectedDate} 
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <PlantImage date={effectiveDate} />
        <div className="space-y-8">
          <SensorAnalysis data={dailyData ?? []} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}