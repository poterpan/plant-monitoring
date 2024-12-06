// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface SensorData {
  timestamp: string;
  location: string;
  co2: number;
  temperature: number;
  humidity: number;
}

export interface ImageInfo {
  exists: boolean;
  url: string | null;
  date?: string;
}

export interface CO2AbsorptionPeriod {
  date: string;
  start_time: string;
  end_time: string;
  slope: number;
  duration_minutes: number;
  total_absorption: number;
  avg_co2_change: number;
 }

const api = {
  // 獲取最新的感測器數據
  getLatestData: async () => {
    const response = await axios.get(`${API_BASE_URL}/latest`);
    return response.data as SensorData[];
  },

  // 獲取特定日期範圍的數據
  getData: async (startTime: string, endTime: string, location?: string) => {
    const params = new URLSearchParams({
      start_time: startTime,
      end_time: endTime,
      ...(location && { location }),
    });
    const response = await axios.get(`${API_BASE_URL}/data?${params}`);
    return response.data as SensorData[];
  },

  // 獲取每日分析數據
  getDailyAnalysis: async (startDate: string, endDate: string, location?: string) => {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      ...(location && { location }),
    });
    const response = await axios.get(`${API_BASE_URL}/analysis/daily?${params}`);
    return response.data;
  },

  // 獲取最新的圖片
  getLatestImage: async () => {
    const response = await axios.get(`${API_BASE_URL}/images/latest`);
    return response.data as ImageInfo;
  },

  // 獲取特定日期的圖片
  getImageByDate: async (date: string) => {
    const response = await axios.get(`${API_BASE_URL}/images/by-date/${date}`);
    return response.data as ImageInfo;
  },

  // 獲取所有可用的照片日期
  getAvailableDates: async (): Promise<string[]> => {
    const response = await axios.get(`${API_BASE_URL}/images/available-dates`);
    return response.data;
  },

  // 獲取平滑後的數據
  getSmoothedData: async (startTime: string, endTime: string, windowLength: number = 21) => {
    const params = new URLSearchParams({
      start_time: startTime,
      end_time: endTime,
      window_length: windowLength.toString()
    });
    const response = await axios.get(`${API_BASE_URL}/data/smoothed?${params}`);
    return response.data;
  },

  getCO2AbsorptionPeriod: async (date: string) => {
    const response = await axios.get(`${API_BASE_URL}/analysis/co2-absorption-period/${date}`);
    return response.data as CO2AbsorptionPeriod;
   }
   
};

export default api;