'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Bird, Flame, MapPin, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface Threat {
  type: string
  confidence: string
  location: {
    x: string
    y: string
  }
  timestamp: string
}

export default function ThreatDetection({ threat }: { threat: Threat | null }) {
  const getThreatIcon = (type: string) => {
    switch(type) {
      case 'fire': return Flame
      case 'bird': return Bird
      default: return AlertTriangle
    }
  }

  const getThreatColor = (type: string) => {
    switch(type) {
      case 'fire': return 'from-red-500 to-orange-500'
      case 'bird': return 'from-yellow-500 to-amber-500'
      default: return 'from-orange-500 to-red-500'
    }
  }

  const getThreatName = (type: string) => {
    switch(type) {
      case 'fire': return '🔥 Fire Detected'
      case 'bird': return '🦅 Bird Activity'
      case 'elephant': return '🐘 Elephant Detected'
      case 'wild_boar': return '🐗 Wild Boar Detected'
      default: return 'Threat Detected'
    }
  }

  const getThreatAction = (type: string) => {
    switch(type) {
      case 'fire': return 'Emergency notification sent! Fire suppression protocol activated.'
      case 'bird': return 'Ultrasonic deterrent activated. Monitoring bird movement.'
      case 'elephant': return 'Alert sent to farmers. Strobing lights activated.'
      case 'wild_boar': return 'Deterrent system activated. Farmer notified via Telegram.'
      default: return 'Monitoring situation closely.'
    }
  }

  return (
    <AnimatePresence>
      {threat ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="relative overflow-hidden"
        >
          {/* Animated background */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${getThreatColor(threat.type)} opacity-20`}
            animate={{ opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border-2 border-red-500/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className={`p-3 rounded-xl bg-gradient-to-br ${getThreatColor(threat.type)}`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {getThreatIcon(threat.type)({ className: "w-6 h-6 text-white" })}
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {getThreatName(threat.type)}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Confidence: {(parseFloat(threat.confidence) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <motion.div
                className="px-4 py-2 bg-red-500/20 border border-red-500 rounded-full"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className="text-red-400 font-semibold text-sm">ACTIVE ALERT</span>
              </motion.div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-black/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">Location</span>
                </div>
                <p className="text-white font-mono text-sm">
                  X: {threat.location.x}m, Y: {threat.location.y}m
                </p>
              </div>
              
              <div className="bg-black/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Detected</span>
                </div>
                <p className="text-white text-sm">
                  {format(new Date(threat.timestamp), 'HH:mm:ss')}
                </p>
              </div>
            </div>

            {/* Action Taken */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Automated Response Active
              </h4>
              <p className="text-gray-300 text-sm">
                {getThreatAction(threat.type)}
              </p>
            </div>

            {/* Live Camera Feed Indicator */}
            <div className="mt-4 bg-black/40 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">Live Camera Feed - Node 01</span>
              </div>
              <span className="text-xs text-gray-500">AI Vision Processing</span>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">All Clear</h3>
          <p className="text-gray-400">
            AI monitoring systems active. No threats detected.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>✓ 4 Cameras Active</span>
            <span>✓ Real-time Analysis</span>
            <span>✓ 360° Coverage</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
