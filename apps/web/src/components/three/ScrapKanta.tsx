"use client";

import { useFrame, useRef } from "@react-three/fiber";
import { Mesh, Group, BoxGeometry, CylinderGeometry, MeshStandardMaterial, Vector3 } from "three";
import { Html } from "@react-three/drei";
import { useGameStore } from "@/store/gameStore";
import { useState } from "react";

interface ScrapKantaProps {
  position?: [number, number, number];
}

export function ScrapKanta({ position = [0, 0, 0] }: ScrapKantaProps) {
  const { gameState, addCash, addTransaction, inventory } = useGameStore();
  const [isWeighing, setIsWeighing] = useState(false);
  const [weight, setWeight] = useState(0);
  const [price, setPrice] = useState(0);
  const platformRef = useRef<Mesh>(null);
  const needleRef = useRef<Mesh>(null);
  const [currentMaterial, setCurrentMaterial] = useState<keyof typeof gameState.inventory.scrap | "MIXED">("MIXED");

  const lohaRate = gameState.scrapRates.find((r) => r.material === "LOHA")?.currentRate || 38;
  const taambaRate = gameState.scrapRates.find((r) => r.material === "TAAMBA")?.currentRate || 620;

  const totalScrapKg = Object.values(inventory.scrap).reduce((a, b) => a + b, 0);

  // Animate needle when weighing
  useFrame(() => {
    if (needleRef.current && isWeighing) {
      const targetRotation = -Math.PI / 2 + (weight / 5000) * Math.PI; // Max 5000kg
      needleRef.current.rotation.z = THREE.MathUtils.lerp(needleRef.current.rotation.z, targetRotation, 0.1);
    }
  });

  const handleWeigh = () => {
    if (totalScrapKg === 0) return;
    setIsWeighing(true);
    setWeight(totalScrapKg);

    // Calculate mixed rate based on composition
    let totalValue = 0;
    let totalKg = 0;
    Object.entries(inventory.scrap).forEach(([mat, kg]) => {
      const rate = gameState.scrapRates.find((r) => r.material === mat)?.currentRate || 10;
      totalValue += kg * rate;
      totalKg += kg;
    });
    const avgRate = totalKg > 0 ? totalValue / totalKg : lohaRate;
    setPrice(Math.round(totalValue));

    // Simulate weighing animation
    let w = 0;
    const interval = setInterval(() => {
      w += totalScrapKg / 20;
      if (w >= totalScrapKg) {
        w = totalScrapKg;
        clearInterval(interval);
        setTimeout(() => setIsWeighing(false), 1000);
      }
      setWeight(w);
    }, 100);
  };

  const handleSell = () => {
    if (weight === 0) return;
    // Sell all scrap
    Object.keys(inventory.scrap).forEach((mat) => {
      const kg = inventory.scrap[mat as keyof typeof inventory.scrap];
      const rate = gameState.scrapRates.find((r) => r.material === mat)?.currentRate || 10;
      addCash(kg * rate);
      addTransaction({ type: "SELL_SCRAP", amount: kg * rate, notes: `Sold ${kg}kg ${mat} @ ₹${rate}/kg` });
    });
    // Clear scrap inventory (would need store action)
    setWeight(0);
    setPrice(0);
  };

  return (
    <group position={position}>
      {/* Foundation */}
      <Mesh
        position={[0, 0.15, 0]}
        scale={[4, 0.3, 3]}
        geometry={new BoxGeometry()}
        material={new MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.9 })}
        receiveShadow
      />

      {/* Weighbridge platform */}
      <Mesh
        ref={platformRef}
        position={[0, 0.4, 0]}
        scale={[3.5, 0.3, 2.5]}
        geometry={new BoxGeometry()}
        material={new MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.7, metalness: 0.3 })}
        castShadow
        receiveShadow
      />

      {/* Load cells (4 corners) */}
      {[-1.5, 1.5].map((x) =>
        [-1, 1].map((z) => (
          <Mesh
            key={`cell-${x}-${z}`}
            position={[x, 0.25, z]}
            scale={[0.3, 0.2, 0.3]}
            geometry={new CylinderGeometry(0.15, 0.15, 1)}
            material={new MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0.5 })}
            castShadow
          />
        ))
      )}

      {/* Digital display housing */}
      <Mesh
        position={[0, 2.5, -1.8]}
        scale={[1.5, 1, 0.3]}
        geometry={new BoxGeometry()}
        material={new MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.3, metalness: 0.8 })}
        castShadow
      >
        <group position={[0, 0, 0.16]}>
          {/* Digital weight display */}
          <Html
            transform
            position={[-0.6, 0, 0]}
            style={{ pointerEvents: "none" }}
          >
            <div className="font-mono text-kabaad-500 bg-black text-right px-2 py-1" style={{ fontSize: "1.5rem" }}>
              {weight.toFixed(0)} KG
            </div>
          </Html>

          {/* Rate display */}
          <Html
            transform
            position={[0.4, 0.3, 0]}
            style={{ pointerEvents: "none" }}
          >
            <div className="font-mono text-kabaad-300 bg-black text-right px-2 py-1 text-xs">
              @ ₹{currentMaterial !== "MIXED" ? (gameState.scrapRates.find((r) => r.material === currentMaterial)?.currentRate || 0) : "MIXED"}/kg
            </div>
          </Html>

          {/* Total price */}
          <Html
            transform
            position={[0.4, -0.3, 0]}
            style={{ pointerEvents: "none" }}
          >
            <div className="font-mono text-green-400 bg-black text-right px-2 py-1 text-xs">
              ₹{price.toLocaleString()}
            </div>
          </Html>
        </group>
      </Mesh>

      {/* Analog dial gauge */}
      <Mesh
        position={[1.8, 1.5, -1.8]}
        scale={[0.6, 0.6, 0.2]}
        geometry={new CylinderGeometry(0.5, 0.5, 0.2, 32)}
        material={new MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.2, metalness: 0.8 })}
        castShadow
      >
        {/* Needle */}
        <Mesh
          ref={needleRef}
          position={[0, 0, 0.11]}
          rotation={[0, 0, -Math.PI / 2]}
          geometry={new BoxGeometry(0.02, 0.45, 0.05)}
          material={new MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.5 })}
        />
        {/* Dial markings */}
        {Array.from({ length: 11 }, (_, i) => (
          <Mesh
            key={`mark-${i}`}
            position={[0, 0, 0.12]}
            rotation={[0, 0, -Math.PI / 2 + (i / 10) * Math.PI]}
            geometry={new BoxGeometry(0.015, i % 5 === 0 ? 0.12 : 0.06, 0.02)}
            material={new MeshStandardMaterial({ color: 0xffffff })}
          />
        ))}
        {/* Center hub */}
        <Mesh
          position={[0, 0, 0.13]}
          geometry={new CylinderGeometry(0.04, 0.04, 0.05, 12)}
          material={new MeshStandardMaterial({ color: 0x333 })}
        />
      </Mesh>

      {/* Control panel */}
      <Mesh
        position={[-2, 1, -1.5]}
        scale={[1, 1.5, 0.5]}
        geometry={new BoxGeometry()}
        material={new MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 })}
        castShadow
      >
        <group position={[0, 0, 0.26]}>
          <Html transform position={[0, 0.4, 0]} style={{ pointerEvents: "none" }}>
            <div className="text-center text-white text-xs">DHARAM KANTA</div>
          </Html>
          <Html transform position={[0, 0.2, 0]} style={{ pointerEvents: "none" }}>
            <div className="text-center text-kabaad-300 text-xs">धर्म कांटा</div>
          </Html>

          {/* Weigh button */}
          <Html
            transform
            position={[0, -0.1, 0]}
            onClick={handleWeigh}
            style={{ pointerEvents: "auto" }}
          >
            <button
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-colors ${
                totalScrapKg > 0
                  ? "bg-kabaad-500 text-white hover:bg-kabaad-600"
                  : "bg-loha-600 text-loha-300 cursor-not-allowed"
              }`}
              disabled={totalScrapKg === 0}
            >
              WEIGH / तौलें
            </button>
          </Html>

          {/* Sell button */}
          <Html
            transform
            position={[0, -0.4, 0]}
            onClick={handleSell}
            style={{ pointerEvents: "auto" }}
          >
            <button
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-colors ${
                weight > 0
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-loha-600 text-loha-300 cursor-not-allowed"
              }`}
              disabled={weight === 0}
            >
              SELL / बेचें ₹{price.toLocaleString()}
            </button>
          </Html>
        </group>
      </Mesh>

      {/* Material selector */}
      <Html
        transform
        position={[-2, 2.2, -1.5]}
        style={{ pointerEvents: "auto" }}
      >
        <select
          className="bg-white/90 text-loha-900 px-2 py-1 rounded text-xs border border-kabaad-300"
          value={currentMaterial}
          onChange={(e) => setCurrentMaterial(e.target.value as any)}
        >
          <option value="MIXED">MIXED / मिश्रित</option>
          <option value="LOHA">LOHA / लोहा</option>
          <option value="TAAMBA">TAAMBA / तांबा</option>
          <option value="ALUMINIUM">ALUMINIUM / एल्युमिनियम</option>
          <option value="BATTERY">BATTERY / बैटरी</option>
          <option value="PLASTIC">PLASTIC / प्लास्टिक</option>
          <option value="TYRE">TYRE / टायर</option>
          <option value="EWASTE">E-WASTE / ई-वेस्ट</option>
        </select>
      </Html>

      {/* Status indicator */}
      <Html
        transform
        position={[0, 3.2, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isWeighing ? "bg-yellow-500 text-black animate-pulse" : "bg-green-500 text-white"
        }`}>
          {isWeighing ? "WEIGHING... / तौल रहा है" : "READY / तैयार"}
        </div>
      </Html>

      {/* Scrap pile visualization near kanta */}
      {totalScrapKg > 0 && (
        <Mesh
          position={[-3, 0.5, 1]}
          scale={[Math.min(2, totalScrapKg / 500), 1, Math.min(2, totalScrapKg / 500)]}
          geometry={new BoxGeometry(2, 1, 2)}
          material={new MeshStandardMaterial({
            color: 0x4a3a2a,
            roughness: 0.95,
            metalness: 0.1,
          })}
          castShadow
          receiveShadow
        />
      )}
    </group>
  );
}

import * as THREE from "three";