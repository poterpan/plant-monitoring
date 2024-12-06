// src/components/analysis/sensor-analysis.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SensorData } from "@/services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

interface SensorAnalysisProps {
  data: SensorData[];
  isLoading: boolean;
}

export function SensorAnalysis({ data, isLoading }: SensorAnalysisProps) {
  const chartData = data
    .reduce<Record<string, any>[]>((acc, reading) => {
      const time = format(parseISO(reading.timestamp), "HH:mm");
      const existingPoint = acc.find((point) => point.time === time);

      if (existingPoint) {
        if (reading.location === "indoor") {
          existingPoint.indoor = reading.co2;
        } else {
          existingPoint.outdoor = reading.co2;
        }
      } else {
        acc.push({
          time,
          indoor: reading.location === "indoor" ? reading.co2 : null,
          outdoor: reading.location === "outdoor" ? reading.co2 : null,
        });
      }

      return acc;
    }, [])
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <Tabs defaultValue="co2">
      <TabsList>
        <TabsTrigger value="co2">CO2</TabsTrigger>
        <TabsTrigger value="temp">Temperature</TabsTrigger>
        <TabsTrigger value="humidity">Humidity</TabsTrigger>
      </TabsList>

      <TabsContent value="co2">
        <Card>
          <CardHeader>
            <CardTitle>CO2 Levels</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                Loading...
              </div>
            ) : (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis
                      domain={["dataMin - 50", "dataMax + 50"]} // 自動設置範圍，並留有一些邊距
                      label={{
                        value: "CO2 (ppm)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="indoor"
                      name="Indoor"
                      stroke="#8884d8"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="outdoor"
                      name="Outdoor"
                      stroke="#82ca9d"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* 溫度和濕度的標籤頁內容類似，需要時再添加 */}
    </Tabs>
  );
}
