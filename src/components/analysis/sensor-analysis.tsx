// src/components/analysis/sensor-analysis.tsx
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { SensorData, CO2AbsorptionPeriod } from "@/services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { format, parseISO } from "date-fns";

interface SensorAnalysisProps {
  data: SensorData[];
  absorptionData: CO2AbsorptionPeriod | null;
  isLoading: boolean;
  showSmoothed: boolean;
  setShowSmoothed: (show: boolean) => void;
}

export function SensorAnalysis({
  data,
  absorptionData,
  isLoading,
  showSmoothed,
  setShowSmoothed,
}: SensorAnalysisProps) {
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
        <TabsTrigger value="temp">溫度</TabsTrigger>
        <TabsTrigger value="humidity">相對濕度</TabsTrigger>
      </TabsList>

      <TabsContent value="co2">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>CO2 Levels</CardTitle>
              <div className="flex items-center space-x-2">
                <Switch
                  id="smooth-data"
                  checked={showSmoothed}
                  onCheckedChange={setShowSmoothed}
                />
                <label htmlFor="smooth-data" className="text-sm">
                  {showSmoothed ? "平滑" : "原始"}數據
                </label>
              </div>
            </div>
            {absorptionData && (
              <CardDescription className="space-y-1">
                <div>
                  主吸收時間段: {absorptionData.start_time} -{" "}
                  {absorptionData.end_time}
                </div>
                <div>持續時間: {absorptionData.duration_minutes} 分鐘</div>
                <div>
                  估計總吸收量:{" "}
                  {absorptionData.estimated_absorption.toFixed(1)} ppm
                </div>
                <div>
                  速率: {Math.abs(absorptionData.slope).toFixed(2)} ppm/min
                </div>
              </CardDescription>
            )}
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
                      domain={["dataMin - 50", "dataMax + 50"]}
                      tickFormatter={(value) => Math.round(value).toString()}
                      label={{
                        value: "CO2 (ppm)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      formatter={(value) =>
                        value ? `${Number(value).toFixed(2)} ppm` : "N/A"
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="indoor"
                      name="箱體"
                      stroke="#8884d8"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="outdoor"
                      name="環境"
                      stroke="#82ca9d"
                      dot={false}
                    />
                    {absorptionData && (
                      <ReferenceArea
                        x1={absorptionData.start_time
                          .split(":")
                          .slice(0, 2)
                          .join(":")}
                        x2={absorptionData.end_time
                          .split(":")
                          .slice(0, 2)
                          .join(":")}
                        fill="#4CAF50"
                        fillOpacity={0.3}
                        isFront={false}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
