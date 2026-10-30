"use client";

import { useGLTF, useAnimations } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { Mesh, Group, Box3, Vector3 } from "three";
import { Html } from "@react-three/drei";
import { useGameStore } from "@/store/gameStore";

interface VehicleProps {
  vehicleId: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onSelect?: (id: string) => void;
}

export function Vehicle({ vehicleId, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, onSelect }: VehicleProps) {
  const { gameState } = useGameStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const groupRef = useRef<Group>(null);
  const vehicleSpec = gameState.vehicles.find((v) => v.specId === vehicleId) || null;

  // Load GLTF model - in production, these would be in public/models/
  // For now, we create a procedural vehicle
  const vehicleModel = createProceduralVehicle(vehicleId);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Interaction: raycast detection for click/tap
  const handlePointerOver = () => setShowLabel(true);
  const handlePointerOut = () => setShowLabel(false);
  const handleClick = () => onSelect?.(vehicleId);

  if (!isLoaded) return null;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {vehicleModel}

      {/* Selection highlight */}
      {showLabel && (
        <Html
          transform
          position={[0, 3, 0]}
          style={{ pointerEvents: "none", zIndex: 10 }}
        >
          <div className="bg-kabaad-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg whitespace-nowrap">
            {vehicleSpec ? `${vehicleSpec.specId} • ${vehicleSpec.healthPercent}%` : vehicleId}
          </div>
        </Html>
      )}

      {/* Interaction hint */}
      {showLabel && (
        <Html
          transform
          position={[0, 3.5, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
            Click to inspect
          </div>
        </Html>
      )}
    </group>
  );
}

// Procedural vehicle generator (replace with GLTF in production)
function createProceduralVehicle(vehicleId: string) {
  const specs: Record<string, { bodyColor: number; width: number; length: number; height: number; wheels: number }> = {
    marutam_800: { bodyColor: 0x3a7bd5, width: 1.5, length: 3.2, height: 1.4, wheels: 4 },
    balwan_chetak: { bodyColor: 0xd53a3a, width: 0.7, length: 1.8, height: 1.1, wheels: 2 },
    rajput_thumper: { bodyColor: 0x1a1a1a, width: 0.8, length: 2.1, height: 1.2, wheels: 2 },
    tarang_450x: { bodyColor: 0x00d4aa, width: 0.7, length: 1.9, height: 1.1, wheels: 2 },
    balwan_super_auto: { bodyColor: 0xf5a623, width: 1.4, length: 2.8, height: 1.8, wheels: 3 },
    bijli_erickshaw: { bodyColor: 0x7ed321, width: 1, length: 2.5, height: 1.7, wheels: 3 },
    tatva_indica: { bodyColor: 0xffffff, width: 1.6, length: 4, height: 1.5, wheels: 4 },
    hd_cityracer: { bodyColor: 0x0a0a0a, width: 1.8, length: 4.5, height: 1.4, wheels: 4 },
    mahabal_bolermax: { bodyColor: 0xffffff, width: 1.7, length: 4.2, height: 1.9, wheels: 4 },
    mahabal_tharox: { bodyColor: 0x2d5a2d, width: 1.8, length: 4, height: 1.9, wheels: 4 },
    tatva_safariya: { bodyColor: 0x0a0a0a, width: 1.9, length: 4.6, height: 1.8, wheels: 4 },
    tatva_chhota_hathi: { bodyColor: 0xf5a623, width: 1.8, length: 3.5, height: 2.2, wheels: 4 },
    lakshya_1612: { bodyColor: 0x8b4513, width: 2.5, length: 10, height: 3.5, wheels: 10 },
    jld_pila_panja: { bodyColor: 0xffff00, width: 3, length: 6, height: 3.5, wheels: 4 }, // tracks simplified
  };

  const spec = specs[vehicleId] || specs.marutam_800;
  const { bodyColor, width, length, height, wheels } = spec;

  return (
    <group>
      {/* Chassis */}
      <Mesh
        geometry={new Box3(new Vector3(-width / 2, 0.1, -length / 2), new Vector3(width / 2, 0.3, length / 2)).getSize(new Vector3())}
        material={new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0.3 })}
        castShadow
        receiveShadow
      />

      {/* Body */}
      <Mesh
        geometry={new Box3(new Vector3(-width / 2, 0.3, -length / 2), new Vector3(width / 2, 0.3 + height * 0.6, length / 2)).getSize(new Vector3())}
        material={new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.4, metalness: 0.6, clearcoat: 0.5, clearcoatRoughness: 0.1 })}
        castShadow
        receiveShadow
      />

      {/* Roof */}
      <Mesh
        geometry={new Box3(new Vector3(-width / 2 * 0.9, 0.3 + height * 0.6, -length / 2 * 0.8), new Vector3(width / 2 * 0.9, 0.3 + height, length / 2 * 0.8)).getSize(new Vector3())}
        material={new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.3, metalness: 0.7, clearcoat: 0.8 })}
        castShadow
      />

      {/* Windows */}
      <Mesh
        geometry={new Box3(new Vector3(-width / 2 * 0.85, 0.3 + height * 0.4, -length / 2 * 0.75), new Vector3(width / 2 * 0.85, 0.3 + height * 0.6, length / 2 * 0.75)).getSize(new Vector3())}
        material={new THREE.MeshStandardMaterial({ color: 0x1a2a3a, roughness: 0.1, metalness: 0.9, transmission: 0.8, transparent: true, opacity: 0.3 })}
        castShadow
      />

      {/* Wheels */}
      {Array.from({ length: wheels }, (_, i) => {
        const wheelPositions: Record<number, [number, number][]> = {
          2: [[-width / 2 - 0.1, -length / 2 + 0.3], [width / 2 + 0.1, -length / 2 + 0.3]],
          3: [[-width / 2 - 0.1, -length / 2 + 0.3], [width / 2 + 0.1, -length / 2 + 0.3], [0, length / 2 - 0.3]],
          4: [
            [-width / 2 - 0.1, -length / 2 + 0.4],
            [width / 2 + 0.1, -length / 2 + 0.4],
            [-width / 2 - 0.1, length / 2 - 0.4],
            [width / 2 + 0.1, length / 2 - 0.4],
          ],
          10: [
            [-width / 2 - 0.1, -length / 2 + 0.5],
            [width / 2 + 0.1, -length / 2 + 0.5],
            [-width / 2 - 0.1, -length / 2 + 2.5],
            [width / 2 + 0.1, -length / 2 + 2.5],
            [-width / 2 - 0.1, -length / 2 + 4.5],
            [width / 2 + 0.1, -length / 2 + 4.5],
            [-width / 2 - 0.1, -length / 2 + 6.5],
            [width / 2 + 0.1, -length / 2 + 6.5],
            [-width / 2 - 0.1, length / 2 - 0.5],
            [width / 2 + 0.1, length / 2 - 0.5],
          ],
        };
        const pos = wheelPositions[wheels]?.[i] || [0, 0];
        return (
          <Mesh
            key={`wheel-${i}`}
            position={[pos[0], 0.3, pos[1]]}
            rotation={[Math.PI / 2, 0, 0]}
            geometry={new THREE.CylinderGeometry(0.35, 0.35, 0.2, 16)}
            material={new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 })}
            castShadow
            receiveShadow
          />
        );
      })}

      {/* Headlights */}
      <Mesh
        position={[-width / 2 * 0.4, 0.6, -length / 2 - 0.05]}
        geometry={new THREE.SphereGeometry(0.1, 8, 8)}
        material={new THREE.MeshBasicMaterial({ color: 0xffffee })}
      />
      <Mesh
        position={[width / 2 * 0.4, 0.6, -length / 2 - 0.05]}
        geometry={new THREE.SphereGeometry(0.1, 8, 8)}
        material={new THREE.MeshBasicMaterial({ color: 0xffffee })}
      />

      {/* Taillights */}
      <Mesh
        position={[-width / 2 * 0.4, 0.6, length / 2 + 0.05]}
        geometry={new THREE.SphereGeometry(0.08, 8, 8)}
        material={new THREE.MeshBasicMaterial({ color: 0xff0000 })}
      />
      <Mesh
        position={[width / 2 * 0.4, 0.6, length / 2 + 0.05]}
        geometry={new THREE.SphereGeometry(0.08, 8, 8)}
        material={new THREE.MeshBasicMaterial({ color: 0xff0000 })}
      />
    </group>
  );
}

// Import THREE for procedural geometry
import * as THREE from "three";