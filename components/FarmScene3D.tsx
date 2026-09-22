'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Sky } from '@react-three/drei'
import { useRef, useState } from 'react'
import * as THREE from 'three'

function Field() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[50, 50, 20, 20]} />
      <meshStandardMaterial 
        color="#2d5016" 
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  )
}

function CropRows() {
  const crops = []
  for (let x = -20; x < 20; x += 2) {
    for (let z = -20; z < 20; z += 2) {
      crops.push(
        <mesh key={`${x}-${z}`} position={[x, 0.5, z]} castShadow>
          <coneGeometry args={[0.3, 1, 8]} />
          <meshStandardMaterial color="#4a7c22" />
        </mesh>
      )
    }
  }
  return <>{crops}</>
}

function CameraUnit({ position, active }: { position: [number, number, number], active: boolean }) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 4]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      
      {/* Camera head */}
      <mesh position={[0, 4.3, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.4]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      
      {/* Camera lens */}
      <mesh position={[0, 4.3, 0.25]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.1]} />
        <meshStandardMaterial 
          color={active ? "#00ff00" : "#333333"} 
          emissive={active ? "#00ff00" : "#000000"}
          emissiveIntensity={active ? 0.5 : 0}
        />
      </mesh>
      
      {/* Solar panel */}
      <mesh position={[0, 5, 0]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[1, 0.05, 0.7]} />
        <meshStandardMaterial color="#1a237e" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

function SensorUnit({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      
      {/* Control box */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.3]} />
        <meshStandardMaterial color="#ff6600" />
      </mesh>
      
      {/* Display panel */}
      <mesh position={[0, 3.2, 0.16]} castShadow>
        <boxGeometry args={[0.3, 0.4, 0.02]} />
        <meshStandardMaterial color="#000000" emissive="#00ff00" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Sensors */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.3]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
    </group>
  )
}

function IrrigationUnit({ position, active }: { position: [number, number, number], active: boolean }) {
  return (
    <group position={position}>
      {/* Sprinkler head */}
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.15, 0.5]} />
        <meshStandardMaterial color="#2196f3" />
      </mesh>
      
      {/* Water effect when active */}
      {active && (
        <mesh position={[0, -0.5, 0]}>
          <coneGeometry args={[0.8, 1.5, 8]} />
          <meshStandardMaterial 
            color="#4dd0e1" 
            transparent 
            opacity={0.3}
            emissive="#4dd0e1"
            emissiveIntensity={0.2}
          />
        </mesh>
      )}
    </group>
  )
}

function ThreatIndicator({ position, type }: { position: [number, number, number], type: string }) {
  const color = type === 'fire' ? '#ff0000' : '#ffeb3b'
  
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Pulsing ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.8, 32]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default function FarmScene3D({ 
  threat, 
  irrigationActive 
}: { 
  threat: any | null
  irrigationActive: boolean 
}) {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[30, 25, 30]} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={10}
          maxDistance={80}
        />
        
        <Sky sunPosition={[100, 20, 100]} />
        <Environment preset="sunset" />
        
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[50, 50, 25]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={100}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />
        
        <Field />
        <CropRows />
        
        {/* Camera units */}
        <CameraUnit position={[-15, 0, -15]} active={!!threat} />
        <CameraUnit position={[15, 0, -15]} active={false} />
        <CameraUnit position={[-15, 0, 15]} active={false} />
        <CameraUnit position={[15, 0, 15]} active={false} />
        
        {/* Sensor units */}
        <SensorUnit position={[-10, 0, -10]} />
        <SensorUnit position={[10, 0, -10]} />
        <SensorUnit position={[-10, 0, 10]} />
        <SensorUnit position={[10, 0, 10]} />
        <SensorUnit position={[0, 0, 0]} />
        
        {/* Irrigation units */}
        <IrrigationUnit position={[-5, 2, -5]} active={irrigationActive} />
        <IrrigationUnit position={[5, 2, -5]} active={irrigationActive} />
        <IrrigationUnit position={[-5, 2, 5]} active={irrigationActive} />
        <IrrigationUnit position={[5, 2, 5]} active={irrigationActive} />
        
        {/* Threat indicator */}
        {threat && (
          <ThreatIndicator 
            position={[
              (parseFloat(threat.location.x) - 50) / 2,
              3,
              (parseFloat(threat.location.y) - 50) / 2
            ]} 
            type={threat.type} 
          />
        )}
      </Canvas>
    </div>
  )
}
