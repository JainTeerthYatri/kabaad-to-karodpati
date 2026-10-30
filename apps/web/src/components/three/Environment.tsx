"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export function Environment({ timeOfDay, weather }: { timeOfDay: number; weather: "CLEAR" | "MONSOON" | "OVERCAST" }) {
  const { scene, gl } = useThree();

  useEffect(() => {
    // Sky dome
    const skyGeometry = new THREE.SphereGeometry(500, 32, 15);
    const skyMaterial = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      color: weather === "MONSOON" ? 0x4a4a5a : weather === "OVERCAST" ? 0x6a6a7a : 0x87ceeb,
      fog: false,
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);

    // Sun/Moon
    const sunGeometry = new THREE.SphereGeometry(15, 16, 16);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: timeOfDay < 0.2 || timeOfDay > 0.8 ? 0xffaa66 : 0xffffee,
      transparent: true,
      opacity: 0.9,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    const updateCelestial = () => {
      const phi = THREE.MathUtils.degToRad(90 - timeOfDay * 360);
      const theta = THREE.MathUtils.degToRad(180);
      const radius = 400;

      sun.position.setFromSphericalCoords(radius, phi, theta);
      sun.visible = timeOfDay > 0.15 && timeOfDay < 0.85;

      // Sky color transition
      if (weather === "CLEAR") {
        if (timeOfDay < 0.2 || timeOfDay > 0.8) {
          skyMaterial.color.setHex(0x1a1a3a); // Night
        } else if (timeOfDay < 0.3 || timeOfDay > 0.7) {
          skyMaterial.color.setHex(0xff6b35); // Dawn/Dusk
        } else {
          skyMaterial.color.setHex(0x87ceeb); // Day
        }
      }
    };

    updateCelestial();

    // Fog
    scene.fog = new THREE.Fog(
      weather === "MONSOON" ? 0x4a4a5a : weather === "OVERCAST" ? 0x6a6a7a : 0x87ceeb,
      weather === "MONSOON" ? 10 : 50,
      weather === "MONSOON" ? 80 : 200
    );

    return () => {
      scene.remove(sky);
      scene.remove(sun);
      skyGeometry.dispose();
      skyMaterial.dispose();
      sunGeometry.dispose();
      sunMaterial.dispose();
    };
  }, [scene, timeOfDay, weather]);

  return null;
}