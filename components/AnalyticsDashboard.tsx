'use client'

import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Droplets, Zap } from 'lucide-react'

const waterUsageData = [
  { day: 'Mon', usage: 1200, optimal: 1000 },
  { day: 'Tue', usage: 980, optimal: 1000 },
  { day: 'Wed', usage: 1100, optimal: 1000 },
  { day: 'Thu', usage: 950, optimal: 1000 },
  { day: 'Fri', usage: 1050, optimal: 1000 },
  { day: 'Sat', usage: 900, optimal: 1000 },
  { day: 'Sun', usage: 1020, optimal: 1000 },
]

const cropHealthData = [
  { name: 'Mon', health: 85 },
  { name: 'Tue', health: 87 },
  { name: 'Wed', health: 86 },
  { name: 'Thu', health: 89 },
  { name: 'Fri', health: 91 },
  { name: 'Sat', health: 92 },
  { name: 'Sun', health: 93 },
]

const threatDistribution = [
  { name: 'Birds', value: 45, color: '#FCD34D' },
  { name: 'Wild Animals', value: 30, color: '#F87171' },
  { name: 'Fire Alerts', value: 15, color: '#FB923C' },
  { name: 'Other', value: 10, color: '#94A3B8' },
]

const costSavingsData = [
  { month: 'Jan', traditional: 8000, ai: 5200 },
  { month: 'Feb', traditional: 8200, ai: 5100 },
  { month: 'Mar', traditional: 8500, ai: 5400 },
  { month: 'Apr', traditional: 9000, ai: 5800 },
  { month: 'May', traditional: 9200, ai: 5900 },
  { month: 'Jun', traditional: 8800, ai: 5600 },
]

export default function AnalyticsDashboard() {
  const totalSavings = 18500
  const waterSaved = 35
  const yieldIncrease = 22

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-green-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Cost Savings</h3>
          <p className="text-3xl font-bold text-white mb-1">₹{totalSavings.toLocaleString()}</p>
          <p className="text-green-400 text-sm">+35% vs traditional</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-500">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <TrendingDown className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Water Conservation</h3>
          <p className="text-3xl font-bold text-white mb-1">{waterSaved}%</p>
          <p className="text-blue-400 text-sm">Reduced usage</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl p-6 border border-amber-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-amber-500">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Yield Increase</h3>
          <p className="text-3xl font-bold text-white mb-1">{yieldIncrease}%</p>
          <p className="text-amber-400 text-sm">Higher productivity</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Water Usage Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 className="text-lg font-bold text-white mb-4">Weekly Water Usage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={waterUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="usage" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="optimal" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-sm text-gray-400">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-sm text-gray-400">Optimal</span>
            </div>
          </div>
        </motion.div>

        {/* Crop Health Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 className="text-lg font-bold text-white mb-4">Crop Health Score</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={cropHealthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[80, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="health" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Average Health Score: <span className="text-green-400 font-bold">88.9%</span>
            </p>
          </div>
        </motion.div>

        {/* Threat Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 className="text-lg font-bold text-white mb-4">Threat Detection Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={threatDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {threatDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Cost Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
        >
          <h3 className="text-lg font-bold text-white mb-4">Cost Comparison (₹/acre)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={costSavingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="traditional" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={{ fill: '#EF4444', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="ai" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded" />
              <span className="text-sm text-gray-400">Traditional</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-sm text-gray-400">AI System</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
