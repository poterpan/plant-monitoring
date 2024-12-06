import { useQuery } from "@tanstack/react-query"
import api from "@/services/api"
import { startOfDay, endOfDay, formatISO, parseISO } from 'date-fns'


export function useLatestData() {
    return useQuery({
      queryKey: ["sensorData", "latest"],
      queryFn: api.getLatestData,
    })
  }
  
  export function useDailyData(latestTimestamp: string | undefined | null) {
    const getDayRange = (timestamp: string) => {
      const date = parseISO(timestamp)
      return {
        start: formatISO(startOfDay(date)),
        end: formatISO(endOfDay(date))
      }
    }
  
    const timeRange = latestTimestamp ? getDayRange(latestTimestamp) : null
  
    return useQuery({
      queryKey: ["sensorData", "daily", timeRange?.start, timeRange?.end],
      queryFn: () => api.getData(timeRange!.start, timeRange!.end),
      enabled: !!timeRange,
    })
  }

export function useLatestImage() {
  return useQuery({
    queryKey: ["image", "latest"],
    queryFn: api.getLatestImage,
  })
}

export function useSensorData(
  startTime: string,
  endTime: string,
  location?: string
) {
  return useQuery({
    queryKey: ["sensorData", startTime, endTime, location],
    queryFn: () => api.getData(startTime, endTime, location),
  })
}

export function useDailyAnalysis(
  startDate: string,
  endDate: string,
  location?: string
) {
  return useQuery({
    queryKey: ["analysis", "daily", startDate, endDate, location],
    queryFn: () => api.getDailyAnalysis(startDate, endDate, location),
  })
}