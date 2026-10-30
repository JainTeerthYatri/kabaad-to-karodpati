"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Html, ContactShadows, Stage } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { Vehicle } from "./Vehicle";
import { ScrapKanta } from "./ScrapKanta";
import { Sky } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

// Camera rig with mobile touch support
function CameraRig() {
  const { camera } = useThree();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useFrame(({ mouse, gl }) => {
    if (isMobile) return; // Mobile uses touch controls via Html overlay

    // Smooth camera follow
    camera.position.lerp(new THREE.Vector3(0, 3, 8), 0.05);
    camera.lookAt(0, 1, 0);
  });

  return null;
}

// Garage floor with grid
function GarageFloor() {
  return (
    <group>
      {/* Main floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        position={[0, -0.01, 0]}
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#2a2a2a"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Grid lines */}
      <group>
        {Array.from({ length: 31 }, (_, i) => i - 15).map((pos) => (
          <mesh
            key={`grid-x-${pos}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[pos, 0.001, 0]}
            scale={[0.02, 30, 1]}
          >
            <planeGeometry />
            <meshBasicMaterial color="#3a3a3a" transparent opacity={0.5} />
          </mesh>
        ))}
        {Array.from({ length: 31 }, (_, i) => i - 15).map((pos) => (
          <mesh
            key={`grid-z-${pos}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.001, pos]}
            scale={[30, 0.02, 1]}
          >
            <planeGeometry />
            <meshBasicMaterial color="#3a3a3a" transparent opacity={0.5} />
          </mesh>
        ))}
      </group>

      {/* Parking spots markings */}
      {[-6, 0, 6].map((x) => (
        <mesh
          key={`spot-${x}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[x, 0.002, -3]}
          scale={[4, 8, 1]}
        >
          <planeGeometry />
          <meshBasicMaterial color="#kabaad-500" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// Garage walls and structure
function GarageStructure() {
  return (
    <group>
      {/* Back wall */}
      <mesh
        position={[0, 2.5, -14]}
        scale={[28, 5, 0.2]}
        receiveShadow
        castShadow
      >
        <boxGeometry />
        <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
      </mesh>

      {/* Side walls */}
      {[-14, 14].map((x) => (
        <mesh
          key={`wall-${x}`}
          position={[x, 2.5, 0]}
          scale={[0.2, 5, 28]}
          receiveShadow
          castShadow
        >
          <boxGeometry />
          <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
        </mesh>
      ))}

      {/* Roof beams */}
      {Array.from({ length: 5 }, (_, i) => i - 2).map((z) => (
        <mesh
          key={`beam-${z}`}
          position={[0, 4.9, z * 7]}
          scale={[28, 0.3, 0.3]}
          castShadow
        >
          <boxGeometry />
          <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.3} />
        </mesh>
      ))}

      {/* Workbench */}
      <mesh
        position={[-10, 1, -10]}
        scale={[4, 1.8, 1.5]}
        castShadow
        receiveShadow
      >
        <boxGeometry />
        <meshStandardMaterial color="#4a4a4a" roughness={0.7} />
      </mesh>

      {/* Tool cabinet */}
      <mesh
        position={[10, 1.5, -10]}
        scale={[2, 3, 1]}
        castShadow
        receiveShadow
      >
        <boxGeometry />
        <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Lighting system with day/night/monsoon presets
function LightingSystem({ timeOfDay, weather }: { timeOfDay: number; weather: "CLEAR" | "MONSOON" | "OVERCAST" }) {
  const { scene } = useThree();

  useEffect(() => {
    // Sky setup
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);

    const sun = new THREE.Vector3();
    const pmremGenerator = new THREE.PMREMGenerator(useThree().gl);

    const updateSky = () => {
      const phi = THREE.MathUtils.degToRad(90 - timeOfDay * 180); // 0-1 day cycle
      const theta = THREE.MathUtils.degToRad(180);

      sun.setFromSphericalCoords(1, phi, theta);

      const uniforms = sky.material.uniforms;
      uniforms["sunPosition"].value.copy(sun);
      uniforms["turbidity"].value = weather === "MONSOON" ? 10 : weather === "OVERCAST" ? 5 : 2;
      uniforms["rayleigh"].value = weather === "MONSOON" ? 3 : 1;
      uniforms["mieCoefficient"].value = weather === "MONSOON" ? 0.005 : 0.001;
      uniforms["mieDirectionalG"].value = 0.8;

      const renderTarget = pmremGenerator.fromScene(sky);
      scene.environment = renderTarget.texture;
    };

    updateSky();

    // Update every frame
    const animate = () => {
      updateSky();
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      scene.remove(sky);
      pmremGenerator.dispose();
    };
  }, [scene, timeOfDay, weather]);

  // Main directional light (sun)
  const sunIntensity = weather === "MONSOON" ? 0.3 : weather === "OVERCAST" ? 0.6 : 1;
  const sunColor = timeOfDay < 0.2 || timeOfDay > 0.8 ? 0xffaa66 : 0xffffff;

  return (
    <>
      <directionalLight
        position={[100, 100, 50]}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.0001}
      />
      {/* Fill lights */}
      <hemisphereLight intensity={weather === "MONSOON" ? 0.4 : 0.6} groundColor="#2a2a2a" skyColor="#87ceeb" />
      {/* Ambient */}
      <ambientLight intensity={weather === "MONSOON" ? 0.3 : 0.4} color="#ffffff" />
    </>
  );
}

// Particle system for monsoon rain
function RainParticles({ active }: { active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { scene } = useThree();

  useEffect(() => {
    if (!active) return;

    const count = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 30 + 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      velocities[i * 3] = (Math.random() - 0.5) * 0.5;
      velocities[i * 3 + 1] = -10 - Math.random() * 10;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    pointsRef.current = points;
    scene.add(points);

    return () => {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
    };
  }, [scene, active]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !active) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = pointsRef.current.geometry.attributes.velocity.array as Float32Array;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i] * delta;
      positions[i + 1] += velocities[i + 1] * delta;
      positions[i + 2] += velocities[i + 2] * delta;

      // Reset when hits ground
      if (positions[i + 1] < 0) {
        positions[i] = (Math.random() - 0.5) * 60;
        positions[i + 1] = 30 + Math.random() * 10;
        positions[i + 2] = (Math.random() - 0.5) * 60;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return null;
}

// Main Garage Scene Component
export function GarageScene() {
  const { gameState } = useGameStore();
  const [timeOfDay, setTimeOfDay] = useState(0.5); // 0-1
  const [weather, setWeather] = useState<"CLEAR" | "MONSOON" | "OVERCAST">("CLEAR");

  // Update weather based on active events
  useEffect(() => {
    if (gameState.activeEvents.includes("MONSOON")) {
      setWeather("MONSOON");
    } else if (gameState.activeEvents.includes("HIGHWAY_STRIKE")) {
      setWeather("OVERCAST");
    } else {
      setWeather("CLEAR");
    }
  }, [gameState.activeEvents]);

  // Day/night cycle (10 min = 1 game day)
  useFrame((_, delta) => {
    setTimeOfDay((prev) => (prev + delta / 600) % 1); // 600 seconds = 10 min
  });

  return (
    <div id="three-canvas" className="w-full h-full">
      <Canvas
        camera={{ position: [0, 3, 8], fov: 60 }}
        shadows
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        style={{ touchAction: "none" }}
      >
        <fog attach="fog" args={weather === "MONSOON" ? ["#4a4a5a", 5, 50] : weather === "OVERCAST" ? ["#6a6a7a", 10, 80] : ["#87ceeb", 20, 100]} />

        <LightingSystem timeOfDay={timeOfDay} weather={weather} />
        <RainParticles active={weather === "MONSOON"} />

        <GarageFloor />
        <GarageStructure />
        <ScrapKanta position={[0, 0, 8]} />
        <Vehicle vehicleId="marutam_800" position={[-4, 0, 0]} />
        <Vehicle vehicleId="balwan_chetak" position={[4, 0.5, -2]} rotation={[0, Math.PI / 4, 0]} />

        <CameraRig />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2 - 0.1}
          minDistance={3}
          maxDistance={20}
          target={[0, 1, 0]}
        />

        <Html
          transform
          position={[0, 2.5, -4]}
          style={{ pointerEvents: "none" }}
          occlude
        >
          <div className="text-center text-white text-sm font-mono bg-black/50 px-2 py-1 rounded">
            GARAGE BAY 1
          </div>
        </Html>
      </Canvas>
    </div>
  );
}

// Hook import
import { useGameStore } from "@/store/gameStore";