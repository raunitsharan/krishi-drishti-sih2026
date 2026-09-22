'use client'

import { motion } from 'framer-motion'
import { Thermometer, Droplets, Sprout, Activity, Sun, Zap } from 'lucide-react'

interface SensorData {
  temperature: string
  humidity: string
  soilMoisture: string
  pH: string
  npk: {
    nitrogen: string
    phosphorus: string
    potassium: string
  }
  lightIntensity: string
}

export default function SensorDashboard({ data }: { data: SensorData }) {
  const sensors = [
    {
      icon: Thermometer,
      label: 'Temperature',
      value: `${data.temperature}°C`,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      status: parseFloat(data.temperature) > 30 ? 'High' : 'Normal'
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${data.humidity}%`,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      status: parseFloat(data.humidity) > 70 ? 'High' : 'Normal'
    },
    {
      icon: Sprout,
      label: 'Soil Moisture',
      value: `${data.soilMoisture}%`,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      status: parseFloat(data.soilMoisture) < 40 ? 'Low' : 'Optimal'
    },
    {
      icon: Activity,
      label: 'Soil pH',
      value: data.pH,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      status: parseFloat(data.pH) >= 6 && parseFloat(data.pH) <= 7.5 ? 'Optimal' : 'Check'
    },
    {
      icon: Sun,
      label: 'Light Intensity',
      value: `${data.lightIntensity} lux`,
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-yellow-500/10',
      status: parseFloat(data.lightIntensity) > 700 ? 'Bright' : 'Low'
    },
    {
      icon: Zap,
      label: 'NPK Levels',
      value: `N:${data.npk.nitrogen} P:${data.npk.phosphorus} K:${data.npk.potassium}`,
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-500/10',
      status: 'Balanced'
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {sensors.map((sensor, index) => (
        <motion.div
          key={sensor.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${sensor.bgColor} backdrop-blur-sm rounded-xl p-4 border border-white/10`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${sensor.color}`}>
              <sensor.icon className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              sensor.status.includes('High') || sensor.status.includes('Low') || sensor.status.includes('Check')
                ? 'bg-yellow-500/20 text-yellow-300'
                : 'bg-green-500/20 text-green-300'
            }`}>
              {sensor.status}
            </span>
          </div>
          <h3 className="text-sm text-gray-400 mb-1">{sensor.label}</h3>
          <p className="text-2xl font-bold text-white">{sensor.value}</p>
        </motion.div>
      ))}
    </div>
  )
}
