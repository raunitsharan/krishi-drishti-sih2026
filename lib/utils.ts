import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomSensorData() {
  return {
    temperature: (20 + Math.random() * 15).toFixed(1),
    humidity: (40 + Math.random() * 40).toFixed(1),
    soilMoisture: (30 + Math.random() * 50).toFixed(1),
    pH: (5.5 + Math.random() * 2.5).toFixed(1),
    npk: {
      nitrogen: (20 + Math.random() * 60).toFixed(0),
      phosphorus: (15 + Math.random() * 45).toFixed(0),
      potassium: (25 + Math.random() * 55).toFixed(0),
    },
    lightIntensity: (500 + Math.random() * 500).toFixed(0),
  }
}

export function generateThreatDetection() {
  const threats = ['elephant', 'wild_boar', 'bird', 'fire', null, null, null, null]
  const threat = threats[Math.floor(Math.random() * threats.length)]
  
  if (!threat) return null
  
  return {
    type: threat,
    confidence: (0.75 + Math.random() * 0.24).toFixed(2),
    location: {
      x: (Math.random() * 100).toFixed(1),
      y: (Math.random() * 100).toFixed(1),
    },
    timestamp: new Date().toISOString(),
  }
}

export function generateIrrigationData() {
  return {
    status: Math.random() > 0.5 ? 'active' : 'idle',
    waterFlow: (Math.random() * 50).toFixed(1),
    pressure: (2 + Math.random() * 2).toFixed(1),
    valveStatus: Math.random() > 0.7 ? 'open' : 'closed',
    dailyUsage: (500 + Math.random() * 1500).toFixed(0),
  }
}

export function getCropRecommendation(soilData: any) {
  const recommendations = [
    { crop: 'Rice', suitability: 85, yield: '4.5 tonnes/acre', season: 'Kharif' },
    { crop: 'Wheat', suitability: 78, yield: '3.2 tonnes/acre', season: 'Rabi' },
    { crop: 'Cotton', suitability: 72, yield: '2.8 tonnes/acre', season: 'Kharif' },
    { crop: 'Sugarcane', suitability: 88, yield: '45 tonnes/acre', season: 'Year-round' },
  ]
  return recommendations.sort((a, b) => b.suitability - a.suitability)
}

export function predictHarvestTime(crop: string) {
  const predictions = {
    Rice: { days: 120, confidence: 0.89, optimalDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000) },
    Wheat: { days: 110, confidence: 0.92, optimalDate: new Date(Date.now() + 110 * 24 * 60 * 60 * 1000) },
    Cotton: { days: 160, confidence: 0.85, optimalDate: new Date(Date.now() + 160 * 24 * 60 * 60 * 1000) },
    Sugarcane: { days: 365, confidence: 0.91, optimalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
  }
  return predictions[crop as keyof typeof predictions] || predictions.Rice
}
