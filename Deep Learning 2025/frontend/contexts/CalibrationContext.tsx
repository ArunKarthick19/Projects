"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Define types for our data
interface CalibrationItem {
  name: string;
  serial: string;
  company: string;
  date?: string;
}

interface CalibrationData {
  [key: string]: CalibrationItem[];
}

interface DeadlineItem {
  id: number;
  tool: string;
  date: string;
  serial?: string;
  company?: string;
}

interface CalibrationContextType {
  calibrationData: CalibrationData;
  upcomingDeadlines: DeadlineItem[];
  isLoading: boolean;
  error: string | null;
  refreshCalibrationData: () => Promise<void>;
}

// Sample calibration data as fallback
const sampleCalibrationData: CalibrationData = {
  "2025-03-03": [
    { name: "Blade Micrometers", serial: "BM001", company: "Key Solutions" }
  ],
  "2025-03-14": [
    { name: "Blade Micrometers", serial: "BM005", company: "Key Solutions" }
  ],
  "2025-03-18": [
    { name: "Dial Indicator", serial: "DI006", company: "Key Solutions" },
    { name: "Height Gauge", serial: "HG007", company: "OrchidCal" },
    { name: "Feeler Gauge", serial: "FG008", company: "Key Solutions" },
    { name: "Depth Micrometer", serial: "DM009", company: "OrchidCal" },
    { name: "Thread Gauge", serial: "TG010", company: "Key Solutions" }
  ],
  "2025-03-21": [
    { name: "Dial Comparator", serial: "DC011", company: "OrchidCal" }
  ]
};

// Create the context
const CalibrationContext = createContext<CalibrationContextType | undefined>(undefined);

// Provider component
export function CalibrationProvider({ children }: { children: React.ReactNode }) {
  const [calibrationData, setCalibrationData] = useState<CalibrationData>(sampleCalibrationData);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<DeadlineItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch calibration data from the API
  const refreshCalibrationData = useCallback(async () => {
    try {
      // Fetch data from the backend API
      const response = await fetch('http://127.0.0.1:5000/api/no1?get_data=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status !== 'success' || !result.data) {
        throw new Error('Failed to fetch calibration data');
      }
      
      // Process the calibration data
      const calibrationData = result.data;
      setCalibrationData(calibrationData);
      
      // Generate upcoming deadlines based on current date
      const currentDate = new Date();
      const deadlines: DeadlineItem[] = [];
      let idCounter = 1;
      
      // Convert the data into our deadline format
      Object.entries(calibrationData).forEach(([dateStr, items]) => {
        const dueDate = new Date(dateStr);
        
        // Calculate days difference between current date and due date
        const daysDifference = Math.floor((dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Only include upcoming deadlines within the next 14 days
        if (daysDifference >= 0 && daysDifference <= 13) {
          // @ts-ignore - We know items is an array based on the API response structure
          items.forEach((item: any) => {
            deadlines.push({
              id: idCounter++,
              tool: item.name,
              date: dueDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }),
              serial: item.serial,
              company: item.company
            });
          });
        }
      });
      
      // Sort by closest deadline first
      const sortedDeadlines = deadlines.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
      
      // Store all deadlines within the 14-day window
      setUpcomingDeadlines(sortedDeadlines);
      setError(null);
      
    } catch (err) {
      console.error('Error fetching calibration data:', err);
      setError(`Error fetching data: ${err instanceof Error ? err.message : String(err)}`);
      
      // Use sample data as fallback
      setCalibrationData(sampleCalibrationData);
      
      // Generate upcoming deadlines from sample data
      const currentDate = new Date();
      const deadlines: DeadlineItem[] = [];
      let idCounter = 1;
      
      Object.entries(sampleCalibrationData).forEach(([dateStr, items]) => {
        const dueDate = new Date(dateStr);
        const daysDifference = Math.floor((dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDifference >= 0 && daysDifference <= 13) {
          items.forEach((item) => {
            deadlines.push({
              id: idCounter++,
              tool: item.name,
              date: dueDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }),
              serial: item.serial,
              company: item.company
            });
          });
        }
      });
      
      const sortedDeadlines = deadlines.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
      
      setUpcomingDeadlines(sortedDeadlines);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    refreshCalibrationData();
  }, [refreshCalibrationData]);

  return (
    <CalibrationContext.Provider value={{ 
      calibrationData, 
      upcomingDeadlines, 
      isLoading, 
      error, 
      refreshCalibrationData 
    }}>
      {children}
    </CalibrationContext.Provider>
  );
}

// Custom hook to use the calibration context
export function useCalibration() {
  const context = useContext(CalibrationContext);
  if (context === undefined) {
    throw new Error('useCalibration must be used within a CalibrationProvider');
  }
  return context;
}
