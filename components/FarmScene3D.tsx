'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Sky,
  Html,
} from '@react-three/drei'
import * as THREE from 'three'

// ─── Label annotation ────────────────────────────────────────────────────────
function Label({ text, color = '#ffffff', bg = 'rgba(0,0,0,0.6)' }: { text: string; color?: string; bg?: string }) {
  return (
    <Html center distanceFactor={18} zIndexRange={[0, 10]}>
      <div
        style={{
          background: bg,
          color,
          padding: '2px 8px',
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 700,
          whiteSpace: 'nowrap',
          border: `1px solid ${color}40`,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {text}
      </div>
    </Html>
  )
}

// ─── Ground field ─────────────────────────────────────────────────────────────
function Field({ weather }: { weather: string }) {
  const color =
    weather === 'drought' ? '#6b4c1e' :
    weather === 'flood'   ? '#1a5c3a' :
    '#2d5016'

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 60, 30, 30]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  )
}

// ─── Crop rows ────────────────────────────────────────────────────────────────
function CropRows({ weather }: { weather: string }) {
  const cropColor =
    weather === 'drought'  ? '#8b6914' :
    weather === 'heatwave' ? '#a0740a' :
    '#4a7c22'

  const crops = useMemo(() => {
    const list: React.ReactElement[] = []
    for (let x = -18; x < 18; x += 2.2) {
      for (let z = -18; z < 18; z += 2.2) {
        list.push(
          <mesh key={`${x}-${z}`} position={[x, 0.5, z]} castShadow>
            <coneGeometry args={[0.28, 1.1, 6]} />
            <meshStandardMaterial color={cropColor} roughness={0.8} />
          </mesh>
        )
      }
    }
    return list
  }, [cropColor])

  return <>{crops}</>
}

// ─── Camera unit (ESP32-CAM on pole) ─────────────────────────────────────────
function CameraUnit({
  position,
  active,
  label,
}: {
  position: [number, number, number]
  active: boolean
  label: string
}) {
  const lensRef = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    if (active && lensRef.current) {
      (lensRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.5 + 0.5 * Math.sin(clock.elapsedTime * 6)
    }
  })

  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 4, 8]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      {/* Camera body */}
      <mesh position={[0, 4.2, 0]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Lens */}
      <mesh ref={lensRef} position={[0, 4.2, 0.22]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 12]} />
        <meshStandardMaterial
          color={active ? '#00ff88' : '#333'}
          emissive={active ? '#00ff88' : '#000'}
          emissiveIntensity={active ? 0.5 : 0}
        />
      </mesh>
      {/* Solar panel */}
      <mesh position={[0, 5, 0]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[1, 0.04, 0.7]} />
        <meshStandardMaterial color="#1a237e" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Detection beam when active */}
      {active && (
        <mesh position={[0, 3.5, 0]} rotation={[Math.PI / 6, 0, 0]}>
          <coneGeometry args={[3, 6, 16, 1, true]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.07} side={THREE.DoubleSide} />
        </mesh>
      )}
      <group position={[0, 5.8, 0]}>
        <Label text={label} color={active ? '#00ff88' : '#aaa'} />
      </group>
    </group>
  )
}

// ─── Sensor station ───────────────────────────────────────────────────────────
function SensorUnit({ position, label }: { position: [number, number, number]; label: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 3, 8]} />
        <meshStandardMaterial color="#666" />
      </mesh>
      <mesh position={[0, 3.2, 0]} castShadow>
        <boxGeometry args={[0.4, 0.55, 0.28]} />
        <meshStandardMaterial color="#ff6600" />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 3.2, 0.15]}>
        <boxGeometry args={[0.28, 0.38, 0.02]} />
        <meshStandardMaterial color="#000" emissive="#00ff88" emissiveIntensity={0.4} />
      </mesh>
      {/* Soil probe */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.06, 0.04, 0.35, 8]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <group position={[0, 4.1, 0]}>
        <Label text={label} color="#ff9944" />
      </group>
    </group>
  )
}

// ─── Irrigation sprinkler ─────────────────────────────────────────────────────
function IrrigationUnit({
  position,
  active,
  label,
}: {
  position: [number, number, number]
  active: boolean
  label: string
}) {
  const waterRef = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    if (active && waterRef.current) {
      waterRef.current.rotation.y = clock.elapsedTime * 1.5
      ;(waterRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.25 + 0.15 * Math.sin(clock.elapsedTime * 4)
    }
  })

  return (
    <group position={position}>
      {/* Pipe */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 1.6, 8]} />
        <meshStandardMaterial color="#777" />
      </mesh>
      {/* Head */}
      <mesh castShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.45, 12]} />
        <meshStandardMaterial color="#2196f3" metalness={0.4} />
      </mesh>
      {/* Rotating water cone */}
      {active && (
        <mesh ref={waterRef} position={[0, -0.6, 0]}>
          <coneGeometry args={[1.8, 1.8, 16, 1, true]} />
          <meshBasicMaterial color="#7ec8f5" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}
      <group position={[0, 0.9, 0]}>
        <Label text={label} color={active ? '#7ec8f5' : '#668'} />
      </group>
    </group>
  )
}

// ─── Animated ELEPHANT ────────────────────────────────────────────────────────
function Elephant({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!)
  const legFL = useRef<THREE.Mesh>(null!)
  const legBR = useRef<THREE.Mesh>(null!)
  const legFR = useRef<THREE.Mesh>(null!)
  const legBL = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    // Walking motion
    ref.current.position.x = position[0] + Math.sin(t * 0.4) * 3
    ref.current.position.z = position[2] + Math.cos(t * 0.3) * 2
    ref.current.rotation.y = t * 0.3
    // Leg swing
    legFL.current.rotation.x = Math.sin(t * 2.5) * 0.35
    legBR.current.rotation.x = Math.sin(t * 2.5) * 0.35
    legFR.current.rotation.x = -Math.sin(t * 2.5) * 0.35
    legBL.current.rotation.x = -Math.sin(t * 2.5) * 0.35
  })

  const grey = '#808080'
  const dkGrey = '#606060'

  return (
    <group ref={ref} position={position}>
      {/* Body */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[1.3, 12, 10]} />
        <meshStandardMaterial color={grey} roughness={0.9} />
      </mesh>
      {/* Head */}
      <mesh position={[1.2, 1.9, 0]} castShadow>
        <sphereGeometry args={[0.75, 10, 8]} />
        <meshStandardMaterial color={grey} roughness={0.9} />
      </mesh>
      {/* Trunk */}
      <mesh position={[2.0, 1.4, 0]} rotation={[0, 0, -Math.PI / 3]} castShadow>
        <cylinderGeometry args={[0.18, 0.1, 1.4, 8]} />
        <meshStandardMaterial color={dkGrey} roughness={0.9} />
      </mesh>
      {/* Ear L */}
      <mesh position={[1.1, 2.1, 0.7]} rotation={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshStandardMaterial color={dkGrey} />
      </mesh>
      {/* Ear R */}
      <mesh position={[1.1, 2.1, -0.7]} rotation={[0, -0.3, 0]} castShadow>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshStandardMaterial color={dkGrey} />
      </mesh>
      {/* Tusk */}
      <mesh position={[1.8, 1.5, 0.25]} rotation={[0, 0, -Math.PI / 5]} castShadow>
        <cylinderGeometry args={[0.07, 0.02, 0.9, 6]} />
        <meshStandardMaterial color="#fff8e1" />
      </mesh>
      {/* Legs */}
      <mesh ref={legFL} position={[0.6, 0.4, 0.55]} castShadow>
        <cylinderGeometry args={[0.25, 0.2, 1.0, 8]} />
        <meshStandardMaterial color={grey} />
      </mesh>
      <mesh ref={legFR} position={[0.6, 0.4, -0.55]} castShadow>
        <cylinderGeometry args={[0.25, 0.2, 1.0, 8]} />
        <meshStandardMaterial color={grey} />
      </mesh>
      <mesh ref={legBL} position={[-0.6, 0.4, 0.55]} castShadow>
        <cylinderGeometry args={[0.25, 0.2, 1.0, 8]} />
        <meshStandardMaterial color={grey} />
      </mesh>
      <mesh ref={legBR} position={[-0.6, 0.4, -0.55]} castShadow>
        <cylinderGeometry args={[0.25, 0.2, 1.0, 8]} />
        <meshStandardMaterial color={grey} />
      </mesh>
      {/* Bounding box */}
      <mesh>
        <boxGeometry args={[3.2, 3.0, 1.8]} />
        <meshBasicMaterial color="#ff0000" wireframe transparent opacity={0.6} />
      </mesh>
      {/* Label */}
      <group position={[0, 3.4, 0]}>
        <Label text="🐘 ELEPHANT DETECTED" color="#ff4444" bg="rgba(180,0,0,0.75)" />
      </group>
    </group>
  )
}

// ─── Animated WILD BOAR ───────────────────────────────────────────────────────
function WildBoar({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    ref.current.position.x = position[0] + Math.sin(t * 0.9) * 4
    ref.current.position.z = position[2] + Math.cos(t * 0.7) * 3
    ref.current.rotation.y = t * 0.7
  })

  const brown = '#5c3317'
  const dk = '#3d2010'
  return (
    <group ref={ref} position={position}>
      {/* Body */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <sphereGeometry args={[0.9, 10, 8]} />
        <meshStandardMaterial color={brown} roughness={0.9} />
      </mesh>
      {/* Head */}
      <mesh position={[0.9, 0.75, 0]} castShadow>
        <sphereGeometry args={[0.5, 10, 8]} />
        <meshStandardMaterial color={dk} />
      </mesh>
      {/* Snout */}
      <mesh position={[1.35, 0.62, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.15, 0.35, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Tusks */}
      <mesh position={[1.4, 0.5, 0.14]} rotation={[0.2, 0, -0.5]} castShadow>
        <cylinderGeometry args={[0.04, 0.02, 0.55, 6]} />
        <meshStandardMaterial color="#fff8e1" />
      </mesh>
      <mesh position={[1.4, 0.5, -0.14]} rotation={[-0.2, 0, -0.5]} castShadow>
        <cylinderGeometry args={[0.04, 0.02, 0.55, 6]} />
        <meshStandardMaterial color="#fff8e1" />
      </mesh>
      {/* Legs */}
      {([[ 0.4, 0.2,  0.4], [-0.4, 0.2,  0.4], [ 0.4, 0.2, -0.4], [-0.4, 0.2, -0.4]] as [number,number,number][]).map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.55, 6]} />
          <meshStandardMaterial color={brown} />
        </mesh>
      ))}
      {/* Bounding box */}
      <mesh>
        <boxGeometry args={[2.0, 1.4, 1.2]} />
        <meshBasicMaterial color="#ff6600" wireframe transparent opacity={0.6} />
      </mesh>
      <group position={[0, 2.0, 0]}>
        <Label text="🐗 WILD BOAR DETECTED" color="#ff6600" bg="rgba(160,60,0,0.75)" />
      </group>
    </group>
  )
}

// ─── Animated BIRD FLOCK ──────────────────────────────────────────────────────
function BirdFlock({ position }: { position: [number, number, number] }) {
  const refs = useRef<(THREE.Group | null)[]>([])
  const count = 7
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    refs.current.forEach((bird, i) => {
      if (!bird) return
      const offset = i * 1.1
      bird.position.x = position[0] + Math.sin(t * 0.6 + offset) * 6
      bird.position.y = position[1] + 5 + Math.sin(t * 1.2 + offset) * 1.5
      bird.position.z = position[2] + Math.cos(t * 0.5 + offset) * 5
      bird.rotation.y = Math.sin(t + offset) * 0.4
    })
  })

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <group key={i} ref={el => { refs.current[i] = el }}>
          {/* Body */}
          <mesh castShadow>
            <sphereGeometry args={[0.2, 8, 6]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          {/* Wing L */}
          <mesh position={[0, 0, 0.35]} rotation={[0.2, 0, 0.4]}>
            <boxGeometry args={[0.55, 0.06, 0.28]} />
            <meshStandardMaterial color="#555" />
          </mesh>
          {/* Wing R */}
          <mesh position={[0, 0, -0.35]} rotation={[-0.2, 0, -0.4]}>
            <boxGeometry args={[0.55, 0.06, 0.28]} />
            <meshStandardMaterial color="#555" />
          </mesh>
          {i === 0 && (
            <group position={[0, 0.7, 0]}>
              <Label text="🦅 BIRD FLOCK" color="#ffd700" bg="rgba(120,90,0,0.75)" />
            </group>
          )}
        </group>
      ))}
    </>
  )
}

// ─── Animated FIRE ────────────────────────────────────────────────────────────
function FireEffect({ position }: { position: [number, number, number] }) {
  const f1 = useRef<THREE.Mesh>(null!)
  const f2 = useRef<THREE.Mesh>(null!)
  const f3 = useRef<THREE.Mesh>(null!)
  const smoke = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const s = 0.8 + 0.4 * Math.sin(t * 8)
    f1.current.scale.set(s, 0.9 + 0.3 * Math.sin(t * 7), s)
    f2.current.scale.set(0.7 + 0.3 * Math.sin(t * 9 + 1), 1, 0.7 + 0.3 * Math.sin(t * 6))
    f3.current.scale.set(0.5 + 0.3 * Math.sin(t * 10 + 2), 0.8 + 0.4 * Math.sin(t * 11), 0.5)
    smoke.current.position.y = 3.5 + Math.sin(t * 1.5) * 0.5
    smoke.current.scale.setScalar(1 + Math.sin(t * 2) * 0.2)
    ;(smoke.current.material as THREE.MeshBasicMaterial).opacity = 0.2 + 0.1 * Math.sin(t * 3)
  })

  return (
    <group position={position}>
      {/* Fire layers */}
      <mesh ref={f1} position={[0, 0.8, 0]}>
        <coneGeometry args={[1.2, 2.5, 8]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.85} />
      </mesh>
      <mesh ref={f2} position={[0, 1.2, 0]}>
        <coneGeometry args={[0.85, 2.2, 8]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0.8} />
      </mesh>
      <mesh ref={f3} position={[0, 1.6, 0]}>
        <coneGeometry args={[0.5, 1.8, 8]} />
        <meshBasicMaterial color="#ffdd00" transparent opacity={0.9} />
      </mesh>
      {/* Ember glow */}
      <pointLight position={[0, 1.5, 0]} color="#ff4400" intensity={3} distance={12} />
      {/* Smoke */}
      <mesh ref={smoke} position={[0, 3.5, 0]}>
        <sphereGeometry args={[1.2, 8, 6]} />
        <meshBasicMaterial color="#333" transparent opacity={0.25} />
      </mesh>
      {/* Bounding box */}
      <mesh>
        <boxGeometry args={[3.0, 4.0, 3.0]} />
        <meshBasicMaterial color="#ff0000" wireframe transparent opacity={0.5} />
      </mesh>
      <group position={[0, 4.5, 0]}>
        <Label text="🔥 FIRE DETECTED — EMERGENCY" color="#ff2200" bg="rgba(200,0,0,0.85)" />
      </group>
    </group>
  )
}

// ─── Animated DEER ────────────────────────────────────────────────────────────
function Deer({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    ref.current.position.x = position[0] + Math.sin(t * 0.7) * 5
    ref.current.position.z = position[2] + Math.cos(t * 0.6) * 4
    ref.current.rotation.y = t * 0.5
  })

  const tan = '#c8922a'
  const dk  = '#8b6220'

  return (
    <group ref={ref} position={position}>
      {/* Body */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <sphereGeometry args={[0.7, 10, 8]} />
        <meshStandardMaterial color={tan} />
      </mesh>
      {/* Neck */}
      <mesh position={[0.5, 1.5, 0]} rotation={[0, 0, -0.5]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.7, 8]} />
        <meshStandardMaterial color={tan} />
      </mesh>
      {/* Head */}
      <mesh position={[0.9, 1.9, 0]} castShadow>
        <sphereGeometry args={[0.32, 10, 8]} />
        <meshStandardMaterial color={dk} />
      </mesh>
      {/* Antlers */}
      {([-0.12, 0.12] as number[]).map((z, i) => (
        <group key={i} position={[0.9, 2.25, z]}>
          <mesh rotation={[0, 0, z > 0 ? 0.4 : -0.4]} castShadow>
            <cylinderGeometry args={[0.03, 0.02, 0.6, 5]} />
            <meshStandardMaterial color={dk} />
          </mesh>
        </group>
      ))}
      {/* Legs */}
      {([[ 0.35, 0.3,  0.32], [-0.35, 0.3,  0.32], [ 0.35, 0.3, -0.32], [-0.35, 0.3, -0.32]] as [number,number,number][]).map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.7, 6]} />
          <meshStandardMaterial color={tan} />
        </mesh>
      ))}
      {/* Bounding box */}
      <mesh>
        <boxGeometry args={[1.8, 2.2, 1.0]} />
        <meshBasicMaterial color="#ffaa00" wireframe transparent opacity={0.55} />
      </mesh>
      <group position={[0, 2.8, 0]}>
        <Label text="🦌 DEER DETECTED" color="#ffaa00" bg="rgba(140,80,0,0.75)" />
      </group>
    </group>
  )
}

// ─── Camera scan sweep ────────────────────────────────────────────────────────
function ScanSweep({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    if (active && ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 1.2
    }
  })
  if (!active) return null
  return (
    <mesh ref={ref} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0, 22, 64, 1, 0, Math.PI / 4]} />
      <meshBasicMaterial color="#00ff88" transparent opacity={0.08} side={THREE.DoubleSide} />
    </mesh>
  )
}

// ─── Rain particles ───────────────────────────────────────────────────────────
function Rain() {
  const count = 400
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 50
      arr[i * 3 + 1] = Math.random() * 20
      arr[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return arr
  }, [])
  const geomRef = useRef<THREE.BufferGeometry>(null!)
  useFrame(() => {
    const pos = geomRef.current.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= 0.25
      if (pos[i * 3 + 1] < 0) pos[i * 3 + 1] = 20
    }
    geomRef.current.attributes.position.needsUpdate = true
  })
  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#aaddff" size={0.12} transparent opacity={0.55} />
    </points>
  )
}

// ─── Drought heat shimmer sun ─────────────────────────────────────────────────
function DroughtSun() {
  const ref = useRef<THREE.PointLight>(null!)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.intensity = 4 + Math.sin(clock.elapsedTime * 2) * 1.5
    }
  })
  return <pointLight ref={ref} position={[0, 30, 0]} color="#ff9900" intensity={4} distance={80} />
}

// ─── Perimeter fence ─────────────────────────────────────────────────────────
function Fence() {
  const posts: React.ReactElement[] = []
  const side = 23
  const step = 4
  for (let x = -side; x <= side; x += step) {
    posts.push(
      <mesh key={`tn-${x}`} position={[x, 0.7, -side]} castShadow>
        <boxGeometry args={[0.15, 1.4, 0.15]} />
        <meshStandardMaterial color="#5c3d1e" />
      </mesh>,
      <mesh key={`ts-${x}`} position={[x, 0.7,  side]} castShadow>
        <boxGeometry args={[0.15, 1.4, 0.15]} />
        <meshStandardMaterial color="#5c3d1e" />
      </mesh>
    )
  }
  for (let z = -side; z <= side; z += step) {
    posts.push(
      <mesh key={`tw-${z}`} position={[-side, 0.7, z]} castShadow>
        <boxGeometry args={[0.15, 1.4, 0.15]} />
        <meshStandardMaterial color="#5c3d1e" />
      </mesh>,
      <mesh key={`te-${z}`} position={[ side, 0.7, z]} castShadow>
        <boxGeometry args={[0.15, 1.4, 0.15]} />
        <meshStandardMaterial color="#5c3d1e" />
      </mesh>
    )
  }
  return <>{posts}</>
}

// ─── Control room ─────────────────────────────────────────────────────────────
function ControlRoom() {
  return (
    <group position={[-20, 0, -20]}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#e8d5b0" roughness={0.8} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 3.2, 0]}>
        <coneGeometry args={[3, 1.2, 4]} />
        <meshStandardMaterial color="#b05020" />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.75, 2.01]}>
        <boxGeometry args={[0.8, 1.5, 0.05]} />
        <meshStandardMaterial color="#5c3d1e" />
      </mesh>
      {/* Antenna */}
      <mesh position={[1.5, 3.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2, 6]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <mesh position={[1.5, 4.5, 0]}>
        <sphereGeometry args={[0.1, 8, 6]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.8} />
      </mesh>
      <group position={[0, 4.5, 0]}>
        <Label text="🏠 Control Room" color="#ffcc77" bg="rgba(60,30,0,0.75)" />
      </group>
    </group>
  )
}

// ─── Water tank ───────────────────────────────────────────────────────────────
function WaterTank() {
  return (
    <group position={[20, 0, -20]}>
      {/* Tank */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[1.5, 1.5, 4, 16]} />
        <meshStandardMaterial color="#1565c0" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Legs */}
      {([[ 1.2, 0.8,  1.2], [-1.2, 0.8,  1.2], [ 1.2, 0.8, -1.2], [-1.2, 0.8, -1.2]] as [number,number,number][]).map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 1.6, 6]} />
          <meshStandardMaterial color="#555" />
        </mesh>
      ))}
      {/* Cap */}
      <mesh position={[0, 4.1, 0]}>
        <cylinderGeometry args={[1.55, 1.55, 0.2, 16]} />
        <meshStandardMaterial color="#0d47a1" />
      </mesh>
      <group position={[0, 5.2, 0]}>
        <Label text="💧 Water Tank" color="#7ec8f5" bg="rgba(0,30,80,0.75)" />
      </group>
    </group>
  )
}

// ─── NPK soil marker ──────────────────────────────────────────────────────────
function NPKMarker({ position, label }: { position: [number, number, number]; label: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.36, 8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshStandardMaterial color="#ff9900" emissive="#ff9900" emissiveIntensity={0.3} />
      </mesh>
      <group position={[0, 1.0, 0]}>
        <Label text={label} color="#ff9900" bg="rgba(80,30,0,0.7)" />
      </group>
    </group>
  )
}

// ─── Alert ring on ground at threat position ──────────────────────────────────
function AlertRing({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const s = 1 + (clock.elapsedTime % 1.5) * 2
    ref.current.scale.set(s, 1, s)
    ;(ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.5 - (clock.elapsedTime % 1.5) / 3)
  })
  return (
    <mesh ref={ref} position={[position[0], 0.05, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.5, 2, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  )
}

// ─── Deterrent speaker ───────────────────────────────────────────────────────
function Speaker({ position, active }: { position: [number, number, number]; active: boolean }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    if (active && ref.current) {
      const s = 1 + 0.12 * Math.sin(clock.elapsedTime * 12)
      ref.current.scale.set(s, s, s)
    }
  })
  return (
    <group position={position}>
      <mesh ref={ref} castShadow>
        <coneGeometry args={[0.3, 0.5, 8]} />
        <meshStandardMaterial color={active ? '#ff6600' : '#444'} emissive={active ? '#ff3300' : '#000'} emissiveIntensity={active ? 0.6 : 0} />
      </mesh>
      <group position={[0, 0.8, 0]}>
        <Label text={active ? '🔊 Deterrent ON' : '🔇 Speaker'} color={active ? '#ff6600' : '#888'} />
      </group>
    </group>
  )
}

// ─── MAIN SCENE ───────────────────────────────────────────────────────────────
export interface FarmScene3DProps {
  threat: any | null
  irrigationActive: boolean
  weather: string
}

export default function FarmScene3D({ threat, irrigationActive, weather }: FarmScene3DProps) {
  const threatPos: [number, number, number] = threat
    ? [
        ((parseFloat(threat.location?.x ?? '50') - 50) / 5),
        0,
        ((parseFloat(threat.location?.y ?? '50') - 50) / 5),
      ]
    : [0, 0, 0]

  const sunPos: [number, number, number] =
    weather === 'drought' || weather === 'heatwave'
      ? [20, 30, 20]
      : [100, 20, 100]

  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [35, 28, 35], fov: 55 }}>
        <Sky
          sunPosition={sunPos}
          turbidity={weather === 'flood' ? 12 : weather === 'drought' ? 3 : 6}
          rayleigh={weather === 'flood' ? 3 : 1}
        />

        {/* Lighting */}
        <ambientLight intensity={weather === 'drought' ? 0.9 : 0.5} color={weather === 'drought' ? '#ffe080' : '#ffffff'} />
        <directionalLight position={[50, 50, 25]} intensity={1.2} castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-35} shadow-camera-right={35}
          shadow-camera-top={35}  shadow-camera-bottom={-35}
          shadow-camera-far={120}
        />
        {weather === 'drought' && <DroughtSun />}

        <OrbitControls
          enablePan enableZoom enableRotate
          maxPolarAngle={Math.PI / 2.05}
          minDistance={8} maxDistance={90}
        />

        {/* Environment */}
        <Field weather={weather} />
        <CropRows weather={weather} />
        <Fence />
        <ControlRoom />
        <WaterTank />

        {/* NPK soil markers */}
        <NPKMarker position={[-8, 0, -8]} label="NPK Sensor A" />
        <NPKMarker position={[ 8, 0, -8]} label="NPK Sensor B" />
        <NPKMarker position={[-8, 0,  8]} label="NPK Sensor C" />
        <NPKMarker position={[ 8, 0,  8]} label="NPK Sensor D" />

        {/* Camera units */}
        <CameraUnit position={[-18, 0, -18]} active={!!threat} label="CAM-01 (ESP32)" />
        <CameraUnit position={[ 18, 0, -18]} active={!!threat} label="CAM-02 (ESP32)" />
        <CameraUnit position={[-18, 0,  18]} active={false}    label="CAM-03 (ESP32)" />
        <CameraUnit position={[ 18, 0,  18]} active={false}    label="CAM-04 (ESP32)" />

        {/* Sensor stations */}
        <SensorUnit position={[-10, 0, -10]} label="Sensor Node 1" />
        <SensorUnit position={[ 10, 0, -10]} label="Sensor Node 2" />
        <SensorUnit position={[-10, 0,  10]} label="Sensor Node 3" />
        <SensorUnit position={[ 10, 0,  10]} label="Sensor Node 4" />
        <SensorUnit position={[  0, 0,   0]} label="Central Node" />

        {/* Speakers */}
        <Speaker position={[-16, 0.5, 0]} active={!!threat && threat.type !== 'fire'} />
        <Speaker position={[ 16, 0.5, 0]} active={!!threat && threat.type !== 'fire'} />

        {/* Irrigation */}
        <IrrigationUnit position={[-6, 2, -6]} active={irrigationActive} label="Sprinkler 1" />
        <IrrigationUnit position={[ 6, 2, -6]} active={irrigationActive} label="Sprinkler 2" />
        <IrrigationUnit position={[-6, 2,  6]} active={irrigationActive} label="Sprinkler 3" />
        <IrrigationUnit position={[ 6, 2,  6]} active={irrigationActive} label="Sprinkler 4" />

        {/* Global scan sweep when threat active */}
        <ScanSweep active={!!threat} />

        {/* Alert ring at threat location */}
        {threat && (
          <AlertRing
            position={threatPos}
            color={threat.type === 'fire' ? '#ff0000' : threat.type === 'bird' ? '#ffd700' : '#ff6600'}
          />
        )}

        {/* Animated threat models */}
        {threat?.type === 'elephant'  && <Elephant  position={threatPos} />}
        {threat?.type === 'wild_boar' && <WildBoar  position={threatPos} />}
        {threat?.type === 'bird'      && <BirdFlock position={threatPos} />}
        {threat?.type === 'fire'      && <FireEffect position={threatPos} />}
        {threat?.type === 'deer'      && <Deer       position={threatPos} />}

        {/* Rain for flood/heavy-rain */}
        {(weather === 'flood') && <Rain />}

        {/* Field label */}
        <group position={[0, 0.1, -22]}>
          <Label text="🌾 Crop Field — 2.5 Acres" color="#88ff88" bg="rgba(0,60,0,0.7)" />
        </group>
      </Canvas>
    </div>
  )
}
