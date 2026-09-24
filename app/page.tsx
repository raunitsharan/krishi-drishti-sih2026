'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Camera, Activity, BarChart3, Leaf, Menu, X, Bug, AlertTriangle, CheckCircle } from 'lucide-react'
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

const FarmScene3D = dynamic(() => import('@/components/FarmScene3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-900/50 rounded-xl">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white font-semibold">Loading 3D Farm...</p>
        <p className="text-gray-400 text-sm mt-1">Initialising WebGL scene</p>
      </div>
    </div>
  ),
})

// ── Animated alert banner that floats above the 3D canvas ────────────────────
function AlertBanner({ threat, onDismiss }: { threat: any; onDismiss: () => void }) {
  const meta: Record<string, { emoji: string; label: string; color: string; border: string; action: string }> = {
    elephant:  { emoji: '🐘', label: 'ELEPHANT INTRUSION',  color: 'from-red-600 to-orange-600',    border: 'border-red-500',    action: 'Strobing lights + Ultrasonic deterrent activated. Farmer alerted via Telegram.' },
    wild_boar: { emoji: '🐗', label: 'WILD BOAR DETECTED',  color: 'from-orange-600 to-amber-600',  border: 'border-orange-500', action: 'Ultrasonic repeller ON. Node CAM-01 tracking movement. Alert sent.' },
    bird:      { emoji: '🦅', label: 'BIRD FLOCK DETECTED', color: 'from-yellow-500 to-amber-500',  border: 'border-yellow-400', action: 'High-frequency sound emitter active. Monitoring flock trajectory.' },
    fire:      { emoji: '🔥', label: '🚨 FIRE EMERGENCY',   color: 'from-red-700 to-red-500',       border: 'border-red-400',    action: 'EMERGENCY ALERT sent! Fire suppression protocol active. Nearest station notified.' },
    deer:      { emoji: '🦌', label: 'DEER DETECTED',       color: 'from-amber-600 to-yellow-600',  border: 'border-amber-400',  action: 'Perimeter lights activated. Deterrent speaker ON. Farmer notified.' },
  }
  const m = meta[threat?.type] ?? meta['deer']

  return (
    <motion.div
      initial={{ opacity: 0, y: -40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0,   scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`absolute top-4 left-4 right-4 z-30 rounded-2xl border-2 ${m.border} bg-gray-900/95 backdrop-blur-xl shadow-2xl overflow-hidden`}
    >
      {/* Top gradient bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${m.color}`} />

      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Pulsing icon */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${m.color}`}
          >
            <span className="text-2xl">{m.emoji}</span>
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-white font-bold text-lg tracking-wide">{m.label}</span>
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
                className="px-2 py-0.5 bg-red-500/30 border border-red-500 rounded-full text-red-300 text-xs font-bold"
              >
                LIVE
              </motion.span>
            </div>

            {/* Detail row */}
            <div className="flex flex-wrap gap-3 text-sm mb-2">
              <span className="text-gray-300">
                📍 <span className="font-mono text-white">X:{threat.location.x}m · Y:{threat.location.y}m</span>
              </span>
              <span className="text-gray-300">
                🎯 Confidence: <span className="text-green-400 font-bold">{(parseFloat(threat.confidence) * 100).toFixed(1)}%</span>
              </span>
              <span className="text-gray-400 text-xs">
                🕐 {new Date(threat.timestamp).toLocaleTimeString()}
              </span>
            </div>

            {/* Action taken */}
            <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-300 text-sm">{m.action}</p>
            </div>
          </div>

          {/* Dismiss */}
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1.5 rounded-lg bg-gray-700/50 hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps pipeline */}
        <div className="mt-3 grid grid-cols-4 gap-2">
          {['Detected', 'Classified', 'Alert Sent', 'Deterrent ON'].map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center gap-1"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                threat.type === 'fire' && i === 3
                  ? 'bg-gray-600 text-gray-400'
                  : 'bg-green-500 text-white'
              }`}>
                {threat.type === 'fire' && i === 3 ? '—' : '✓'}
              </div>
              <span className="text-xs text-gray-400 text-center leading-tight">{step}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── Weather banner ────────────────────────────────────────────────────────────
function WeatherBanner({ weather }: { weather: string }) {
  if (weather === 'normal') return null
  const meta: Record<string, { emoji: string; label: string; color: string; tip: string }> = {
    drought:  { emoji: '☀️', label: 'DROUGHT CONDITIONS', color: 'from-amber-600/30 to-orange-600/30 border-amber-500/50', tip: 'Soil moisture critical — smart irrigation activated.' },
    flood:    { emoji: '🌊', label: 'HEAVY RAIN / FLOOD RISK', color: 'from-blue-600/30 to-cyan-600/30 border-blue-500/50', tip: 'Drainage channels monitored. Over-watering protection engaged.' },
    heatwave: { emoji: '🌡️', label: 'EXTREME HEATWAVE', color: 'from-red-600/30 to-orange-600/30 border-red-500/50', tip: 'Crop stress risk high — shading and irrigation recommended.' },
  }
  const m = meta[weather]
  if (!m) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`absolute bottom-4 left-4 right-4 z-20 rounded-xl border bg-gradient-to-r ${m.color} backdrop-blur-sm p-3 flex items-center gap-3`}
    >
      <span className="text-2xl">{m.emoji}</span>
      <div>
        <p className="text-white font-bold text-sm">{m.label}</p>
        <p className="text-gray-300 text-xs">{m.tip}</p>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('monitor')
  const [sensorData, setSensorData] = useState(generateRandomSensorData())
  const [threat, setThreat] = useState<any>(null)
  const [irrigationData, setIrrigationData] = useState(generateIrrigationData())
  const [irrigationActive, setIrrigationActive] = useState(false)
  const [currentCrop] = useState('Rice')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [weather, setWeather] = useState('normal')
  const [autoThreats, setAutoThreats] = useState(true)
  const [alertDismissed, setAlertDismissed] = useState(false)

  // Refs to avoid stale-closure bugs in setInterval
  const weatherRef    = useRef(weather)
  const autoRef       = useRef(autoThreats)
  const irrigErrRef   = useRef(false)
  useEffect(() => { weatherRef.current  = weather },    [weather])
  useEffect(() => { autoRef.current     = autoThreats }, [autoThreats])

  // ── Threat injection (used by ProblemInjector) ────────────────────────────
  const injectThreat = useCallback((type: string) => {
    if (type === 'clear') {
      setThreat(null)
      setAutoThreats(true)
      setAlertDismissed(false)
      return
    }
    setAutoThreats(false)
    setAlertDismissed(false)
    setThreat({
      type,
      confidence: (0.85 + Math.random() * 0.14).toFixed(2),
      location: {
        x: (20 + Math.random() * 60).toFixed(1),
        y: (20 + Math.random() * 60).toFixed(1),
      },
      timestamp: new Date().toISOString(),
    })
    setActiveTab('monitor')          // always jump to monitor on injection
  }, [])

  // ── Weather injection ─────────────────────────────────────────────────────
  const injectWeather = useCallback((condition: string) => {
    setWeather(condition)
    setSensorData(prev => {
      const d = { ...prev }
      if (condition === 'drought') {
        d.soilMoisture  = (10 + Math.random() * 15).toFixed(1)
        d.temperature   = (36 + Math.random() * 6).toFixed(1)
        d.humidity      = (18 + Math.random() * 12).toFixed(1)
      } else if (condition === 'flood') {
        d.soilMoisture  = (88 + Math.random() * 10).toFixed(1)
        d.humidity      = (82 + Math.random() * 12).toFixed(1)
        d.temperature   = (22 + Math.random() * 4).toFixed(1)
      } else if (condition === 'heatwave') {
        d.temperature   = (40 + Math.random() * 5).toFixed(1)
        d.humidity      = (20 + Math.random() * 10).toFixed(1)
        d.soilMoisture  = (18 + Math.random() * 12).toFixed(1)
      } else {
        return generateRandomSensorData()
      }
      return d
    })
    setActiveTab('monitor')
  }, [])

  // ── Irrigation failure injection ──────────────────────────────────────────
  const injectIrrigationIssue = useCallback(() => {
    irrigErrRef.current = true
    setIrrigationData(prev => ({ ...prev, status: 'error', waterFlow: '0', pressure: '0.0', valveStatus: 'stuck' }))
    setActiveTab('sensors')
    setTimeout(() => {
      irrigErrRef.current = false
      setIrrigationData(generateIrrigationData())
    }, 8000)
  }, [])

  // ── Auto simulation (avoids stale closure via refs) ───────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      if (weatherRef.current === 'normal') setSensorData(generateRandomSensorData())
      if (autoRef.current) {
        const t = generateThreatDetection()
        setThreat(t)
        if (t) setAlertDismissed(false)
      }
      if (!irrigErrRef.current) setIrrigationData(generateIrrigationData())
    }, 5000)
    return () => clearInterval(id)
  }, [])   // empty deps — safe because we use refs

  const toggleIrrigation = () => {
    setIrrigationActive(v => {
      const next = !v
      setIrrigationData(prev => ({ ...prev, status: next ? 'active' : 'idle', valveStatus: next ? 'open' : 'closed' }))
      return next
    })
  }

  const tabs = [
    { id: 'monitor',  label: 'Live Monitor',    icon: Camera },
    { id: 'sensors',  label: 'Sensors',         icon: Activity },
    { id: 'crops',    label: 'Crop AI',         icon: Leaf },
    { id: 'analytics',label: 'Analytics',       icon: BarChart3 },
    { id: 'inject',   label: 'Problem Inject',  icon: Bug },
  ]

  const showAlert = !!threat && !alertDismissed

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-green-950/20 to-blue-950/20">
      {/* ── Header ── */}
      <header className="border-b border-gray-700/50 bg-gray-900/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white leading-none">Krishi Drishti</h1>
                <p className="text-xs text-gray-400 mt-0.5">AI-Powered Precision Agriculture · SIH 2026</p>
              </div>
            </div>

            {/* Threat pill */}
            <AnimatePresence>
              {threat && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/60 rounded-full cursor-pointer"
                  onClick={() => setActiveTab('monitor')}
                >
                  <motion.div className="w-2 h-2 bg-red-400 rounded-full" animate={{ scale: [1,1.4,1] }} transition={{ duration: 0.7, repeat: Infinity }} />
                  <span className="text-red-300 text-xs font-semibold uppercase tracking-wide">
                    ⚠ {threat.type.replace('_',' ')} alert
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/40'
                      : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'inject' && (
                    <span className="ml-1 px-1.5 py-0.5 bg-purple-500/30 text-purple-300 text-xs rounded-full">NEW</span>
                  )}
                  {tab.id === 'monitor' && threat && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                </button>
              ))}
            </nav>

            {/* Status pill + mobile menu */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/40">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-semibold">Online</span>
              </div>
              <button onClick={() => setMobileMenuOpen(v => !v)} className="lg:hidden p-2 text-white">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-3 grid grid-cols-2 gap-2"
              >
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false) }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      activeTab === tab.id ? 'bg-green-500 text-white' : 'bg-gray-800/60 text-gray-400'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">

          {/* ── MONITOR TAB ── */}
          {activeTab === 'monitor' && (
            <motion.div key="monitor"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* 3D canvas card */}
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-green-400" />
                    3D Farm Live View
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {[
                      { label: '4 Cameras', color: 'green' },
                      { label: '5 Sensors', color: 'blue' },
                      { label: '4 Sprinklers', color: 'cyan' },
                      { label: weather !== 'normal' ? `⚠ ${weather}` : '☀ Normal', color: weather !== 'normal' ? 'amber' : 'gray' },
                    ].map(b => (
                      <span key={b.label} className={`px-2 py-1 rounded-full bg-${b.color}-500/10 border border-${b.color}-500/30 text-${b.color}-300`}>
                        {b.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Canvas wrapper — position:relative so banners overlay correctly */}
                <div className="relative h-[520px] rounded-xl overflow-hidden border border-gray-700/60">
                  <FarmScene3D
                    threat={threat}
                    irrigationActive={irrigationActive}
                    weather={weather}
                  />

                  {/* Alert banner overlay */}
                  <AnimatePresence>
                    {showAlert && (
                      <AlertBanner threat={threat} onDismiss={() => setAlertDismissed(true)} />
                    )}
                  </AnimatePresence>

                  {/* Weather banner overlay */}
                  <AnimatePresence>
                    {weather !== 'normal' && (
                      <WeatherBanner weather={weather} />
                    )}
                  </AnimatePresence>

                  {/* All-clear overlay */}
                  <AnimatePresence>
                    {!threat && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/40 rounded-full backdrop-blur-sm"
                      >
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-300 text-xs font-semibold">All Clear — AI Monitoring Active</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Stats row */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Active Cameras', value: '4/4', color: 'green' },
                    { label: 'Sensors Online', value: '5/5', color: 'blue' },
                    { label: 'Field Coverage', value: '100%', color: 'purple' },
                    { label: 'Threat Status', value: threat ? '⚠ Alert' : '✓ Clear', color: threat ? 'red' : 'green' },
                  ].map(s => (
                    <div key={s.label} className="bg-black/30 rounded-xl p-3 text-center border border-gray-700/30">
                      <p className="text-gray-400 text-xs mb-1">{s.label}</p>
                      <p className={`text-xl font-bold text-${s.color}-400`}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <ThreatDetection threat={threat} />
              <AlertSystem threat={threat} />
            </motion.div>
          )}

          {/* ── SENSORS TAB ── */}
          {activeTab === 'sensors' && (
            <motion.div key="sensors"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Real-time Sensor Data</h2>
                <p className="text-gray-400">Live readings from field nodes · auto-updates every 5 s</p>
              </div>
              <SensorDashboard data={sensorData} />
              <IrrigationControl data={irrigationData} onToggle={toggleIrrigation} />
            </motion.div>
          )}

          {/* ── CROPS TAB ── */}
          {activeTab === 'crops' && (
            <motion.div key="crops"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">AI Crop Intelligence</h2>
                <p className="text-gray-400">Data-driven recommendations based on live soil & climate data</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CropRecommendation recommendations={getCropRecommendation(sensorData)} />
                <HarvestPrediction crop={currentCrop} prediction={predictHarvestTime(currentCrop)} />
              </div>
            </motion.div>
          )}

          {/* ── ANALYTICS TAB ── */}
          {activeTab === 'analytics' && (
            <motion.div key="analytics"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Analytics & Insights</h2>
                <p className="text-gray-400">Performance metrics, cost-benefit analysis and trend charts</p>
              </div>
              <AnalyticsDashboard />
            </motion.div>
          )}

          {/* ── PROBLEM INJECT TAB ── */}
          {activeTab === 'inject' && (
            <motion.div key="inject"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Problem Injection Panel</h2>
                <p className="text-gray-400">
                  Manually trigger any farm scenario — the system jumps to Live Monitor and shows the full 3D response.
                </p>
              </div>

              <ProblemInjector
                onInjectThreat={injectThreat}
                onInjectWeather={injectWeather}
                onInjectIrrigationIssue={injectIrrigationIssue}
              />

              {/* Live status cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900/60 rounded-2xl p-5 border border-gray-700/50 space-y-3">
                  <h3 className="text-white font-bold">Current System State</h3>
                  {[
                    { label: 'Active Threat',    value: threat ? `⚠ ${threat.type.replace('_',' ')}` : '✓ None', ok: !threat },
                    { label: 'Weather',          value: weather,          ok: weather === 'normal' },
                    { label: 'Irrigation',       value: irrigationData.status, ok: irrigationData.status !== 'error' },
                    { label: 'Auto-detection',   value: autoThreats ? 'Enabled' : 'Manual', ok: true },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between items-center text-sm border-b border-gray-700/30 pb-2 last:border-0 last:pb-0">
                      <span className="text-gray-400">{r.label}</span>
                      <span className={`font-semibold ${r.ok ? 'text-green-400' : 'text-red-400'}`}>{r.value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-900/60 rounded-2xl p-5 border border-gray-700/50 space-y-3">
                  <h3 className="text-white font-bold">Live Sensor Snapshot</h3>
                  {[
                    { label: 'Soil Moisture',  value: `${sensorData.soilMoisture}%`,   color: 'text-blue-400' },
                    { label: 'Temperature',    value: `${sensorData.temperature}°C`,   color: 'text-orange-400' },
                    { label: 'Humidity',       value: `${sensorData.humidity}%`,       color: 'text-cyan-400' },
                    { label: 'Soil pH',        value: sensorData.pH,                   color: 'text-purple-400' },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between items-center text-sm border-b border-gray-700/30 pb-2 last:border-0 last:pb-0">
                      <span className="text-gray-400">{r.label}</span>
                      <span className={`font-semibold ${r.color}`}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-700/40 bg-gray-900/80 backdrop-blur-xl mt-12">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-400">
          <p><span className="text-white font-semibold">Smart India Hackathon 2026</span> · Problem ID: 26210 · Team Krishi Drishti</p>
          <div className="flex gap-4">
            <a href="https://github.com/raunitsharan/krishi-drishti-sih2026" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub ↗</a>
            <span>Agriculture · FoodTech · Rural Dev</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
