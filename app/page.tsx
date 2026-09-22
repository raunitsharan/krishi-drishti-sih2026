'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Camera, Activity, BarChart3, Settings, Leaf, Menu, X, Bug } from 'lucide-react'
import SensorDashboard from '@/components/SensorDashboard'
import ThreatDetection from '@/components/ThreatDetection'
import IrrigationControl from '@/components/IrrigationControl'
import CropRecommendation from '@/components/CropRecommendation'
import HarvestPrediction from '@/components/HarvestPrediction'
import AlertSystem from '@/components/AlertSystem'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import ProblemInjector from '@/components/ProblemInjector'
import {
  generateRandomSensorData,
  generateThreatDetection,
  generateIrrigationData,
  getCropRecommendation,
  predictHarvestTime,
} from '@/lib/utils'

// Dynamically import 3D scene to avoid SSR issues
const FarmScene3D = dynamic(() => import('@/components/FarmScene3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-900/50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white">Loading 3D Farm View...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  const [activeTab, setActiveTab] = useState('monitor')
  const [sensorData, setSensorData] = useState(generateRandomSensorData())
  const [threat, setThreat] = useState<any>(null)
  const [irrigationData, setIrrigationData] = useState(generateIrrigationData())
  const [irrigationActive, setIrrigationActive] = useState(false)
  const [currentCrop] = useState('Rice')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [weatherCondition, setWeatherCondition] = useState('normal')
  const [autoThreats, setAutoThreats] = useState(true)

  // Manual threat injection
  const injectThreat = (type: string) => {
    if (type === 'clear') {
      setThreat(null)
      setAutoThreats(true)
      return
    }

    setAutoThreats(false)
    const newThreat = {
      type,
      confidence: (0.85 + Math.random() * 0.14).toFixed(2),
      location: {
        x: (Math.random() * 100).toFixed(1),
        y: (Math.random() * 100).toFixed(1),
      },
      timestamp: new Date().toISOString(),
    }
    setThreat(newThreat)
  }

  // Weather injection
  const injectWeather = (condition: string) => {
    setWeatherCondition(condition)
    
    // Adjust sensor data based on weather
    setSensorData(prev => {
      const data = { ...prev }
      switch(condition) {
        case 'drought':
          data.soilMoisture = (15 + Math.random() * 15).toFixed(1)
          data.temperature = (35 + Math.random() * 5).toFixed(1)
          data.humidity = (20 + Math.random() * 15).toFixed(1)
          break
        case 'flood':
          data.soilMoisture = (85 + Math.random() * 10).toFixed(1)
          data.humidity = (80 + Math.random() * 15).toFixed(1)
          data.temperature = (22 + Math.random() * 5).toFixed(1)
          break
        case 'heatwave':
          data.temperature = (38 + Math.random() * 5).toFixed(1)
          data.humidity = (25 + Math.random() * 10).toFixed(1)
          data.soilMoisture = (20 + Math.random() * 15).toFixed(1)
          break
        default:
          return generateRandomSensorData()
      }
      return data
    })
  }

  // Irrigation issue injection
  const injectIrrigationIssue = () => {
    setIrrigationData(prev => ({
      ...prev,
      status: 'error',
      waterFlow: '0',
      pressure: '0.0',
      valveStatus: 'stuck',
    }))
    
    setTimeout(() => {
      setIrrigationData(generateIrrigationData())
    }, 5000)
  }

  // Simulate real-time sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (weatherCondition === 'normal') {
        setSensorData(generateRandomSensorData())
      }
      
      // Random threat detection (20% chance every 5 seconds) - only if auto enabled
      if (autoThreats && Math.random() < 0.2) {
        setThreat(generateThreatDetection())
      } else if (autoThreats) {
        setThreat(null)
      }
      
      if (irrigationData.status !== 'error') {
        setIrrigationData(generateIrrigationData())
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [weatherCondition, autoThreats, irrigationData.status])

  const toggleIrrigation = () => {
    setIrrigationActive(!irrigationActive)
    setIrrigationData(prev => ({
      ...prev,
      status: !irrigationActive ? 'active' : 'idle',
      valveStatus: !irrigationActive ? 'open' : 'closed'
    }))
  }

  const tabs = [
    { id: 'monitor', label: 'Live Monitor', icon: Camera },
    { id: 'sensors', label: 'Sensors', icon: Activity },
    { id: 'crops', label: 'Crop AI', icon: Leaf },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'inject', label: 'Problem Inject', icon: Bug },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/20 to-blue-900/20">
      {/* Header */}
      <header className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Krishi Drishti</h1>
                <p className="text-sm text-gray-400">AI-Powered Precision Agriculture</p>
              </div>
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <nav className="hidden lg:flex items-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/50">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 font-semibold text-sm">System Online</span>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-4 space-y-2"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-800/50 text-gray-400'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'monitor' && (
            <motion.div
              key="monitor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* 3D Farm View */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Camera className="w-6 h-6" />
                  3D Farm Visualization
                </h2>
                <div className="h-[500px] rounded-xl overflow-hidden border border-gray-700">
                  <FarmScene3D threat={threat} irrigationActive={irrigationActive} />
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-black/30 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Active Cameras</p>
                    <p className="text-2xl font-bold text-white">4/4</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Sensors Online</p>
                    <p className="text-2xl font-bold text-white">5/5</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Coverage</p>
                    <p className="text-2xl font-bold text-white">100%</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Field Area</p>
                    <p className="text-2xl font-bold text-white">2.5 acres</p>
                  </div>
                </div>
              </div>

              {/* Threat Detection */}
              <ThreatDetection threat={threat} />

              {/* Alert System */}
              <AlertSystem threat={threat} />
            </motion.div>
          )}

          {activeTab === 'sensors' && (
            <motion.div
              key="sensors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Real-time Sensor Data</h2>
                <p className="text-gray-400">Live monitoring from field sensors and environmental data</p>
              </div>

              <SensorDashboard data={sensorData} />

              <IrrigationControl data={irrigationData} onToggle={toggleIrrigation} />
            </motion.div>
          )}

          {activeTab === 'crops' && (
            <motion.div
              key="crops"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">AI Crop Intelligence</h2>
                <p className="text-gray-400">Data-driven recommendations for optimal farming</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CropRecommendation recommendations={getCropRecommendation(sensorData)} />
                <HarvestPrediction crop={currentCrop} prediction={predictHarvestTime(currentCrop)} />
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Analytics & Insights</h2>
                <p className="text-gray-400">Performance metrics and cost-benefit analysis</p>
              </div>

              <AnalyticsDashboard />
            </motion.div>
          )}

          {activeTab === 'inject' && (
            <motion.div
              key="inject"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Problem Injection Panel</h2>
                <p className="text-gray-400">Manually inject problems to demonstrate system response</p>
              </div>

              <ProblemInjector 
                onInjectThreat={injectThreat}
                onInjectWeather={injectWeather}
                onInjectIrrigationIssue={injectIrrigationIssue}
              />

              {/* Current Status Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-bold text-white mb-4">Current System Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Threat Detection:</span>
                      <span className={`font-semibold ${threat ? 'text-red-400' : 'text-green-400'}`}>
                        {threat ? `Active (${threat.type})` : 'Clear'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Weather Condition:</span>
                      <span className="font-semibold text-blue-400">{weatherCondition}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Irrigation Status:</span>
                      <span className={`font-semibold ${irrigationData.status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                        {irrigationData.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Auto Threats:</span>
                      <span className={`font-semibold ${autoThreats ? 'text-green-400' : 'text-yellow-400'}`}>
                        {autoThreats ? 'Enabled' : 'Manual Mode'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-bold text-white mb-4">Environmental Impact</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Soil Moisture:</span>
                      <span className="font-semibold text-blue-400">{sensorData.soilMoisture}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Temperature:</span>
                      <span className="font-semibold text-orange-400">{sensorData.temperature}°C</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Humidity:</span>
                      <span className="font-semibold text-cyan-400">{sensorData.humidity}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">pH Level:</span>
                      <span className="font-semibold text-purple-400">{sensorData.pH}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700/50 bg-gray-900/80 backdrop-blur-xl mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-white font-semibold">Smart India Hackathon 2026</p>
              <p className="text-gray-400 text-sm">Problem Statement ID: 26210 | Team: Krishi Drishti</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Agriculture, FoodTech & Rural Development</span>
              <span className="hidden md:inline">•</span>
              <span>Hardware + AI Solution</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
