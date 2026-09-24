'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sky, Html } from '@react-three/drei'
import * as THREE from 'three'

// ─── safe floating label (never causes a re-render loop) ─────────────────────
function Label({
  text,
  color = '#ffffff',
  bg = 'rgba(0,0,0,0.65)',
  visible = true,
}: {
  text: string
  color?: string
  bg?: string
  visible?: boolean
}) {
  if (!visible) return null
  return (
    <Html center distanceFactor={20} zIndexRange={[0, 10]}>
      <div
        style={{
          background: bg,
          color,
          padding: '2px 8px',
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 700,
          whiteSpace: 'nowrap',
          border: `1px solid ${color}44`,
          pointerEvents: 'none',
          userSelect: 'none',
          lineHeight: 1.4,
        }}
      >
        {text}
      </div>
    </Html>
  )
}

// ─── Ground ───────────────────────────────────────────────────────────────────
function Field({ weather }: { weather: string }) {
  const color =
    weather === 'drought' ? '#7a5c2a' :
    weather === 'flood'   ? '#1a5c3a' :
    '#2d5016'
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
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
  const items = useMemo(() => {
    const out: [number, number][] = []
    for (let x = -18; x < 18; x += 2.5) {
      for (let z = -18; z < 18; z += 2.5) {
        out.push([x, z])
      }
    }
    return out
  }, [])
  return (
    <>
      {items.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.5, z]} castShadow>
          <coneGeometry args={[0.28, 1.1, 6]} />
          <meshStandardMaterial color={cropColor} roughness={0.8} />
        </mesh>
      ))}
    </>
  )
}

// ─── Fence posts ──────────────────────────────────────────────────────────────
function Fence() {
  const posts = useMemo(() => {
    const out: [number, number, number, boolean][] = []
    const side = 23
    const step = 4
    for (let x = -side; x <= side; x += step) {
      out.push([x, 0.7, -side, false], [x, 0.7, side, false])
    }
    for (let z = -side; z <= side; z += step) {
      out.push([-side, 0.7, z, true], [side, 0.7, z, true])
    }
    return out
  }, [])
  return (
    <>
      {posts.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.15, 1.4, 0.15]} />
          <meshStandardMaterial color="#5c3d1e" />
        </mesh>
      ))}
    </>
  )
}

// ─── Control room ─────────────────────────────────────────────────────────────
function ControlRoom() {
  return (
    <group position={[-20, 0, -20]}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#e8d5b0" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <coneGeometry args={[3, 1.2, 4]} />
        <meshStandardMaterial color="#b05020" />
      </mesh>
      <mesh position={[0, 0.75, 2.01]}>
        <boxGeometry args={[0.8, 1.5, 0.05]} />
        <meshStandardMaterial color="#5c3d1e" />
      </mesh>
      <mesh position={[1.5, 3.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2, 6]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <mesh position={[1.5, 4.5, 0]}>
        <sphereGeometry args={[0.1, 8, 6]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.8} />
      </mesh>
      <group position={[0, 4.8, 0]}>
        <Label text="🏠 Control Room" color="#ffcc77" bg="rgba(60,30,0,0.8)" />
      </group>
    </group>
  )
}

// ─── Water tank ───────────────────────────────────────────────────────────────
function WaterTank() {
  return (
    <group position={[20, 0, -20]}>
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[1.5, 1.5, 4, 16]} />
        <meshStandardMaterial color="#1565c0" metalness={0.6} roughness={0.3} />
      </mesh>
      {([[ 1.2, 0.8,  1.2], [-1.2, 0.8,  1.2], [ 1.2, 0.8, -1.2], [-1.2, 0.8, -1.2]] as [number,number,number][]).map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 1.6, 6]} />
          <meshStandardMaterial color="#555" />
        </mesh>
      ))}
      <mesh position={[0, 4.1, 0]}>
        <cylinderGeometry args={[1.55, 1.55, 0.2, 16]} />
        <meshStandardMaterial color="#0d47a1" />
      </mesh>
      <group position={[0, 5.4, 0]}>
        <Label text="💧 Water Tank" color="#7ec8f5" bg="rgba(0,30,80,0.8)" />
      </group>
    </group>
  )
}

// ─── Camera unit — lens flicker uses a ref, always mounted ───────────────────
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
  // always call useFrame; guard inside
  useFrame(({ clock }) => {
    if (!lensRef.current) return
    const mat = lensRef.current.material as THREE.MeshStandardMaterial
    if (active) {
      mat.emissiveIntensity = 0.4 + 0.4 * Math.sin(clock.elapsedTime * 7)
    } else {
      mat.emissiveIntensity = 0
    }
  })
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 4, 8]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, 4.2, 0]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* lens */}
      <mesh ref={lensRef} position={[0, 4.2, 0.22]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 12]} />
        <meshStandardMaterial
          color={active ? '#00ff88' : '#333'}
          emissive={active ? new THREE.Color('#00ff88') : new THREE.Color('#000000')}
          emissiveIntensity={active ? 0.4 : 0}
        />
      </mesh>
      {/* solar panel */}
      <mesh position={[0, 5, 0]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[1, 0.04, 0.7]} />
        <meshStandardMaterial color="#1a237e" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* detection cone — always rendered, opacity driven by active */}
      <mesh position={[0, 3.5, 0]} rotation={[Math.PI / 6, 0, 0]}>
        <coneGeometry args={[3, 6, 16, 1, true]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={active ? 0.07 : 0}
          side={THREE.DoubleSide}
        />
      </mesh>
      <group position={[0, 6.0, 0]}>
        <Label text={label} color={active ? '#00ff88' : '#aaaaaa'} />
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
      <mesh position={[0, 3.2, 0.15]}>
        <boxGeometry args={[0.28, 0.38, 0.02]} />
        <meshStandardMaterial color="#000" emissive="#00ff88" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.06, 0.04, 0.35, 8]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <group position={[0, 4.2, 0]}>
        <Label text={label} color="#ff9944" bg="rgba(80,30,0,0.75)" />
      </group>
    </group>
  )
}

// ─── Irrigation unit — water cone always mounted, opacity toggled ─────────────
function IrrigationUnit({
  position,
  active,
  label,
}: {
  position: [number, number, number]
  active: boolean
  label: string
}) {
  const coneRef = useRef<THREE.Mesh>(null!)
  // always called
  useFrame(({ clock }) => {
    if (!coneRef.current) return
    coneRef.current.rotation.y = clock.elapsedTime * 1.5
    const mat = coneRef.current.material as THREE.MeshBasicMaterial
    mat.opacity = active ? 0.22 + 0.12 * Math.sin(clock.elapsedTime * 5) : 0
  })
  return (
    <group position={position}>
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 1.6, 8]} />
        <meshStandardMaterial color="#777" />
      </mesh>
      <mesh castShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.45, 12]} />
        <meshStandardMaterial color="#2196f3" metalness={0.4} />
      </mesh>
      <mesh ref={coneRef} position={[0, -0.7, 0]}>
        <coneGeometry args={[1.8, 1.8, 16, 1, true]} />
        <meshBasicMaterial color="#7ec8f5" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
      <group position={[0, 1.1, 0]}>
        <Label text={label} color={active ? '#7ec8f5' : '#667788'} />
      </group>
    </group>
  )
}

// ─── NPK marker ───────────────────────────────────────────────────────────────
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
      <group position={[0, 1.1, 0]}>
        <Label text={label} color="#ff9900" bg="rgba(80,30,0,0.7)" />
      </group>
    </group>
  )
}

// ─── Deterrent speaker ────────────────────────────────────────────────────────
function Speaker({ position, active, label }: { position: [number, number, number]; active: boolean; label: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  // always called
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    if (active) {
      const s = 1 + 0.1 * Math.sin(clock.elapsedTime * 14)
      meshRef.current.scale.set(s, s, s)
    } else {
      meshRef.current.scale.set(1, 1, 1)
    }
  })
  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <coneGeometry args={[0.3, 0.5, 8]} />
        <meshStandardMaterial
          color={active ? '#ff6600' : '#444'}
          emissive={active ? new THREE.Color('#ff3300') : new THREE.Color('#000000')}
          emissiveIntensity={active ? 0.6 : 0}
        />
      </mesh>
      <group position={[0, 1.0, 0]}>
        <Label text={active ? '🔊 ' + label : '🔇 ' + label} color={active ? '#ff9900' : '#666'} />
      </group>
    </group>
  )
}

// ─── Scan sweep ring (always mounted, opacity via active) ─────────────────────
function ScanSweep({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 1.1
    ;(ref.current.material as THREE.MeshBasicMaterial).opacity = active ? 0.08 : 0
  })
  return (
    <mesh ref={ref} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0, 24, 64, 1, 0, Math.PI / 3.5]} />
      <meshBasicMaterial color="#00ff88" transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  )
}

// ─── Alert ring at threat location ───────────────────────────────────────────
function AlertRing({ position, color, visible }: { position: [number, number, number]; color: string; visible: boolean }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    if (!ref.current) return
    if (!visible) {
      ref.current.scale.set(1, 1, 1)
      ;(ref.current.material as THREE.MeshBasicMaterial).opacity = 0
      return
    }
    const t = clock.elapsedTime % 1.5
    const s = 1 + t * 2.5
    ref.current.scale.set(s, 1, s)
    ;(ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.55 - t / 2.5)
  })
  return (
    <mesh ref={ref} position={[position[0], 0.05, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.2, 2, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  )
}

// ─── Elephant — always mounted, visible prop drives opacity/position ──────────
function Elephant({ position, visible }: { position: [number, number, number]; visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null!)
  const legFL    = useRef<THREE.Mesh>(null!)
  const legFR    = useRef<THREE.Mesh>(null!)
  const legBL    = useRef<THREE.Mesh>(null!)
  const legBR    = useRef<THREE.Mesh>(null!)
  // always call useFrame
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    if (!visible) { groupRef.current.visible = false; return }
    groupRef.current.visible = true
    const t = clock.elapsedTime
    groupRef.current.position.set(
      position[0] + Math.sin(t * 0.4) * 3,
      0,
      position[2] + Math.cos(t * 0.3) * 2,
    )
    groupRef.current.rotation.y = t * 0.3
    if (legFL.current) legFL.current.rotation.x =  Math.sin(t * 2.5) * 0.35
    if (legBR.current) legBR.current.rotation.x =  Math.sin(t * 2.5) * 0.35
    if (legFR.current) legFR.current.rotation.x = -Math.sin(t * 2.5) * 0.35
    if (legBL.current) legBL.current.rotation.x = -Math.sin(t * 2.5) * 0.35
  })
  const g  = '#808080'
  const dk = '#606060'
  return (
    <group ref={groupRef} visible={visible}>
      {/* body */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[1.3, 10, 8]} />
        <meshStandardMaterial color={g} roughness={0.9} />
      </mesh>
      {/* head */}
      <mesh position={[1.2, 1.9, 0]} castShadow>
        <sphereGeometry args={[0.75, 10, 8]} />
        <meshStandardMaterial color={g} roughness={0.9} />
      </mesh>
      {/* trunk */}
      <mesh position={[2.0, 1.3, 0]} rotation={[0, 0, -Math.PI / 3]} castShadow>
        <cylinderGeometry args={[0.18, 0.1, 1.4, 8]} />
        <meshStandardMaterial color={dk} />
      </mesh>
      {/* ears */}
      <mesh position={[1.1, 2.1,  0.7]} castShadow>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshStandardMaterial color={dk} />
      </mesh>
      <mesh position={[1.1, 2.1, -0.7]} castShadow>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshStandardMaterial color={dk} />
      </mesh>
      {/* tusk */}
      <mesh position={[1.85, 1.45, 0.25]} rotation={[0, 0, -Math.PI / 5]} castShadow>
        <cylinderGeometry args={[0.07, 0.02, 0.9, 6]} />
        <meshStandardMaterial color="#fff8e1" />
      </mesh>
      {/* legs */}
      <mesh ref={legFL} position={[ 0.6, 0.45,  0.55]} castShadow>
        <cylinderGeometry args={[0.25, 0.2, 1.0, 8]} />
        <meshStandardMaterial color={g} />
      </mesh>
      <mesh ref={legFR} position={[ 0.6, 0.45, -0.55]} castShadow>
        <cylinderGeometry args={[0.25, 0.2, 1.0, 8]} />
        <meshStandardMaterial color={g} />
      </mesh>
      <mesh ref={legBL} position={[-0.6, 0.45,  0.55]} castShadow>
        <cylinderGeometry args={[0.25, 0.2, 1.0, 8]} />
        <meshStandardMaterial color={g} />
      </mesh>
      <mesh ref={legBR} position={[-0.6, 0.45, -0.55]} castShadow>
        <cylinderGeometry args={[0.25, 0.2, 1.0, 8]} />
        <meshStandardMaterial color={g} />
      </mesh>
      {/* bounding box */}
      <mesh>
        <boxGeometry args={[3.2, 3.0, 1.8]} />
        <meshBasicMaterial color="#ff0000" wireframe transparent opacity={0.55} />
      </mesh>
      <group position={[0, 3.6, 0]}>
        <Label text="🐘 ELEPHANT DETECTED" color="#ff4444" bg="rgba(160,0,0,0.8)" />
      </group>
    </group>
  )
}

// ─── Wild Boar ────────────────────────────────────────────────────────────────
function WildBoar({ position, visible }: { position: [number, number, number]; visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    if (!visible) { groupRef.current.visible = false; return }
    groupRef.current.visible = true
    const t = clock.elapsedTime
    groupRef.current.position.set(
      position[0] + Math.sin(t * 0.9) * 4,
      0,
      position[2] + Math.cos(t * 0.7) * 3,
    )
    groupRef.current.rotation.y = t * 0.7
  })
  const br = '#5c3317'
  const dk = '#3d2010'
  return (
    <group ref={groupRef} visible={visible}>
      <mesh position={[0, 0.65, 0]} castShadow>
        <sphereGeometry args={[0.9, 10, 8]} />
        <meshStandardMaterial color={br} roughness={0.9} />
      </mesh>
      <mesh position={[0.9, 0.75, 0]} castShadow>
        <sphereGeometry args={[0.5, 10, 8]} />
        <meshStandardMaterial color={dk} />
      </mesh>
      <mesh position={[1.35, 0.62, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.15, 0.35, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* tusks */}
      <mesh position={[1.4, 0.5,  0.14]} rotation={[0.2, 0, -0.5]} castShadow>
        <cylinderGeometry args={[0.04, 0.02, 0.55, 6]} />
        <meshStandardMaterial color="#fff8e1" />
      </mesh>
      <mesh position={[1.4, 0.5, -0.14]} rotation={[-0.2, 0, -0.5]} castShadow>
        <cylinderGeometry args={[0.04, 0.02, 0.55, 6]} />
        <meshStandardMaterial color="#fff8e1" />
      </mesh>
      {/* legs */}
      {([[ 0.4, 0.2,  0.4], [-0.4, 0.2,  0.4], [ 0.4, 0.2, -0.4], [-0.4, 0.2, -0.4]] as [number,number,number][]).map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.55, 6]} />
          <meshStandardMaterial color={br} />
        </mesh>
      ))}
      <mesh>
        <boxGeometry args={[2.0, 1.4, 1.2]} />
        <meshBasicMaterial color="#ff6600" wireframe transparent opacity={0.55} />
      </mesh>
      <group position={[0, 2.1, 0]}>
        <Label text="🐗 WILD BOAR DETECTED" color="#ff6600" bg="rgba(140,50,0,0.8)" />
      </group>
    </group>
  )
}

// ─── Bird flock — 6 birds, always mounted ─────────────────────────────────────
// Each bird component has its own useFrame — safe because always in tree
function SingleBird({ index, origin, visible }: { index: number; origin: [number,number,number]; visible: boolean }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    if (!ref.current) return
    if (!visible) { ref.current.visible = false; return }
    ref.current.visible = true
    const t  = clock.elapsedTime
    const o  = index * 1.05
    ref.current.position.set(
      origin[0] + Math.sin(t * 0.55 + o) * 7,
      origin[1] + 5 + Math.sin(t * 1.1 + o) * 1.2,
      origin[2] + Math.cos(t * 0.45 + o) * 6,
    )
    ref.current.rotation.y = Math.sin(t + o) * 0.5
  })
  return (
    <group ref={ref} visible={visible}>
      <mesh castShadow>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, 0, 0.35]} rotation={[0.2, 0, 0.4]}>
        <boxGeometry args={[0.55, 0.06, 0.28]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, 0, -0.35]} rotation={[-0.2, 0, -0.4]}>
        <boxGeometry args={[0.55, 0.06, 0.28]} />
        <meshStandardMaterial color="#555" />
      </mesh>
    </group>
  )
}

function BirdFlock({ position, visible }: { position: [number,number,number]; visible: boolean }) {
  const labelRef = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    if (!labelRef.current) return
    const t = clock.elapsedTime
    labelRef.current.position.set(
      position[0] + Math.sin(t * 0.55) * 7,
      position[1] + 7 + Math.sin(t * 1.1) * 1.2,
      position[2] + Math.cos(t * 0.45) * 6,
    )
    labelRef.current.visible = visible
  })
  return (
    <>
      {[0,1,2,3,4,5].map(i => (
        <SingleBird key={i} index={i} origin={position} visible={visible} />
      ))}
      <group ref={labelRef} visible={visible}>
        <Label text="🦅 BIRD FLOCK DETECTED" color="#ffd700" bg="rgba(100,70,0,0.8)" />
      </group>
    </>
  )
}

// ─── Fire — always mounted ────────────────────────────────────────────────────
function FireEffect({ position, visible }: { position: [number,number,number]; visible: boolean }) {
  const f1    = useRef<THREE.Mesh>(null!)
  const f2    = useRef<THREE.Mesh>(null!)
  const f3    = useRef<THREE.Mesh>(null!)
  const smoke = useRef<THREE.Mesh>(null!)
  const light = useRef<THREE.PointLight>(null!)
  useFrame(({ clock }) => {
    if (!f1.current) return
    const t = clock.elapsedTime
    const show = visible ? 1 : 0
    ;(f1.current.material as THREE.MeshBasicMaterial).opacity = show * (0.75 + 0.15 * Math.sin(t * 8))
    ;(f2.current.material as THREE.MeshBasicMaterial).opacity = show * (0.7  + 0.15 * Math.sin(t * 9 + 1))
    ;(f3.current.material as THREE.MeshBasicMaterial).opacity = show * (0.85 + 0.1  * Math.sin(t * 10 + 2))
    ;(smoke.current.material as THREE.MeshBasicMaterial).opacity = show * (0.18 + 0.07 * Math.sin(t * 3))
    f1.current.scale.set(0.8 + 0.25 * Math.sin(t * 8), 0.9 + 0.2 * Math.sin(t * 7), 0.8 + 0.25 * Math.sin(t * 6))
    smoke.current.position.y = position[1] + 3.5 + Math.sin(t * 1.5) * 0.4
    if (light.current) light.current.intensity = visible ? 3 + Math.sin(t * 6) * 1.5 : 0
  })
  return (
    <group position={position}>
      <mesh ref={f1} position={[0, 0.8, 0]}>
        <coneGeometry args={[1.2, 2.5, 8]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0} />
      </mesh>
      <mesh ref={f2} position={[0, 1.2, 0]}>
        <coneGeometry args={[0.85, 2.2, 8]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0} />
      </mesh>
      <mesh ref={f3} position={[0, 1.6, 0]}>
        <coneGeometry args={[0.5, 1.8, 8]} />
        <meshBasicMaterial color="#ffdd00" transparent opacity={0} />
      </mesh>
      <pointLight ref={light} position={[0, 1.5, 0]} color="#ff4400" intensity={0} distance={14} />
      <mesh ref={smoke} position={[0, 3.5, 0]}>
        <sphereGeometry args={[1.2, 8, 6]} />
        <meshBasicMaterial color="#333" transparent opacity={0} />
      </mesh>
      {/* bounding box always drawn but wireframe invisible when not active */}
      <mesh>
        <boxGeometry args={[3.0, 4.5, 3.0]} />
        <meshBasicMaterial color="#ff0000" wireframe transparent opacity={visible ? 0.45 : 0} />
      </mesh>
      <group position={[0, 5.0, 0]}>
        <Label text="🔥 FIRE — EMERGENCY" visible={visible} color="#ff2200" bg="rgba(180,0,0,0.85)" />
      </group>
    </group>
  )
}

// ─── Deer ─────────────────────────────────────────────────────────────────────
function Deer({ position, visible }: { position: [number,number,number]; visible: boolean }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    if (!ref.current) return
    if (!visible) { ref.current.visible = false; return }
    ref.current.visible = true
    const t = clock.elapsedTime
    ref.current.position.set(
      position[0] + Math.sin(t * 0.7) * 5,
      0,
      position[2] + Math.cos(t * 0.6) * 4,
    )
    ref.current.rotation.y = t * 0.5
  })
  const tan = '#c8922a'
  const dk  = '#8b6220'
  return (
    <group ref={ref} visible={visible}>
      <mesh position={[0, 1.0, 0]} castShadow>
        <sphereGeometry args={[0.7, 10, 8]} />
        <meshStandardMaterial color={tan} />
      </mesh>
      <mesh position={[0.5, 1.5, 0]} rotation={[0, 0, -0.5]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.7, 8]} />
        <meshStandardMaterial color={tan} />
      </mesh>
      <mesh position={[0.9, 1.9, 0]} castShadow>
        <sphereGeometry args={[0.32, 10, 8]} />
        <meshStandardMaterial color={dk} />
      </mesh>
      {/* antlers */}
      <mesh position={[0.9, 2.25,  0.12]} rotation={[0, 0,  0.4]} castShadow>
        <cylinderGeometry args={[0.03, 0.02, 0.6, 5]} />
        <meshStandardMaterial color={dk} />
      </mesh>
      <mesh position={[0.9, 2.25, -0.12]} rotation={[0, 0, -0.4]} castShadow>
        <cylinderGeometry args={[0.03, 0.02, 0.6, 5]} />
        <meshStandardMaterial color={dk} />
      </mesh>
      {/* legs */}
      {([[ 0.35, 0.3,  0.32], [-0.35, 0.3,  0.32], [ 0.35, 0.3, -0.32], [-0.35, 0.3, -0.32]] as [number,number,number][]).map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.7, 6]} />
          <meshStandardMaterial color={tan} />
        </mesh>
      ))}
      <mesh>
        <boxGeometry args={[1.8, 2.2, 1.0]} />
        <meshBasicMaterial color="#ffaa00" wireframe transparent opacity={0.5} />
      </mesh>
      <group position={[0, 3.0, 0]}>
        <Label text="🦌 DEER DETECTED" color="#ffaa00" bg="rgba(120,70,0,0.8)" />
      </group>
    </group>
  )
}

// ─── Rain particles — always mounted, opacity toggles ─────────────────────────
function Rain({ visible }: { visible: boolean }) {
  const count = 350
  const initialPositions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 55
      arr[i * 3 + 1] = Math.random() * 22
      arr[i * 3 + 2] = (Math.random() - 0.5) * 55
    }
    return arr
  }, [])
  const geomRef = useRef<THREE.BufferGeometry>(null!)
  useFrame(() => {
    if (!geomRef.current || !visible) return
    const pos = geomRef.current.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= 0.28
      if (pos[i * 3 + 1] < 0) pos[i * 3 + 1] = 22
    }
    geomRef.current.attributes.position.needsUpdate = true
  })
  return (
    <points visible={visible}>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[initialPositions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#aaddff" size={0.14} transparent opacity={0.55} />
    </points>
  )
}

// ─── Drought heat glow ────────────────────────────────────────────────────────
function DroughtGlow({ visible }: { visible: boolean }) {
  const ref = useRef<THREE.PointLight>(null!)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.intensity = visible ? 3 + Math.sin(clock.elapsedTime * 2) * 1.2 : 0
  })
  return <pointLight ref={ref} position={[0, 30, 0]} color="#ff9900" intensity={0} distance={90} />
}

// ─── Field annotation strip ───────────────────────────────────────────────────
function FieldLabel() {
  return (
    <group position={[0, 0.2, -22]}>
      <Label text="🌾 Crop Field — 2.5 Acres" color="#88ff88" bg="rgba(0,55,0,0.75)" />
    </group>
  )
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export interface FarmScene3DProps {
  threat: { type: string; confidence: string; location: { x: string; y: string }; timestamp: string } | null
  irrigationActive: boolean
  weather: string
}

export default function FarmScene3D({ threat, irrigationActive, weather }: FarmScene3DProps) {
  // compute a stable threat position
  const threatPos = useMemo<[number, number, number]>(() => {
    if (!threat) return [5, 0, 5]
    return [
      ((parseFloat(threat.location.x) - 50) / 5),
      0,
      ((parseFloat(threat.location.y) - 50) / 5),
    ]
  }, [threat?.location.x, threat?.location.y])  // eslint-disable-line react-hooks/exhaustive-deps

  const isElephant = threat?.type === 'elephant'
  const isBoar     = threat?.type === 'wild_boar'
  const isBird     = threat?.type === 'bird'
  const isFire     = threat?.type === 'fire'
  const isDeer     = threat?.type === 'deer'
  const anyThreat  = !!threat

  const alertColor =
    isFire     ? '#ff0000' :
    isBird     ? '#ffd700' :
    '#ff6600'

  const sunPos: [number, number, number] =
    weather === 'drought' || weather === 'heatwave' ? [20, 25, 20] : [100, 20, 100]

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        shadows
        camera={{ position: [35, 28, 35], fov: 55 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        }}
      >
        <Sky
          sunPosition={sunPos}
          turbidity={weather === 'flood' ? 14 : weather === 'drought' ? 3 : 6}
          rayleigh={weather === 'flood' ? 3 : 1}
        />

        <ambientLight
          intensity={weather === 'drought' || weather === 'heatwave' ? 0.85 : 0.5}
          color={weather === 'drought' || weather === 'heatwave' ? '#ffe090' : '#ffffff'}
        />
        <directionalLight
          position={[50, 50, 25]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-35}
          shadow-camera-right={35}
          shadow-camera-top={35}
          shadow-camera-bottom={-35}
          shadow-camera-far={120}
        />

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          maxPolarAngle={Math.PI / 2.05}
          minDistance={8}
          maxDistance={90}
          makeDefault
        />

        {/* ── Static environment ── */}
        <Field weather={weather} />
        <CropRows weather={weather} />
        <Fence />
        <ControlRoom />
        <WaterTank />
        <FieldLabel />

        {/* ── NPK markers ── */}
        <NPKMarker position={[-8, 0, -8]} label="NPK Sensor A" />
        <NPKMarker position={[ 8, 0, -8]} label="NPK Sensor B" />
        <NPKMarker position={[-8, 0,  8]} label="NPK Sensor C" />
        <NPKMarker position={[ 8, 0,  8]} label="NPK Sensor D" />

        {/* ── Camera units ── */}
        <CameraUnit position={[-18, 0, -18]} active={anyThreat} label="CAM-01 (ESP32)" />
        <CameraUnit position={[ 18, 0, -18]} active={anyThreat} label="CAM-02 (ESP32)" />
        <CameraUnit position={[-18, 0,  18]} active={false}     label="CAM-03 (ESP32)" />
        <CameraUnit position={[ 18, 0,  18]} active={false}     label="CAM-04 (ESP32)" />

        {/* ── Sensor stations ── */}
        <SensorUnit position={[-10, 0, -10]} label="Sensor Node 1" />
        <SensorUnit position={[ 10, 0, -10]} label="Sensor Node 2" />
        <SensorUnit position={[-10, 0,  10]} label="Sensor Node 3" />
        <SensorUnit position={[ 10, 0,  10]} label="Sensor Node 4" />
        <SensorUnit position={[  0, 0,   0]} label="Central Node" />

        {/* ── Speakers ── */}
        <Speaker position={[-17, 0.5, 0]}  active={anyThreat && !isFire} label="Deterrent L" />
        <Speaker position={[ 17, 0.5, 0]}  active={anyThreat && !isFire} label="Deterrent R" />

        {/* ── Irrigation ── */}
        <IrrigationUnit position={[-6, 2, -6]} active={irrigationActive} label="Sprinkler 1" />
        <IrrigationUnit position={[ 6, 2, -6]} active={irrigationActive} label="Sprinkler 2" />
        <IrrigationUnit position={[-6, 2,  6]} active={irrigationActive} label="Sprinkler 3" />
        <IrrigationUnit position={[ 6, 2,  6]} active={irrigationActive} label="Sprinkler 4" />

        {/* ── Always-mounted effects ── */}
        <ScanSweep active={anyThreat} />
        <AlertRing position={threatPos} color={alertColor} visible={anyThreat} />
        <Rain visible={weather === 'flood'} />
        <DroughtGlow visible={weather === 'drought' || weather === 'heatwave'} />

        {/* ── Always-mounted threat models (visibility toggled inside) ── */}
        <Elephant  position={threatPos} visible={isElephant} />
        <WildBoar  position={threatPos} visible={isBoar} />
        <BirdFlock position={threatPos} visible={isBird} />
        <FireEffect position={threatPos} visible={isFire} />
        <Deer      position={threatPos} visible={isDeer} />
      </Canvas>
    </div>
  )
}
