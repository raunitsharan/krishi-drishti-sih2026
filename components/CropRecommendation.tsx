'use client'

import { motion } from 'framer-motion'
import { Sprout, TrendingUp, Calendar, Target } from 'lucide-react'

interface Crop {
  crop: string
  suitability: number
  yield: string
  season: string
}

export default function CropRecommendation({ recommendations }: { recommendations: Crop[] }) {
  return (
    <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
          <Sprout className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">AI Crop Recommendations</h3>
          <p className="text-sm text-gray-400">Based on soil analysis & climate data</p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((crop, index) => (
          <motion.div
            key={crop.crop}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/30 rounded-xl p-4 border border-green-500/20 hover:border-green-500/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  {index === 0 && <span className="text-yellow-400">⭐</span>}
                  {crop.crop}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="bg-green-500/20 px-2 py-1 rounded text-xs text-green-300">
                    {crop.season}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-2xl font-bold text-white">{crop.suitability}%</span>
                </div>
                <span className="text-xs text-gray-400">Suitability</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${crop.suitability}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`absolute h-full rounded-full ${
                  crop.suitability >= 80 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                }`}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <span>Expected: {crop.yield}</span>
              </div>
              {index === 0 && (
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                  Recommended
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Planting Schedule
        </h4>
        <p className="text-gray-300 text-sm">
          Optimal planting window: Next 2-3 weeks. Weather conditions favorable with 
          adequate monsoon rainfall expected.
        </p>
      </div>
    </div>
  )
}
