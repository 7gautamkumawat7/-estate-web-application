"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Box, Rotate3d, Compass } from "lucide-react";

export default function PropertyModel3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let animationFrameId: number;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Check WebGL availability
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // Fallback will show
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(5, 4, 7);
    camera.lookAt(0, 1.2, 0);

    // Architectural Model Group
    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);

    // Materials
    const goldMetal = new THREE.MeshStandardMaterial({
      color: 0xc6a66b,
      metalness: 0.85,
      roughness: 0.25,
    });

    const darkNavyBase = new THREE.MeshStandardMaterial({
      color: 0x17232d,
      roughness: 0.6,
    });

    const tintedGlass = new THREE.MeshPhysicalMaterial({
      color: 0xa8c5db,
      metalness: 0.1,
      roughness: 0.1,
      transparent: true,
      opacity: 0.65,
      transmission: 0.6,
    });

    // 1. Podium Base
    const baseGeo = new THREE.BoxGeometry(4.2, 0.4, 4.2);
    const baseMesh = new THREE.Mesh(baseGeo, darkNavyBase);
    baseMesh.position.y = 0.2;
    buildingGroup.add(baseMesh);

    // 2. Tower Core Glass
    const towerGeo = new THREE.BoxGeometry(2.4, 3.2, 2.4);
    const towerMesh = new THREE.Mesh(towerGeo, tintedGlass);
    towerMesh.position.y = 2.0;
    buildingGroup.add(towerMesh);

    // 3. Cantilevered Terraces / Luxury Balconies
    for (let i = 0; i < 4; i++) {
      const slabGeo = new THREE.BoxGeometry(3.0, 0.08, 3.0);
      const slab = new THREE.Mesh(slabGeo, goldMetal);
      slab.position.y = 0.8 + i * 0.8;
      buildingGroup.add(slab);
    }

    // 4. Sky Penthouse Floating Crown
    const crownGeo = new THREE.BoxGeometry(2.8, 0.6, 2.8);
    const crownMesh = new THREE.Mesh(crownGeo, goldMetal);
    crownMesh.position.y = 3.9;
    buildingGroup.add(crownMesh);

    // 5. Water feature / Pool mirror on terrace
    const poolGeo = new THREE.BoxGeometry(1.6, 0.04, 1.2);
    const poolMat = new THREE.MeshStandardMaterial({ color: 0x4aa3df, roughness: 0.1 });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.position.set(0.6, 1.65, 0.6);
    buildingGroup.add(pool);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xe5c287, 2.2);
    dirLight1.position.set(6, 10, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7598b5, 1.2);
    dirLight2.position.set(-5, -2, -4);
    scene.add(dirLight2);

    // Pointer Drag Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      setIsInteracting(true);
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      buildingGroup.rotation.y += deltaX * 0.008;
      buildingGroup.rotation.x = Math.max(-0.4, Math.min(0.4, buildingGroup.rotation.x + deltaY * 0.005));

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 2000);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    domElement.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    // Resize listener
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Slow subtle auto-rotation when user is not actively dragging
      if (!isDragging) {
        buildingGroup.rotation.y += 0.004;
      }

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      if (domElement && domElement.parentNode) {
        domElement.parentNode.removeChild(domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] rounded-2xl overflow-hidden bg-navy-950 border border-gold/30 shadow-2xl">
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Floating 3D Controls Pill */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-900/80 backdrop-blur-md border border-borderBase-dark text-xs text-gold font-mono pointer-events-none">
        <Rotate3d className="w-4 h-4 animate-spin-slow" />
        <span>Interactive 3D Architectural Model (Drag to Orbit)</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-2 px-3 py-1 rounded bg-navy-900/80 backdrop-blur-md border border-borderBase-dark text-[11px] text-gray-400 font-mono pointer-events-none">
        <Compass className="w-3.5 h-3.5 text-gold" />
        <span>Bespoke NovaEstate Spatial Engine</span>
      </div>

      {/* Loading Skeleton Fallback */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-900 text-gray-400">
          <Box className="w-8 h-8 text-gold animate-bounce mb-2" />
          <span className="text-xs font-mono">Initializing 3D Architectural Volume...</span>
        </div>
      )}
    </div>
  );
}
