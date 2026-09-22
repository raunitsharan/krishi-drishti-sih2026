'use client'

import { motion } from 'framer-motion'
import { Bug, Flame, Bird, AlertTriangle, Droplets, Wind } from 'lucide-react'

interface ProblemInjectorProps {
  onInjectThreat: (type: string) => void
  onInjectWeather: (condition: string) => void
  onInjectIrrigationIssue: () => void
}

export default function ProblemInjector({ 
  onInjectThreat, 
  onInjectWeather,
  onInjectIrrigationIssue 
}: ProblemInjectorProps) {
  const threats = [
    { type: 'elephant', label: '🐘 Elephant', color: 'from-red-500 to-orange-500', icon: AlertTriangle },
    { type: 'wild_boar', label: '🐗 Wild Boar', color: 'from-orange-500 to-red-500', icon: AlertTriangle },
    { type: 'bird', label: '🦅 Bird Flock', color: 'from-yellow-500 to-amber-500', icon: Bird },
    { type: 'fire', label: '🔥 Fire', color: 'from-red-600 to-orange-600', icon: Flame },
    { type: 'deer', label: '🦌 Deer', color: 'from-amber-500 to-yellow-500', icon: AlertTriangle },
  ]

  const weatherProblems = [
    { type: 'drought', label: '☀️ Drought', icon: Wind },
    { type: 'flood', label: '🌊 Heavy Rain', icon: Droplets },
    { type: 'heatwave', label: '🌡️ Heatwave', icon: Flame },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
          <Bug className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Problem Injection Panel</h3>
          <p className="text-sm text-gray-400">Simulate real-world agricultural challenges</p>
        </div>
      </div>

      {/* Threat Injection */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Inject Threat Detection
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {threats.map((threat) => (
            <motion.button
              key={threat.type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onInjectThreat(threat.type)}
              className={`p-4 rounded-xl bg-gradient-to-br ${threat.color} text-white font-semibold text-sm hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <threat.icon className="w-5 h-5" />
              </div>
              {threat.label}
            </motion.button>
          ))}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onInjectThreat('clear')}
            className="p-4 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 text-white font-semibold text-sm hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              ✓
            </div>
            Clear All
          </motion.button>
        </div>
      </div>

      {/* Weather Problems */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
          <Wind className="w-4 h-4" />
          Inject Weather Condition
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {weatherProblems.map((weather) => (
            <motion.button
              key={weather.type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onInjectWeather(weather.type)}
              className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <weather.icon className="w-5 h-5" />
              </div>
              {weather.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Other Issues */}
      <div>
        <h4 className="text-sm font-semibold text-green-300 mb-3 flex items-center gap-2">
          <Droplets className="w-4 h-4" />
          Inject System Issues
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onInjectIrrigationIssue}
            className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white font-semibold text-sm hover:shadow-lg transition-shadow"
          >
            💧 Irrigation Failure
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onInjectWeather('normal')}
            className="p-4 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 text-white font-semibold text-sm hover:shadow-lg transition-shadow"
          >
            ✓ Reset Weather
          </motion.button>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2 text-sm">
          <span className="text-lg">ℹ️</span>
          How to Use
        </h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Click any button to simulate that problem</li>
          <li>• Watch the 3D view update with indicators</li>
          <li>• See alerts appear in real-time</li>
          <li>• Check system responses and recommendations</li>
          <li>• Use "Clear All" or "Reset" to return to normal</li>
        </ul>
      </div>
    </motion.div>
  )
}
