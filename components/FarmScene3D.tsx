'use client'

import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export interface ThreatData {
  type: string
  confidence: string
  location: { x: string; y: string }
  timestamp: string
}

export interface FarmScene3DProps {
  threat: ThreatData | null
  irrigationActive: boolean
  weather: string
}

interface LabelInfo {
  id: string
  text: string
  color: string
  bg: string
  worldPos: THREE.Vector3
}

interface ScreenLabel {
  id: string
  text: string
  color: string
  bg: string
  x: number
  y: number
  visible: boolean
}

type LabelSetter = React.Dispatch<React.SetStateAction<ScreenLabel[]>>

// ── Label projector ───────────────────────────────────────────────────────────
function LabelProjector({
  labelsRef,
  setScreenLabels,
}: {
  labelsRef: React.MutableRefObject<Map<string, LabelInfo>>
  setScreenLabels: LabelSetter
}) {
  const { camera, size } = useThree()
  const v = useMemo(() => new THREE.Vector3(), [])
  const prev = useRef('')

  useFrame(() => {
    const out: ScreenLabel[] = []
    labelsRef.current.forEach((l) => {
      v.copy(l.worldPos).project(camera)
      if (Math.abs(v.x) > 1.5 || Math.abs(v.y) > 1.5 || v.z > 1) {
        out.push({ id: l.id, text: l.text, color: l.color, bg: l.bg, x: -9999, y: -9999, visible: false })
      } else {
        out.push({
          id: l.id, text: l.text, color: l.color, bg: l.bg,
          x: (v.x * 0.5 + 0.5) * size.width,
          y: (-v.y * 0.5 + 0.5) * size.height,
          visible: true,
        })
      }
    })
    const key = out.map(o => `${o.id}:${Math.round(o.x)},${Math.round(o.y)}`).join('|')
    if (key !== prev.current) {
      prev.current = key
      setScreenLabels(out)
    }
  })
  return null
}

// ── Ground ────────────────────────────────────────────────────────────────────
function Field({ weather }: { weather: string }) {
  const color = weather === 'drought' ? '#7a5c2a' : weather === 'flood' ? '#1a5c3a' : '#2d5016'
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  )
}

// ── Crop rows ─────────────────────────────────────────────────────────────────
function CropRows({ weather }: { weather: string }) {
  const color = weather === 'drought' ? '#8b6914' : weather === 'heatwave' ? '#a0740a' : '#4a7c22'
  const items = useMemo<[number, number][]>(() => {
    const out: [number, number][] = []
    for (let x = -18; x < 18; x += 2.5)
      for (let z = -18; z < 18; z += 2.5)
        out.push([x, z])
    return out
  }, [])
  return (
    <>
      {items.map(([x, z]) => (
        <mesh key={`${x}_${z}`} position={[x, 0.5, z]}>
          <coneGeometry args={[0.28, 1.1, 6]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      ))}
    </>
  )
}

// ── Fence ─────────────────────────────────────────────────────────────────────
function Fence() {
  const posts = useMemo<[number, number, number][]>(() => {
    const out: [number, number, number][] = []
    const s = 23, step = 4
    for (let x = -s; x <= s; x += step) { out.push([x, 0.7, -s]); out.push([x, 0.7, s]) }
    for (let z = -s; z <= s; z += step) { out.push([-s, 0.7, z]); out.push([s, 0.7, z]) }
    return out
  }, [])
  return (
    <>
      {posts.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.15, 1.4, 0.15]} />
          <meshStandardMaterial color="#5c3d1e" />
        </mesh>
      ))}
    </>
  )
}

// ── Control room ──────────────────────────────────────────────────────────────
function ControlRoom({ labelsRef }: { labelsRef: React.MutableRefObject<Map<string, LabelInfo>> }) {
  const wp = useMemo(() => new THREE.Vector3(-20, 5.2, -20), [])
  useEffect(() => {
    labelsRef.current.set('ctrl', { id: 'ctrl', text: 'Control Room', color: '#ffcc77', bg: 'rgba(60,30,0,0.85)', worldPos: wp })
    return () => { labelsRef.current.delete('ctrl') }
  }, [labelsRef, wp])
  return (
    <group position={[-20, 0, -20]}>
      <mesh position={[0, 1.5, 0]}><boxGeometry args={[4, 3, 4]} /><meshStandardMaterial color="#e8d5b0" /></mesh>
      <mesh position={[0, 3.2, 0]}><coneGeometry args={[3, 1.2, 4]} /><meshStandardMaterial color="#b05020" /></mesh>
      <mesh position={[0, 0.75, 2.01]}><boxGeometry args={[0.8, 1.5, 0.05]} /><meshStandardMaterial color="#5c3d1e" /></mesh>
      <mesh position={[1.5, 4.5, 0]}><sphereGeometry args={[0.1, 8, 6]} /><meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.8} /></mesh>
    </group>
  )
}

// ── Water tank ────────────────────────────────────────────────────────────────
function WaterTank({ labelsRef }: { labelsRef: React.MutableRefObject<Map<string, LabelInfo>> }) {
  const wp = useMemo(() => new THREE.Vector3(20, 5.6, -20), [])
  useEffect(() => {
    labelsRef.current.set('tank', { id: 'tank', text: 'Water Tank', color: '#7ec8f5', bg: 'rgba(0,30,80,0.85)', worldPos: wp })
    return () => { labelsRef.current.delete('tank') }
  }, [labelsRef, wp])
  return (
    <group position={[20, 0, -20]}>
      <mesh position={[0, 2, 0]}><cylinderGeometry args={[1.5, 1.5, 4, 16]} /><meshStandardMaterial color="#1565c0" metalness={0.6} roughness={0.3} /></mesh>
      <mesh position={[0, 4.1, 0]}><cylinderGeometry args={[1.55, 1.55, 0.2, 16]} /><meshStandardMaterial color="#0d47a1" /></mesh>
    </group>
  )
}

// ── Camera unit ───────────────────────────────────────────────────────────────
function CameraUnit({ position, active, lid, lt, labelsRef }: {
  position: [number, number, number]; active: boolean; lid: string; lt: string
  labelsRef: React.MutableRefObject<Map<string, LabelInfo>>
}) {
  const lensRef = useRef<THREE.Mesh>(null!)
  const coneRef = useRef<THREE.Mesh>(null!)
  const wp = useMemo(() => new THREE.Vector3(position[0], position[1] + 6.4, position[2]), [position])
  const activeRef = useRef(active)
  useEffect(() => { activeRef.current = active }, [active])

  useEffect(() => {
    labelsRef.current.set(lid, { id: lid, text: lt, color: active ? '#00ff88' : '#aaa', bg: 'rgba(0,0,0,0.7)', worldPos: wp })
    return () => { labelsRef.current.delete(lid) }
  }, [labelsRef, lid, lt, active, wp])

  useFrame(({ clock }) => {
    const lm = lensRef.current?.material as THREE.MeshStandardMaterial | undefined
    if (lm) lm.emissiveIntensity = activeRef.current ? 0.4 + 0.4 * Math.sin(clock.elapsedTime * 7) : 0
    const cm = coneRef.current?.material as THREE.MeshBasicMaterial | undefined
    if (cm) cm.opacity = activeRef.current ? 0.07 : 0
  })

  return (
    <group position={position}>
      <mesh position={[0, 2, 0]}><cylinderGeometry args={[0.08, 0.1, 4, 8]} /><meshStandardMaterial color="#555" /></mesh>
      <mesh position={[0, 4.2, 0]}><boxGeometry args={[0.5, 0.3, 0.4]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh ref={lensRef} position={[0, 4.2, 0.22]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 12]} />
        <meshStandardMaterial color={active ? '#00ff88' : '#333'} emissive={new THREE.Color(active ? '#00ff88' : '#000')} emissiveIntensity={0} />
      </mesh>
      <mesh position={[0, 5, 0]} rotation={[-Math.PI / 6, 0, 0]}><boxGeometry args={[1, 0.04, 0.7]} /><meshStandardMaterial color="#1a237e" metalness={0.9} roughness={0.1} /></mesh>
      <mesh ref={coneRef} position={[0, 3.5, 0]} rotation={[Math.PI / 6, 0, 0]}>
        <coneGeometry args={[3, 6, 16, 1, true]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// ── Sensor node ───────────────────────────────────────────────────────────────
function SensorUnit({ position, lid, lt, labelsRef }: {
  position: [number, number, number]; lid: string; lt: string
  labelsRef: React.MutableRefObject<Map<string, LabelInfo>>
}) {
  const wp = useMemo(() => new THREE.Vector3(position[0], position[1] + 4.5, position[2]), [position])
  useEffect(() => {
    labelsRef.current.set(lid, { id: lid, text: lt, color: '#ff9944', bg: 'rgba(80,30,0,0.75)', worldPos: wp })
    return () => { labelsRef.current.delete(lid) }
  }, [labelsRef, lid, lt, wp])
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}><cylinderGeometry args={[0.07, 0.07, 3, 8]} /><meshStandardMaterial color="#666" /></mesh>
      <mesh position={[0, 3.2, 0]}><boxGeometry args={[0.4, 0.55, 0.28]} /><meshStandardMaterial color="#ff6600" /></mesh>
      <mesh position={[0, 3.2, 0.15]}><boxGeometry args={[0.28, 0.38, 0.02]} /><meshStandardMaterial color="#000" emissive="#00ff88" emissiveIntensity={0.4} /></mesh>
    </group>
  )
}

// ── Irrigation ────────────────────────────────────────────────────────────────
function IrrigationUnit({ position, active, lid, lt, labelsRef }: {
  position: [number, number, number]; active: boolean; lid: string; lt: string
  labelsRef: React.MutableRefObject<Map<string, LabelInfo>>
}) {
  const coneRef = useRef<THREE.Mesh>(null!)
  const activeRef = useRef(active)
  useEffect(() => { activeRef.current = active }, [active])
  const wp = useMemo(() => new THREE.Vector3(position[0], position[1] + 1.4, position[2]), [position])
  useEffect(() => {
    labelsRef.current.set(lid, { id: lid, text: lt, color: active ? '#7ec8f5' : '#667788', bg: 'rgba(0,20,50,0.75)', worldPos: wp })
    return () => { labelsRef.current.delete(lid) }
  }, [labelsRef, lid, lt, active, wp])

  useFrame(({ clock }) => {
    if (!coneRef.current) return
    coneRef.current.rotation.y = clock.elapsedTime * 1.5
    ;(coneRef.current.material as THREE.MeshBasicMaterial).opacity = activeRef.current ? 0.22 + 0.12 * Math.sin(clock.elapsedTime * 5) : 0
  })

  return (
    <group position={position}>
      <mesh><cylinderGeometry args={[0.18, 0.14, 0.45, 12]} /><meshStandardMaterial color="#2196f3" metalness={0.4} /></mesh>
      <mesh ref={coneRef} position={[0, -0.7, 0]}>
        <coneGeometry args={[1.8, 1.8, 16, 1, true]} />
        <meshBasicMaterial color="#7ec8f5" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// ── NPK marker ────────────────────────────────────────────────────────────────
function NPKMarker({ position, lid, lt, labelsRef }: {
  position: [number, number, number]; lid: string; lt: string
  labelsRef: React.MutableRefObject<Map<string, LabelInfo>>
}) {
  const wp = useMemo(() => new THREE.Vector3(position[0], position[1] + 1.4, position[2]), [position])
  useEffect(() => {
    labelsRef.current.set(lid, { id: lid, text: lt, color: '#ff9900', bg: 'rgba(80,30,0,0.7)', worldPos: wp })
    return () => { labelsRef.current.delete(lid) }
  }, [labelsRef, lid, lt, wp])
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.22, 0.22, 0.36, 8]} /><meshStandardMaterial color="#8b4513" /></mesh>
      <mesh position={[0, 0.55, 0]}><sphereGeometry args={[0.15, 8, 6]} /><meshStandardMaterial color="#ff9900" emissive="#ff9900" emissiveIntensity={0.3} /></mesh>
    </group>
  )
}

// ── Speaker ───────────────────────────────────────────────────────────────────
function Speaker({ position, active, lid, labelsRef }: {
  position: [number, number, number]; active: boolean; lid: string
  labelsRef: React.MutableRefObject<Map<string, LabelInfo>>
}) {
  const mRef = useRef<THREE.Mesh>(null!)
  const activeRef = useRef(active)
  useEffect(() => { activeRef.current = active }, [active])
  const wp = useMemo(() => new THREE.Vector3(position[0], position[1] + 1.3, position[2]), [position])
  useEffect(() => {
    labelsRef.current.set(lid, { id: lid, text: active ? 'Deterrent ON' : 'Speaker', color: active ? '#ff9900' : '#666', bg: 'rgba(0,0,0,0.7)', worldPos: wp })
    return () => { labelsRef.current.delete(lid) }
  }, [labelsRef, lid, active, wp])

  useFrame(({ clock }) => {
    if (!mRef.current) return
    const s = activeRef.current ? 1 + 0.1 * Math.sin(clock.elapsedTime * 14) : 1
    mRef.current.scale.set(s, s, s)
  })

  return (
    <group position={position}>
      <mesh ref={mRef}>
        <coneGeometry args={[0.3, 0.5, 8]} />
        <meshStandardMaterial color={active ? '#ff6600' : '#444'} emissive={new THREE.Color(active ? '#ff3300' : '#000')} emissiveIntensity={active ? 0.6 : 0} />
      </mesh>
    </group>
  )
}

// ── Scan sweep ────────────────────────────────────────────────────────────────
function ScanSweep({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null!)
  const activeRef = useRef(active)
  useEffect(() => { activeRef.current = active }, [active])
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 1.1
    ;(ref.current.material as THREE.MeshBasicMaterial).opacity = activeRef.current ? 0.08 : 0
  })
  return (
    <mesh ref={ref} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0, 24, 64, 1, 0, Math.PI / 3.5]} />
      <meshBasicMaterial color="#00ff88" transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  )
}

// ── Alert ring ────────────────────────────────────────────────────────────────
function AlertRing({ position, color, active }: { position: [number, number, number]; color: string; active: boolean }) {
  const ref = useRef<THREE.Mesh>(null!)
  const activeRef = useRef(active)
  const posRef = useRef(position)
  useEffect(() => { activeRef.current = active }, [active])
  useEffect(() => { posRef.current = position }, [position])
  useFrame(({ clock }) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.MeshBasicMaterial
    if (!activeRef.current) { mat.opacity = 0; return }
    const t = clock.elapsedTime % 1.5
    ref.current.position.set(posRef.current[0], 0.05, posRef.current[2])
    ref.current.scale.set(1 + t * 2.5, 1, 1 + t * 2.5)
    mat.opacity = Math.max(0, 0.55 - t / 2.5)
  })
  return (
    <mesh ref={ref} position={[position[0], 0.05, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.2, 2, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  )
}

// ── Elephant ──────────────────────────────────────────────────────────────────
function Elephant({ position, visible, labelsRef }: {
  position: [number, number, number]; visible: boolean
  labelsRef: React.MutableRefObject<Map<string, LabelInfo>>
}) {
  const gRef = useRef<THREE.Group>(null!)
  const lFL = useRef<THREE.Mesh>(null!)
  const lFR = useRef<THREE.Mesh>(null!)
  const lBL = useRef<THREE.Mesh>(null!)
  const lBR = useRef<THREE.Mesh>(null!)
  const visRef = useRef(visible)
  const posRef = useRef(position)
  const wpRef = useRef(new THREE.Vector3())
  useEffect(() => { visRef.current = visible }, [visible])
  useEffect(() => { posRef.current = position }, [position])

  useFrame(({ clock }) => {
    if (!gRef.current) return
    gRef.current.visible = visRef.current
    if (!visRef.current) {
      labelsRef.current.delete('threat_lbl')
      return
    }
    const t = clock.elapsedTime
    const px = posRef.current[0] + Math.sin(t * 0.4) * 3
    const pz = posRef.current[2] + Math.cos(t * 0.3) * 2
    gRef.current.position.set(px, 0, pz)
    gRef.current.rotation.y = t * 0.3
    wpRef.current.set(px, 4.2, pz)
    labelsRef.current.set('threat_lbl', { id: 'threat_lbl', text: 'ELEPHANT DETECTED', color: '#ff4444', bg: 'rgba(160,0,0,0.85)', worldPos: wpRef.current })
    if (lFL.current) lFL.current.rotation.x = Math.sin(t * 2.5) * 0.35
    if (lFR.current) lFR.current.rotation.x = -Math.sin(t * 2.5) * 0.35
    if (lBL.current) lBL.current.rotation.x = -Math.sin(t * 2.5) * 0.35
    if (lBR.current) lBR.current.rotation.x = Math.sin(t * 2.5) * 0.35
  })

  const g = '#808080', dk = '#606060'
  return (
    <group ref={gRef} visible={false}>
      <mesh position={[0, 1.4, 0]}><sphereGeometry args={[1.3, 10, 8]} /><meshStandardMaterial color={g} roughness={0.9} /></mesh>
      <mesh position={[1.2, 1.9, 0]}><sphereGeometry args={[0.75, 10, 8]} /><meshStandardMaterial color={g} roughness={0.9} /></mesh>
      <mesh position={[2.0, 1.3, 0]} rotation={[0, 0, -Math.PI / 3]}><cylinderGeometry args={[0.18, 0.1, 1.4, 8]} /><meshStandardMaterial color={dk} /></mesh>
      <mesh position={[1.1, 2.1, 0.7]}><sphereGeometry args={[0.5, 8, 6]} /><meshStandardMaterial color={dk} /></mesh>
      <mesh position={[1.1, 2.1, -0.7]}><sphereGeometry args={[0.5, 8, 6]} /><meshStandardMaterial color={dk} /></mesh>
      <mesh position={[1.85, 1.45, 0.25]} rotation={[0, 0, -Math.PI / 5]}><cylinderGeometry args={[0.07, 0.02, 0.9, 6]} /><meshStandardMaterial color="#fff8e1" /></mesh>
      <mesh ref={lFL} position={[0.6, 0.45, 0.55]}><cylinderGeometry args={[0.25, 0.2, 1.0, 8]} /><meshStandardMaterial color={g} /></mesh>
      <mesh ref={lFR} position={[0.6, 0.45, -0.55]}><cylinderGeometry args={[0.25, 0.2, 1.0, 8]} /><meshStandardMaterial color={g} /></mesh>
      <mesh ref={lBL} position={[-0.6, 0.45, 0.55]}><cylinderGeometry args={[0.25, 0.2, 1.0, 8]} /><meshStandardMaterial color={g} /></mesh>
      <mesh ref={lBR} position={[-0.6, 0.45, -0.55]}><cylinderGeometry args={[0.25, 0.2, 1.0, 8]} /><meshStandardMaterial color={g} /></mesh>
      <mesh><boxGeometry args={[3.2, 3.0, 1.8]} /><meshBasicMaterial color="#ff0000" wireframe transparent opacity={0.5} /></mesh>
    </group>
  )
}

// ── Wild Boar ─────────────────────────────────────────────────────────────────
function WildBoar({ position, visible, labelsRef }: {
  position: [number, number, number]; visible: boolean
  labelsRef: React.MutableRefObject<Map<string, LabelInfo>>
}) {
  const gRef = useRef<THREE.Group>(null!)
  const visRef = useRef(visible)
  const posRef = useRef(position)
  const wpRef = useRef(new THREE.Vector3())
  useEffect(() => { visRef.current = visible }, [visible])
  useEffect(() => { posRef.current = position }, [position])

  useFrame(({ clock }) => {
    if (!gRef.current) return
    gRef.current.visible = visRef.current
    if (!visRef.current) { labelsRef.current.delete('threat_lbl'); return }
    const t = clock.elapsedTime
    const px = posRef.current[0] + Math.sin(t * 0.9) * 4
    const pz = posRef.current[2] + Math.cos(t * 0.7) * 3
    gRef.current.position.set(px, 0, pz)
    gRef.current.rotation.y = t * 0.7
    wpRef.current.set(px, 2.5, pz)
    labelsRef.current.set('threat_lbl', { id: 'threat_lbl', text: 'WILD BOAR DETECTED', color: '#ff6600', bg: 'rgba(140,50,0,0.85)', worldPos: wpRef.current })
  })

  const br = '#5c3317', dk = '#3d2010'
  return (
    <group ref={gRef} visible={false}>
      <mesh position={[0, 0.65, 0]}><sphereGeometry args={[0.9, 10, 8]} /><meshStandardMaterial color={br} roughness={0.9} /></mesh>
      <mesh position={[0.9, 0.75, 0]}><sphereGeometry args={[0.5, 10, 8]} /><meshStandardMaterial color={dk} /></mesh>
      <mesh position={[1.35, 0.62, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.2, 0.15, 0.35, 8]} /><meshStandardMaterial color="#333" /></mesh>
      {([[0.4,0.2,0.4],[-0.4,0.2,0.4],[0.4,0.2,-0.4],[-0.4,0.2,-0.4]] as [number,number,number][]).map((p, i) => (
        <mesh key={i} position={p}><cylinderGeometry args={[0.12, 0.1, 0.55, 6]} /><meshStandardMaterial color={br} /></mesh>
      ))}
      <mesh><boxGeometry args={[2.0, 1.4, 1.2]} /><meshBasicMaterial color="#ff6600" wireframe transparent opacity={0.5} /></mesh>
    </group>
  )
}

// ── Bird unit ─────────────────────────────────────────────────────────────────
function BirdUnit({ index, origin, visRef }: { index: number; origin: React.MutableRefObject<[number,number,number]>; visRef: React.MutableRefObject<boolean> }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.visible = visRef.current
    if (!visRef.current) return
    const t = clock.elapsedTime, o = index * 1.05
    ref.current.position.set(
      origin.current[0] + Math.sin(t * 0.55 + o) * 7,
      origin.current[1] + 5 + Math.sin(t * 1.1 + o) * 1.2,
      origin.current[2] + Math.cos(t * 0.45 + o) * 6,
    )
    ref.current.rotation.y = Math.sin(t + o) * 0.5
  })
  return (
    <group ref={ref} visible={false}>
      <mesh><sphereGeometry args={[0.2, 8, 6]} /><meshStandardMaterial color="#333" /></mesh>
      <mesh position={[0, 0, 0.35]} rotation={[0.2, 0, 0.4]}><boxGeometry args={[0.55, 0.06, 0.28]} /><meshStandardMaterial color="#555" /></mesh>
      <mesh position={[0, 0, -0.35]} rotation={[-0.2, 0, -0.4]}><boxGeometry args={[0.55, 0.06, 0.28]} /><meshStandardMaterial color="#555" /></mesh>
    </group>
  )
}

function BirdFlock({ position, visible, labelsRef }: {
  position: [number, number, number]; visible: boolean
  labelsRef: React.MutableRefObject<Map<string, LabelInfo>>
}) {
  const visRef = useRef(visible)
  const posRef = useRef(position)
  useEffect(() => { visRef.current = visible }, [visible])
  useEffect(() => { posRef.current = position }, [position])
  const wpRef = useRef(new THREE.Vector3())

  useFrame(() => {
    if (!visRef.current) { labelsRef.current.delete('threat_lbl'); return }
    wpRef.current.set(posRef.current[0], posRef.current[1] + 8, posRef.current[2])
    labelsRef.current.set('threat_lbl', { id: 'threat_lbl', text: 'BIRD FLOCK DETECTED', color: '#ffd700', bg: 'rgba(100,70,0,0.85)', worldPos: wpRef.current })
  })

  return (
    <>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <BirdUnit key={i} index={i} origin={posRef} visRef={visRef} />
      ))}
    </>
  )
}

// ── Fire ──────────────────────────────────────────────────────────────────────
function FireEffect({ position, visible, labelsRef }: {
  position: [number, number, number]; visible: boolean
  labelsRef: React.MutableRefObject<Map<string, LabelInfo>>
}) {
  const f1 = useRef<THREE.Mesh>(null!)
  const f2 = useRef<THREE.Mesh>(null!)
  const f3 = useRef<THREE.Mesh>(null!)
  const sm = useRef<THREE.Mesh>(null!)
  const pl = useRef<THREE.PointLight>(null!)
  const visRef = useRef(visible)
  const posRef = useRef(position)
  const wpRef = useRef(new THREE.Vector3())
  useEffect(() => { visRef.current = visible }, [visible])
  useEffect(() => { posRef.current = position }, [position])

  useFrame(({ clock }) => {
    if (!f1.current) return
    const t = clock.elapsedTime, s = visRef.current ? 1 : 0
    ;(f1.current.material as THREE.MeshBasicMaterial).opacity = s * (0.75 + 0.15 * Math.sin(t * 8))
    ;(f2.current.material as THREE.MeshBasicMaterial).opacity = s * (0.7 + 0.15 * Math.sin(t * 9 + 1))
    ;(f3.current.material as THREE.MeshBasicMaterial).opacity = s * (0.85 + 0.1 * Math.sin(t * 10 + 2))
    ;(sm.current.material as THREE.MeshBasicMaterial).opacity = s * (0.18 + 0.07 * Math.sin(t * 3))
    f1.current.scale.set(0.8 + 0.25 * Math.sin(t * 8), 0.9 + 0.2 * Math.sin(t * 7), 0.8 + 0.25 * Math.sin(t * 6))
    sm.current.position.y = posRef.current[1] + 3.5 + Math.sin(t * 1.5) * 0.4
    if (pl.current) pl.current.intensity = visRef.current ? 3 + Math.sin(t * 6) * 1.5 : 0
    if (!visRef.current) { labelsRef.current.delete('threat_lbl'); return }
    wpRef.current.set(posRef.current[0], posRef.current[1] + 5.5, posRef.current[2])
    labelsRef.current.set('threat_lbl', { id: 'threat_lbl', text: 'FIRE EMERGENCY', color: '#ff2200', bg: 'rgba(180,0,0,0.9)', worldPos: wpRef.current })
  })

  return (
    <group position={position}>
      <mesh ref={f1} position={[0, 0.8, 0]}><coneGeometry args={[1.2, 2.5, 8]} /><meshBasicMaterial color="#ff4400" transparent opacity={0} /></mesh>
      <mesh ref={f2} position={[0, 1.2, 0]}><coneGeometry args={[0.85, 2.2, 8]} /><meshBasicMaterial color="#ff8800" transparent opacity={0} /></mesh>
      <mesh ref={f3} position={[0, 1.6, 0]}><coneGeometry args={[0.5, 1.8, 8]} /><meshBasicMaterial color="#ffdd00" transparent opacity={0} /></mesh>
      <pointLight ref={pl} position={[0, 1.5, 0]} color="#ff4400" intensity={0} distance={14} />
      <mesh ref={sm} position={[0, 3.5, 0]}><sphereGeometry args={[1.2, 8, 6]} /><meshBasicMaterial color="#333" transparent opacity={0} /></mesh>
      <mesh><boxGeometry args={[3.0, 4.5, 3.0]} /><meshBasicMaterial color="#ff0000" wireframe transparent opacity={visible ? 0.45 : 0} /></mesh>
    </group>
  )
}

// ── Deer ──────────────────────────────────────────────────────────────────────
function Deer({ position, visible, labelsRef }: {
  position: [number, number, number]; visible: boolean
  labelsRef: React.MutableRefObject<Map<string, LabelInfo>>
}) {
  const gRef = useRef<THREE.Group>(null!)
  const visRef = useRef(visible)
  const posRef = useRef(position)
  const wpRef = useRef(new THREE.Vector3())
  useEffect(() => { visRef.current = visible }, [visible])
  useEffect(() => { posRef.current = position }, [position])

  useFrame(({ clock }) => {
    if (!gRef.current) return
    gRef.current.visible = visRef.current
    if (!visRef.current) { labelsRef.current.delete('threat_lbl'); return }
    const t = clock.elapsedTime
    const px = posRef.current[0] + Math.sin(t * 0.7) * 5
    const pz = posRef.current[2] + Math.cos(t * 0.6) * 4
    gRef.current.position.set(px, 0, pz)
    gRef.current.rotation.y = t * 0.5
    wpRef.current.set(px, 3.2, pz)
    labelsRef.current.set('threat_lbl', { id: 'threat_lbl', text: 'DEER DETECTED', color: '#ffaa00', bg: 'rgba(120,70,0,0.85)', worldPos: wpRef.current })
  })

  const tan = '#c8922a', dk = '#8b6220'
  return (
    <group ref={gRef} visible={false}>
      <mesh position={[0, 1.0, 0]}><sphereGeometry args={[0.7, 10, 8]} /><meshStandardMaterial color={tan} /></mesh>
      <mesh position={[0.5, 1.5, 0]} rotation={[0, 0, -0.5]}><cylinderGeometry args={[0.18, 0.22, 0.7, 8]} /><meshStandardMaterial color={tan} /></mesh>
      <mesh position={[0.9, 1.9, 0]}><sphereGeometry args={[0.32, 10, 8]} /><meshStandardMaterial color={dk} /></mesh>
      {([[0.35,0.3,0.32],[-0.35,0.3,0.32],[0.35,0.3,-0.32],[-0.35,0.3,-0.32]] as [number,number,number][]).map((p, i) => (
        <mesh key={i} position={p}><cylinderGeometry args={[0.08, 0.06, 0.7, 6]} /><meshStandardMaterial color={tan} /></mesh>
      ))}
      <mesh><boxGeometry args={[1.8, 2.2, 1.0]} /><meshBasicMaterial color="#ffaa00" wireframe transparent opacity={0.45} /></mesh>
    </group>
  )
}

// ── Rain ──────────────────────────────────────────────────────────────────────
function Rain({ visible }: { visible: boolean }) {
  const COUNT = 280
  const geo = useRef<THREE.BufferGeometry>(null!)
  const visRef = useRef(visible)
  useEffect(() => { visRef.current = visible }, [visible])
  const positions = useMemo(() => {
    const a = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      a[i * 3] = (Math.random() - 0.5) * 55
      a[i * 3 + 1] = Math.random() * 22
      a[i * 3 + 2] = (Math.random() - 0.5) * 55
    }
    return a
  }, [])
  useFrame(() => {
    if (!geo.current || !visRef.current) return
    const p = geo.current.attributes.position.array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      p[i * 3 + 1] -= 0.28
      if (p[i * 3 + 1] < 0) p[i * 3 + 1] = 22
    }
    geo.current.attributes.position.needsUpdate = true
  })
  return (
    <points visible={visible}>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#aaddff" size={0.14} transparent opacity={0.55} />
    </points>
  )
}

// ── Drought glow ──────────────────────────────────────────────────────────────
function DroughtGlow({ visible }: { visible: boolean }) {
  const ref = useRef<THREE.PointLight>(null!)
  const visRef = useRef(visible)
  useEffect(() => { visRef.current = visible }, [visible])
  useFrame(({ clock }) => {
    if (ref.current) ref.current.intensity = visRef.current ? 3 + Math.sin(clock.elapsedTime * 2) * 1.2 : 0
  })
  return <pointLight ref={ref} position={[0, 30, 0]} color="#ff9900" intensity={0} distance={90} />
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene({
  threat,
  irrigationActive,
  weather,
  labelsRef,
  setScreenLabels,
}: {
  threat: ThreatData | null
  irrigationActive: boolean
  weather: string
  labelsRef: React.MutableRefObject<Map<string, LabelInfo>>
  setScreenLabels: LabelSetter
}) {
  const threatPos = useMemo<[number, number, number]>(
    () => threat
      ? [(parseFloat(threat.location.x) - 50) / 5, 0, (parseFloat(threat.location.y) - 50) / 5]
      : [5, 0, 5],
    [threat],
  )

  const isElephant = threat?.type === 'elephant'
  const isBoar     = threat?.type === 'wild_boar'
  const isBird     = threat?.type === 'bird'
  const isFire     = threat?.type === 'fire'
  const isDeer     = threat?.type === 'deer'
  const anyThreat  = !!threat
  const alertColor = isFire ? '#ff0000' : isBird ? '#ffd700' : '#ff6600'

  // Register static field label once
  useEffect(() => {
    labelsRef.current.set('field', { id: 'field', text: 'Crop Field 2.5 Acres', color: '#88ff88', bg: 'rgba(0,55,0,0.75)', worldPos: new THREE.Vector3(0, 0.3, -22) })
  }, [labelsRef])

  const skyColor = weather === 'drought' || weather === 'heatwave' ? '#ff9944' : weather === 'flood' ? '#445566' : '#87CEEB'

  return (
    <>
      <color attach="background" args={[skyColor]} />
      <ambientLight intensity={weather === 'drought' || weather === 'heatwave' ? 0.85 : 0.5} color={weather === 'drought' || weather === 'heatwave' ? '#ffe090' : '#ffffff'} />
      <directionalLight position={[50, 50, 25]} intensity={1.2} />
      <OrbitControls enablePan enableZoom enableRotate maxPolarAngle={Math.PI / 2.05} minDistance={8} maxDistance={90} makeDefault />

      <Field weather={weather} />
      <CropRows weather={weather} />
      <Fence />
      <ControlRoom labelsRef={labelsRef} />
      <WaterTank labelsRef={labelsRef} />

      <NPKMarker position={[-8, 0, -8]} lid="npk_a" lt="NPK Sensor A" labelsRef={labelsRef} />
      <NPKMarker position={[ 8, 0, -8]} lid="npk_b" lt="NPK Sensor B" labelsRef={labelsRef} />
      <NPKMarker position={[-8, 0,  8]} lid="npk_c" lt="NPK Sensor C" labelsRef={labelsRef} />
      <NPKMarker position={[ 8, 0,  8]} lid="npk_d" lt="NPK Sensor D" labelsRef={labelsRef} />

      <CameraUnit position={[-18, 0, -18]} active={anyThreat} lid="cam1" lt="CAM-01 (ESP32)" labelsRef={labelsRef} />
      <CameraUnit position={[ 18, 0, -18]} active={anyThreat} lid="cam2" lt="CAM-02 (ESP32)" labelsRef={labelsRef} />
      <CameraUnit position={[-18, 0,  18]} active={false}     lid="cam3" lt="CAM-03 (ESP32)" labelsRef={labelsRef} />
      <CameraUnit position={[ 18, 0,  18]} active={false}     lid="cam4" lt="CAM-04 (ESP32)" labelsRef={labelsRef} />

      <SensorUnit position={[-10, 0, -10]} lid="sn1" lt="Sensor Node 1" labelsRef={labelsRef} />
      <SensorUnit position={[ 10, 0, -10]} lid="sn2" lt="Sensor Node 2" labelsRef={labelsRef} />
      <SensorUnit position={[-10, 0,  10]} lid="sn3" lt="Sensor Node 3" labelsRef={labelsRef} />
      <SensorUnit position={[ 10, 0,  10]} lid="sn4" lt="Sensor Node 4" labelsRef={labelsRef} />
      <SensorUnit position={[  0, 0,   0]} lid="snc" lt="Central Node"  labelsRef={labelsRef} />

      <Speaker position={[-17, 0.5, 0]} active={anyThreat && !isFire} lid="spk_l" labelsRef={labelsRef} />
      <Speaker position={[ 17, 0.5, 0]} active={anyThreat && !isFire} lid="spk_r" labelsRef={labelsRef} />

      <IrrigationUnit position={[-6, 2, -6]} active={irrigationActive} lid="irr1" lt="Sprinkler 1" labelsRef={labelsRef} />
      <IrrigationUnit position={[ 6, 2, -6]} active={irrigationActive} lid="irr2" lt="Sprinkler 2" labelsRef={labelsRef} />
      <IrrigationUnit position={[-6, 2,  6]} active={irrigationActive} lid="irr3" lt="Sprinkler 3" labelsRef={labelsRef} />
      <IrrigationUnit position={[ 6, 2,  6]} active={irrigationActive} lid="irr4" lt="Sprinkler 4" labelsRef={labelsRef} />

      <ScanSweep active={anyThreat} />
      <AlertRing position={threatPos} color={alertColor} active={anyThreat} />
      <Rain visible={weather === 'flood'} />
      <DroughtGlow visible={weather === 'drought' || weather === 'heatwave'} />

      <Elephant  position={threatPos} visible={isElephant} labelsRef={labelsRef} />
      <WildBoar  position={threatPos} visible={isBoar}     labelsRef={labelsRef} />
      <BirdFlock position={threatPos} visible={isBird}     labelsRef={labelsRef} />
      <FireEffect position={threatPos} visible={isFire}    labelsRef={labelsRef} />
      <Deer      position={threatPos} visible={isDeer}     labelsRef={labelsRef} />

      <LabelProjector labelsRef={labelsRef} setScreenLabels={setScreenLabels} />
    </>
  )
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function FarmScene3D({ threat, irrigationActive, weather }: FarmScene3DProps) {
  const labelsRef = useRef<Map<string, LabelInfo>>(new Map())
  const [screenLabels, setScreenLabels] = useState<ScreenLabel[]>([])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [35, 28, 35], fov: 55 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => { gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)) }}
      >
        <Scene
          threat={threat}
          irrigationActive={irrigationActive}
          weather={weather}
          labelsRef={labelsRef}
          setScreenLabels={setScreenLabels}
        />
      </Canvas>

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {screenLabels.map(l =>
          !l.visible || !l.text ? null : (
            <div
              key={l.id}
              style={{
                position: 'absolute',
                left: l.x,
                top: l.y,
                transform: 'translate(-50%, -50%)',
                background: l.bg,
                color: l.color,
                padding: '2px 8px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                border: `1px solid ${l.color}44`,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              {l.text}
            </div>
          )
        )}
      </div>
    </div>
  )
}
