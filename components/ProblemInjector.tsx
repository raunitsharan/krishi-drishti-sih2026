'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, CheckCircle } from 'lucide-react'

interface Props {
  onInjectThreat: (type: string) => void
  onInjectWeather: (condition: string) => void
  onInjectIrrigationIssue: () => void
}

interface FeedItem {
  id: number
  icon: string
  msg: string
}

const THREATS = [
  { type: 'elephant',  emoji: '🐘', label: 'Elephant',    desc: 'Simulate elephant intrusion into crop field',    color: 'bg-red-500/10 border-red-500/40 hover:bg-red-500/20',    badge: 'bg-red-500',    text: 'text-red-300' },
  { type: 'wild_boar', emoji: '🐗', label: 'Wild Boar',   desc: 'Wild boar entering and damaging crops',          color: 'bg-orange-500/10 border-orange-500/40 hover:bg-orange-500/20', badge: 'bg-orange-500', text: 'text-orange-300' },
  { type: 'bird',      emoji: '🦅', label: 'Bird Flock',  desc: 'Flock of birds attacking grain crops',           color: 'bg-yellow-500/10 border-yellow-500/40 hover:bg-yellow-500/20', badge: 'bg-yellow-500', text: 'text-yellow-300' },
  { type: 'fire',      emoji: '🔥', label: 'Fire',        desc: 'Fire outbreak in field — emergency protocol',    color: 'bg-red-700/10 border-red-600/40 hover:bg-red-700/20',    badge: 'bg-red-600',    text: 'text-red-200' },
  { type: 'deer',      emoji: '🦌', label: 'Deer',        desc: 'Deer grazing and trampling crop rows',           color: 'bg-amber-500/10 border-amber-500/40 hover:bg-amber-500/20', badge: 'bg-amber-500',  text: 'text-amber-300' },
]

const WEATHER = [
  { type: 'drought',  emoji: '☀️',  label: 'Drought',    desc: 'Low moisture, high temp — irrigation critical',  color: 'bg-amber-500/10 border-amber-500/40 hover:bg-amber-500/20',  text: 'text-amber-300' },
  { type: 'flood',    emoji: '🌊',  label: 'Heavy Rain', desc: 'Soil saturation, flood risk — drainage alert',   color: 'bg-blue-500/10 border-blue-500/40 hover:bg-blue-500/20',     text: 'text-blue-300' },
  { type: 'heatwave', emoji: '🌡️', label: 'Heatwave',   desc: 'Extreme temp — crop stress and wilting risk',    color: 'bg-red-500/10 border-red-500/40 hover:bg-red-500/20',        text: 'text-red-300' },
  { type: 'normal',   emoji: '🌤️', label: 'Reset',      desc: 'Return to normal weather conditions',            color: 'bg-green-500/10 border-green-500/40 hover:bg-green-500/20',  text: 'text-green-300' },
]

const SYSTEM = [
  { type: 'irrigation', emoji: '💧', label: 'Irrigation Failure', desc: 'Valve stuck — flow drops to zero for 8 s',   color: 'bg-cyan-500/10 border-cyan-500/40 hover:bg-cyan-500/20',   text: 'text-cyan-300' },
  { type: 'clear',      emoji: '✅', label: 'Clear All Threats',  desc: 'Dismiss active threat, resume auto-detection', color: 'bg-green-500/10 border-green-500/40 hover:bg-green-500/20', text: 'text-green-300' },
]

let _id = 0
const nextId = () => ++_id

export default function ProblemInjector({ onInjectThreat, onInjectWeather, onInjectIrrigationIssue }: Props) {
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [lastInjected, setLastInjected] = useState<string | null>(null)

  const push = (icon: string, msg: string) => {
    const item = { id: nextId(), icon, msg }
    setFeed(prev => [item, ...prev].slice(0, 6))
  }

  const doThreat = (t: typeof THREATS[0]) => {
    onInjectThreat(t.type)
    push(t.emoji, `${t.label} detected — AI alert triggered, deterrent activated`)
    setLastInjected(t.type)
  }

  const doWeather = (w: typeof WEATHER[0]) => {
    onInjectWeather(w.type)
    push(w.emoji, w.type === 'normal' ? 'Weather reset to normal conditions' : `${w.label} simulated — sensors updated`)
    setLastInjected(w.type)
  }

  const doSystem = (s: typeof SYSTEM[0]) => {
    if (s.type === 'irrigation') {
      onInjectIrrigationIssue()
      push(s.emoji, 'Irrigation failure — valve stuck, auto-recovery in 8 s')
    } else {
      onInjectThreat('clear')
      push(s.emoji, 'All threats cleared — auto-detection resumed')
    }
    setLastInjected(s.type)
  }

  const Section = ({ title, color }: { title: string; color: string }) => (
    <div className={`flex items-center gap-2 mb-3`}>
      <div className={`h-px flex-1 bg-gradient-to-r ${color}`} />
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">{title}</span>
      <div className={`h-px flex-1 bg-gradient-to-l ${color}`} />
    </div>
  )

  const Card = ({
    emoji, label, desc, color, text, badge, onClick,
  }: {
    emoji: string; label: string; desc: string
    color: string; text: string; badge?: string; onClick: () => void
  }) => (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${color} group`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none mt-0.5 group-hover:scale-110 transition-transform inline-block">
          {emoji}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`font-bold text-sm ${text}`}>{label}</span>
            {badge && (
              <span className={`px-1.5 py-0.5 rounded text-white text-xs font-bold ${badge}`}>INJECT</span>
            )}
          </div>
          <p className="text-gray-400 text-xs leading-snug">{desc}</p>
        </div>
        <Zap className={`w-4 h-4 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${text}`} />
      </div>
    </motion.button>
  )

  return (
    <div className="space-y-6">
      {/* Instruction banner */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-purple-500/20 flex-shrink-0">
          <Zap className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <p className="text-white font-semibold mb-0.5">How it works</p>
          <p className="text-gray-300 text-sm">
            Click any button below — the app instantly jumps to <strong className="text-white">Live Monitor</strong>,
            shows the animated 3D model in the field (elephant walking, fire burning, birds flying…),
            fires an overlay alert with confidence score, and activates the deterrent system.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Threat column ── */}
        <div className="lg:col-span-2 bg-gray-900/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
          <Section title="Animal & Fire Threats" color="from-transparent via-red-500/40 to-transparent" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THREATS.map(t => (
              <Card key={t.type} {...t} badge={t.badge} onClick={() => doThreat(t)} />
            ))}
          </div>

          <div className="mt-5">
            <Section title="Weather Conditions" color="from-transparent via-blue-500/40 to-transparent" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {WEATHER.map(w => (
                <Card key={w.type} {...w} onClick={() => doWeather(w)} />
              ))}
            </div>
          </div>

          <div className="mt-5">
            <Section title="System Issues" color="from-transparent via-cyan-500/40 to-transparent" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SYSTEM.map(s => (
                <Card key={s.type} {...s} onClick={() => doSystem(s)} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Feed column ── */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 flex flex-col">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Injection Feed
          </h3>

          <div className="flex-1 space-y-2 min-h-[200px]">
            <AnimatePresence>
              {feed.length === 0 ? (
                <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 text-sm text-center mt-8">
                  No injections yet.<br />Click a button to start.
                </motion.p>
              ) : (
                feed.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-start gap-2 bg-black/30 rounded-lg px-3 py-2.5 border border-gray-700/30"
                  >
                    <span className="text-lg leading-none flex-shrink-0">{item.icon}</span>
                    <p className="text-gray-300 text-xs leading-snug">{item.msg}</p>
                    <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* What happens section */}
          <div className="mt-4 pt-4 border-t border-gray-700/40">
            <p className="text-xs font-semibold text-gray-400 mb-2">What happens on inject?</p>
            <ul className="space-y-1.5">
              {[
                { icon: '🎥', text: 'Camera detection beam activates' },
                { icon: '🔍', text: 'AI scan sweep starts on field' },
                { icon: '🐘', text: 'Animated 3D model appears in field' },
                { icon: '📦', text: 'Bounding box drawn around threat' },
                { icon: '🏷️', text: 'Label annotation shows on model' },
                { icon: '🚨', text: 'Alert banner with pipeline steps' },
                { icon: '🔊', text: 'Deterrent speaker pulses (non-fire)' },
                { icon: '📱', text: 'Telegram alert logged in feed' },
              ].map(i => (
                <li key={i.text} className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{i.icon}</span>
                  <span>{i.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
