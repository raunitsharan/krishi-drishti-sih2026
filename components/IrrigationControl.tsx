'use client'

import { motion } from 'framer-motion'
import { Droplets, Power, Activity, Gauge, TrendingUp } from 'lucide-react'

interface IrrigationData {
  status: string
  waterFlow: string
  pressure: string
  valveStatus: string
  dailyUsage: string
}

export default function IrrigationControl({ 
  data, 
  onToggle 
}: { 
  data: IrrigationData
  onToggle: () => void 
}) {
  const isActive = data.status === 'active'

  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isActive ? 'bg-blue-500' : 'bg-gray-700'}`}>
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Smart Irrigation</h3>
            <p className="text-sm text-gray-400">AI-Optimized Watering</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <Power className="w-5 h-5" />
          {isActive ? 'Stop' : 'Start'}
        </motion.button>
      </div>

      {/* Status Indicator */}
      <div className={`mb-6 p-4 rounded-xl ${
        isActive ? 'bg-green-500/20 border border-green-500/50' : 'bg-gray-700/20 border border-gray-600'
      }`}>
        <div className="flex items-center gap-2">
          <motion.div
            className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-500'}`}
            animate={isActive ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-white font-semibold">
            System {isActive ? 'Active' : 'Idle'}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Water Flow</span>
          </div>
          <p className="text-2xl font-bold text-white">{data.waterFlow}</p>
          <p className="text-xs text-gray-500">liters/min</p>
        </div>
        
        <div className="bg-black/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400">Pressure</span>
          </div>
          <p className="text-2xl font-bold text-white">{data.pressure}</p>
          <p className="text-xs text-gray-500">bar</p>
        </div>
        
        <div className="bg-black/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Daily Usage</span>
          </div>
          <p className="text-2xl font-bold text-white">{data.dailyUsage}</p>
          <p className="text-xs text-gray-500">liters</p>
        </div>
        
        <div className="bg-black/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Power className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Valve Status</span>
          </div>
          <p className={`text-xl font-bold ${data.valveStatus === 'open' ? 'text-green-400' : 'text-red-400'}`}>
            {data.valveStatus.toUpperCase()}
          </p>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-4">
        <h4 className="text-purple-300 font-semibold mb-2 flex items-center gap-2">
          <span className="text-lg">🤖</span>
          AI Recommendation
        </h4>
        <p className="text-gray-300 text-sm">
          {isActive 
            ? 'Optimal irrigation cycle. Estimated 30% water savings vs traditional methods.'
            : 'Soil moisture adequate. Next irrigation recommended in 4 hours based on weather forecast and evapotranspiration rate.'}
        </p>
      </div>
    </div>
  )
}
