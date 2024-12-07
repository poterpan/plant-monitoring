"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SensorData } from "@/services/api"
import { Thermometer, Droplets, Wind, Home, Leaf } from "lucide-react"
import { format, parseISO } from 'date-fns'

interface CurrentReadingsProps {
  data: SensorData[]
  isLoading: boolean
}

export function CurrentReadings({ data, isLoading }: CurrentReadingsProps) {
  const indoorData = data.find(d => d.location === 'indoor')
  const outdoorData = data.find(d => d.location === 'outdoor')

  // 格式化時間
  const indoorTime = indoorData?.timestamp 
    ? format(parseISO(indoorData.timestamp), 'yyyy/MM/dd HH:mm:ss')
    : null
  const outdoorTime = outdoorData?.timestamp 
    ? format(parseISO(outdoorData.timestamp), 'yyyy/MM/dd HH:mm:ss')
    : null

  return (
    <Card>
      <CardHeader>
        <CardTitle>即時數值</CardTitle>
        <div className="flex gap-6">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Leaf className="h-4 w-4" />
            箱體: {indoorTime ?? 'No data'}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Home className="h-4 w-4" />
            環境: {outdoorTime ?? 'No data'}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="h-[200px] flex items-center justify-center">
            Loading...
          </div>
        ) : (
          <>
            {/* CO2 讀數 */}
            <div className="rounded-lg border p-3">
              <div className="flex items-center space-x-2">
                <Wind className="h-4 w-4" />
                <h3 className="font-medium">CO2</h3>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">箱體</p>
                  <p className="text-2xl font-bold">
                    {indoorData?.co2 ?? '-'} ppm
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">環境</p>
                  <p className="text-2xl font-bold">
                    {outdoorData?.co2 ?? '-'} ppm
                  </p>
                </div>
              </div>
            </div>

            {/* Temperature 讀數 */}
            <div className="rounded-lg border p-3">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-4 w-4" />
                <h3 className="font-medium">溫度</h3>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">箱體</p>
                  <p className="text-2xl font-bold">
                    {indoorData?.temperature ?? '-'}°C
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">環境</p>
                  <p className="text-2xl font-bold">
                    {outdoorData?.temperature ?? '-'}°C
                  </p>
                </div>
              </div>
            </div>

            {/* Humidity 讀數 */}
            <div className="rounded-lg border p-3">
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4" />
                <h3 className="font-medium">相對濕度</h3>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">箱體</p>
                  <p className="text-2xl font-bold">
                    {indoorData?.humidity ?? '-'}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">環境</p>
                  <p className="text-2xl font-bold">
                    {outdoorData?.humidity ?? '-'}%
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}