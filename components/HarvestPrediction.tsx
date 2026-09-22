'use client'

import { motion } from 'framer-motion'
import { Calendar, TrendingUp, Target, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

interface HarvestData {
  days: number
  confidence: number
  optimalDate: Date
}

export default function HarvestPrediction({ 
  crop, 
  prediction 
}: { 
  crop: string
  prediction: HarvestData 
}) {
  const progress = ((120 - prediction.days) / 120) * 100 // Assuming 120 day cycle

  return (
    <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Harvest Prediction</h3>
          <p className="text-sm text-gray-400">AI-powered growth analysis</p>
        </div>
      </div>

      {/* Main Prediction Card */}
      <div className="bg-black/30 rounded-xl p-6 mb-6">
        <div className="text-center mb-4">
          <h4 className="text-gray-400 text-sm mb-2">Currently Growing</h4>
          <p className="text-3xl font-bold text-white mb-1">{crop}</p>
          <div className="flex items-center justify-center gap-2">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">
              {(prediction.confidence * 100).toFixed(0)}% Confidence
            </span>
          </div>
        </div>

        {/* Countdown */}
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 rounded-xl p-6 text-center mb-4">
          <p className="text-gray-400 text-sm mb-2">Days Until Optimal Harvest</p>
          <motion.p 
            className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            {prediction.days}
          </motion.p>
          <p className="text-gray-400 text-sm mt-2">
            {format(prediction.optimalDate, 'MMMM dd, yyyy')}
          </p>
        </div>

        {/* Growth Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Growth Progress</span>
            <span className="text-sm text-white font-semibold">{progress.toFixed(0)}%</span>
          </div>
          <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            />
          </div>
        </div>

        {/* Growth Stages */}
        <div className="grid grid-cols-4 gap-2">
          {['Planted', 'Vegetative', 'Flowering', 'Harvest'].map((stage, index) => (
            <div key={stage} className="text-center">
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${
                index < 2 ? 'bg-green-500' : index === 2 ? 'bg-amber-500' : 'bg-gray-600'
              }`}>
                {index < 2 ? '✓' : index === 2 ? '◐' : '○'}
              </div>
              <p className="text-xs text-gray-400">{stage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Yield Prediction */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Expected Yield</span>
          </div>
          <p className="text-2xl font-bold text-white">4.5</p>
          <p className="text-xs text-gray-500">tonnes/acre</p>
        </div>
        
        <div className="bg-black/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Quality Score</span>
          </div>
          <p className="text-2xl font-bold text-white">A+</p>
          <p className="text-xs text-gray-500">Premium grade</p>
        </div>
      </div>

      {/* Weather Alert */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <h4 className="text-yellow-300 font-semibold mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Weather Advisory
        </h4>
        <p className="text-gray-300 text-sm">
          Monitor rainfall in the next 10 days. Consider early harvest if heavy rain predicted 
          near maturity date to prevent lodging.
        </p>
      </div>
    </div>
  )
}
