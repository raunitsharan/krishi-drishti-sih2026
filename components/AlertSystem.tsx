'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Send, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { format } from 'date-fns'
import { useState, useEffect } from 'react'

interface Alert {
  id: string
  type: 'threat' | 'system' | 'info'
  message: string
  timestamp: Date
  sent: boolean
}

export default function AlertSystem({ threat }: { threat: any | null }) {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    if (threat) {
      const newAlert: Alert = {
        id: Date.now().toString(),
        type: 'threat',
        message: `${threat.type.toUpperCase()} detected at location (${threat.location.x}, ${threat.location.y}). Confidence: ${(parseFloat(threat.confidence) * 100).toFixed(1)}%`,
        timestamp: new Date(),
        sent: true
      }
      setAlerts(prev => [newAlert, ...prev.slice(0, 4)])
    }
  }, [threat])

  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'threat': return AlertTriangle
      case 'system': return Info
      default: return Bell
    }
  }

  const getAlertColor = (type: string) => {
    switch(type) {
      case 'threat': return 'from-red-500 to-orange-500'
      case 'system': return 'from-blue-500 to-cyan-500'
      default: return 'from-purple-500 to-pink-500'
    }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/30">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
          <Send className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Telegram Alert System</h3>
          <p className="text-sm text-gray-400">Real-time farmer notifications</p>
        </div>
      </div>

      {/* Telegram Bot Status */}
      <div className="bg-black/30 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-3 h-3 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-white font-semibold">Bot Active</span>
          </div>
          <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
            Connected
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">{alerts.length}</p>
            <p className="text-xs text-gray-400">Alerts Sent</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-xs text-gray-400">Active Users</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">100%</p>
            <p className="text-xs text-gray-400">Delivery Rate</p>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Recent Alerts
        </h4>
        
        <AnimatePresence>
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-black/20 rounded-xl p-4 text-center"
            >
              <p className="text-gray-400 text-sm">No recent alerts</p>
            </motion.div>
          ) : (
            alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/30 rounded-xl p-4 border border-gray-700/50"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${getAlertColor(alert.type)}`}>
                    {getAlertIcon(alert.type)({ className: "w-4 h-4 text-white" })}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-white text-sm mb-1">{alert.message}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {format(alert.timestamp, 'HH:mm:ss')}
                      </p>
                      {alert.sent && (
                        <div className="flex items-center gap-1 text-green-400">
                          <CheckCircle className="w-3 h-3" />
                          <span className="text-xs">Delivered</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Bot Configuration */}
      <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
        <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
          <span className="text-lg">📱</span>
          Integration Details
        </h4>
        <p className="text-gray-300 text-sm mb-3">
          Farmers receive instant alerts via Telegram with location maps and recommended actions.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">WiFi Connected</span>
          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Real-time</span>
          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Multi-user</span>
        </div>
      </div>
    </div>
  )
}
