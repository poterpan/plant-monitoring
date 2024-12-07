"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SensorData } from "@/services/api"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'

interface DailySummaryProps {
  data: SensorData[]
  isLoading: boolean
}

export function DailySummary({ data, isLoading }: DailySummaryProps) {
    // 按時間排序數據
    const sortedData = [...data].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
  
    // 分離室內外數據
    const indoorData = sortedData.filter(d => d.location === 'indoor')
    const outdoorData = sortedData.filter(d => d.location === 'outdoor')
  
    // 根據室內數據準備圖表數據
    const chartData = indoorData.map(indoor => {
      const timestamp = parseISO(indoor.timestamp)
      
      // 尋找對應時間的室外數據
      const outdoor = outdoorData.find(od => {
        const odTime = parseISO(od.timestamp)
        // 允許 1 分鐘的誤差
        return Math.abs(timestamp.getTime() - odTime.getTime()) <= 60000
      })
  
      return {
        timestamp: indoor.timestamp,
        time: format(timestamp, 'HH:mm'),
        date: format(timestamp, 'yyyy-MM-dd'),
        indoorCO2: indoor.co2,
        outdoorCO2: outdoor?.co2 ?? null,
      }
    })

  return (
    <Card>
      <CardHeader>
        <CardTitle>CO2 趨勢</CardTitle>
        {chartData.length > 0 && (
          <p className="text-sm text-muted-foreground">
            資料日期: {chartData[0].date}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            Loading...
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time"
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  label={{ 
                    value: 'CO2 (ppm)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip
                  labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                      const data = payload[0].payload;
                      return `${data.date} ${label}`;
                    }
                    return label;
                  }}
                  formatter={(value, name) => [
                    `${value} ppm`, 
                    name
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="indoorCO2"
                  name="箱體 CO2"
                  stroke="#8884d8"
                  dot={false}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="outdoorCO2"
                  name="環境 CO2"
                  stroke="#82ca9d"
                  dot={false}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}