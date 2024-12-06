import { useQuery } from "@tanstack/react-query"
import api from "@/services/api"
import { startOfDay, endOfDay, formatISO } from 'date-fns'


export function useLatestData() {
    return useQuery({
      queryKey: ["sensorData", "latest"],
      queryFn: api.getLatestData,
    })
  }
  
  interface DataOptions {
    smooth?: boolean;
   }
   
   export function useDailyData(latestTimestamp: string | undefined | null, options: DataOptions = {}) {
    const getDayRange = (timestamp: string) => {
      const date = new Date(timestamp.split('+')[0])
      return {
        start: formatISO(startOfDay(date)).split('+')[0],
        end: formatISO(endOfDay(date)).split('+')[0]
      }
    }
  
    const timeRange = latestTimestamp ? getDayRange(latestTimestamp) : null
  
    // 在查詢前先檢查時間範圍
    // console.log('Time range:', timeRange);
    // console.log('Options:', options);
  
    return useQuery({
      queryKey: ["sensorData", "daily", timeRange?.start, timeRange?.end, options.smooth],
      queryFn: async () => {
        const data = options.smooth 
          ? await api.getSmoothedData(timeRange!.start, timeRange!.end)
          : await api.getData(timeRange!.start, timeRange!.end);
        // console.log('Fetched data:', data);
        return data;
      },
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

export function useAbsorptionData(date: Date | null) {
  return useQuery({
    queryKey: ["absorption", date],
    queryFn: async () => {
      if (!date) return null;
      return api.getCO2AbsorptionPeriod(formatISO(date, { representation: 'date' }));
    },
    enabled: !!date
  });
}