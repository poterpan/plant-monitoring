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
};

export default api;