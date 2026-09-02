'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BlochVector } from '@/lib/types';
import { AlertTriangle, RotateCcw, Info, Sparkles } from 'lucide-react';
import { useAccessibility } from '@/lib/accessibility-context';

interface BlochSphere3DProps {
  bloch: BlochVector | null;
  qubitIndex?: number;
  warning?: string;
  size?: number;
  interactive?: boolean;
}

export function BlochSphere3D({
  bloch,
  qubitIndex = 0,
  warning,
  size = 320,
  interactive = true
}: BlochSphere3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const needleGroupRef = useRef<THREE.Group | null>(null);
  const arcLineRef = useRef<THREE.Line | null>(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.35, y: -0.6 });
  const [textDescription, setTextDescription] = useState<string>('');
  const { explanationMode } = useAccessibility();

  // Generate text equivalent for screen readers and accessible status
  useEffect(() => {
    if (!bloch || !bloch.is_pure) {
      setTextDescription(
        `Qubit ${qubitIndex} is entangled with another qubit. It is in a mixed quantum state with undefined single-qubit pure Bloch coordinates.`
      );
    } else {
      const prob0 = Math.cos(bloch.theta / 2) ** 2;
      const prob1 = Math.sin(bloch.theta / 2) ** 2;
      const degTheta = ((bloch.theta * 180) / Math.PI).toFixed(1);
      const degPhi = ((bloch.phi * 180) / Math.PI).toFixed(1);
      setTextDescription(
        `Qubit ${qubitIndex} pure state: Coordinates (x=${bloch.x}, y=${bloch.y}, z=${bloch.z}). Polar angle theta=${degTheta} deg, Azimuth phi=${degPhi} deg. Probability |0> = ${(prob0 * 100).toFixed(1)}%, Probability |1> = ${(prob1 * 100).toFixed(1)}%.`
      );
    }
  }, [bloch, qubitIndex]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = size;
    const height = size;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xffffff);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Clear old canvases
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Main Sphere Wireframe & Transparent Surface
    const sphereRadius = 1.0;
    const isEntangled = !bloch || !bloch.is_pure;

    // Outer translucent shell
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 32, 32);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: isEntangled ? 0xf59e0b : 0xe0e7ff,
      transparent: true,
      opacity: isEntangled ? 0.12 : 0.22,
      depthWrite: false,
      shininess: 30
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);

    // Equator ring
    const equatorGeo = new THREE.BufferGeometry();
    const equatorPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      equatorPoints.push(new THREE.Vector3(Math.cos(angle) * sphereRadius, 0, Math.sin(angle) * sphereRadius));
    }
    equatorGeo.setFromPoints(equatorPoints);
    const ringMat = new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.6 });
    const equatorLine = new THREE.Line(equatorGeo, ringMat);
    scene.add(equatorLine);

    // Meridian ring (XZ plane)
    const meridianGeo = new THREE.BufferGeometry();
    const meridianPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      meridianPoints.push(new THREE.Vector3(Math.cos(angle) * sphereRadius, Math.sin(angle) * sphereRadius, 0));
    }
    meridianGeo.setFromPoints(meridianPoints);
    const meridianLine = new THREE.Line(meridianGeo, ringMat);
    scene.add(meridianLine);

    // Coordinate Axes (Three.js coords: Y is +Z in physics, Z is +Y in physics, X is +X)
    // Standard Physics Bloch:
    // +Z = North pole (|0>) -> Three.js (0, 1.25, 0)
    // -Z = South pole (|1>) -> Three.js (0, -1.25, 0)
    // +X = |+> -> Three.js (1.25, 0, 0)
    // +Y = |i> -> Three.js (0, 0, 1.25)
    const axisMat = new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.7 });
    
    // Z Axis (|0> to |1>)
    const zGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -1.3, 0),
      new THREE.Vector3(0, 1.3, 0)
    ]);
    scene.add(new THREE.Line(zGeo, axisMat));

    // X Axis
    const xGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.3, 0, 0),
      new THREE.Vector3(1.3, 0, 0)
    ]);
    scene.add(new THREE.Line(xGeo, axisMat));

    // Y Axis
    const yGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, -1.3),
      new THREE.Vector3(0, 0, 1.3)
    ]);
    scene.add(new THREE.Line(yGeo, axisMat));

    // Vector Needle Group
    const needleGroup = new THREE.Group();
    needleGroupRef.current = needleGroup;

    if (bloch && bloch.is_pure) {
      // Convert physics (x, y, z) to Three.js coords (x, z_physics, -y_physics)
      // in physics: z is up/down (theta=0 is +z), x is right/left, y is forward/backward
      const tx = bloch.x * sphereRadius;
      const ty = bloch.z * sphereRadius; // Physics Z is vertical in Three.js
      const tz = bloch.y * sphereRadius; // Physics Y is depth in Three.js

      // Needle shaft
      const needlePoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(tx, ty, tz)];
      const needleGeo = new THREE.BufferGeometry().setFromPoints(needlePoints);
      const needleMat = new THREE.LineBasicMaterial({ color: 0x4f46e5, linewidth: 3 });
      const needleLine = new THREE.Line(needleGeo, needleMat);
      needleGroup.add(needleLine);

      // Needle tip sphere / arrow head
      const tipGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const tipMat = new THREE.MeshStandardMaterial({ color: 0x4f46e5, roughness: 0.3 });
      const tipMesh = new THREE.Mesh(tipGeo, tipMat);
      tipMesh.position.set(tx, ty, tz);
      needleGroup.add(tipMesh);

      // Trajectory projection point on XY plane
      const projPoints = [new THREE.Vector3(tx, ty, tz), new THREE.Vector3(tx, 0, tz)];
      const projGeo = new THREE.BufferGeometry().setFromPoints(projPoints);
      const projMat = new THREE.LineDashedMaterial({ color: 0x94a3b8, dashSize: 0.05, gapSize: 0.05 });
      const projLine = new THREE.Line(projGeo, projMat);
      projLine.computeLineDistances();
      needleGroup.add(projLine);
    } else {
      // Mixed state indicator (Faint center core)
      const coreGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.5 });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      needleGroup.add(coreMesh);
    }

    scene.add(needleGroup);

    // Initial root group rotation
    scene.rotation.x = rotationRef.current.x;
    scene.rotation.y = rotationRef.current.y;

    // Render loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      scene.rotation.x = rotationRef.current.x;
      scene.rotation.y = rotationRef.current.y;
      renderer.render(scene, camera);
    };
    animate();

    // Mouse drag interaction
    const dom = renderer.domElement;

    const handleMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      rotationRef.current.y += dx * 0.01;
      rotationRef.current.x += dy * 0.01;
      // Clamp x rotation to avoid flipping upside down
      rotationRef.current.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, rotationRef.current.x));
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch support for mobile/tablet
    const handleTouchStart = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return;
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length === 0) return;
      const dx = e.touches[0].clientX - prevMouseRef.current.x;
      const dy = e.touches[0].clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      rotationRef.current.y += dx * 0.01;
      rotationRef.current.x += dy * 0.01;
      rotationRef.current.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, rotationRef.current.x));
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    dom.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      renderer.dispose();
    };
  }, [bloch, size, interactive]);

  const resetView = () => {
    rotationRef.current = { x: 0.35, y: -0.6 };
  };

  const isEntangled = !bloch || !bloch.is_pure;

  return (
    <div className="flex flex-col items-center bg-white rounded-2xl border border-dark-200 p-4 shadow-xs relative">
      {/* Header Info */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-dark-900">
            Qubit {qubitIndex} Bloch Sphere
          </span>
          {isEntangled ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              <AlertTriangle className="w-3 h-3" />
              Entangled / Mixed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200">
              <Sparkles className="w-3 h-3" />
              Pure State
            </span>
          )}
        </div>
        <button
          onClick={resetView}
          title="Reset 3D camera orientation"
          className="p-1 rounded text-dark-400 hover:text-dark-700 hover:bg-dark-100 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 3D Canvas Container */}
      <div className="relative flex items-center justify-center">
        <div
          ref={containerRef}
          className="cursor-grab active:cursor-grabbing select-none"
          style={{ width: size, height: size }}
          aria-label={`3D Bloch Sphere for Qubit ${qubitIndex}. Drag to rotate.`}
        />

        {/* Pole Label Overlays */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-mono font-bold text-primary-700 pointer-events-none bg-white/80 px-1.5 py-0.5 rounded notranslate" translate="no">
          |0⟩ (+Z)
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-mono font-bold text-sky-700 pointer-events-none bg-white/80 px-1.5 py-0.5 rounded notranslate" translate="no">
          |1⟩ (-Z)
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-dark-600 pointer-events-none bg-white/80 px-1.5 py-0.5 rounded notranslate" translate="no">
          |+⟩ (+X)
        </div>
      </div>

      {/* Warning Alert if Entangled */}
      {isEntangled && (
        <div className="w-full mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <div>
            <p className="font-semibold">Pure Bloch Vector Undefined</p>
            <p className="mt-0.5 text-amber-800 leading-relaxed">
              {warning || (
                <>
                  Qubit {qubitIndex} is entangled with another qubit. Its reduced density matrix has purity{' '}
                  <span className="notranslate font-mono font-semibold" translate="no">Tr(ρ²) &lt; 1.0</span>, meaning quantum information is non-locally distributed.
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Coordinates readout table */}
      {bloch && bloch.is_pure && (
        <div className="w-full mt-3 grid grid-cols-3 gap-2 text-center text-xs notranslate" translate="no">
          <div className="p-2 bg-dark-50 rounded-lg border border-dark-100">
            <span className="text-dark-500 block text-[10px] uppercase font-mono">X / Y / Z</span>
            <span className="font-mono font-bold text-dark-800">
              ({bloch.x}, {bloch.y}, {bloch.z})
            </span>
          </div>
          <div className="p-2 bg-dark-50 rounded-lg border border-dark-100">
            <span className="text-dark-500 block text-[10px] uppercase font-mono">θ (Polar)</span>
            <span className="font-mono font-bold text-primary-700">
              {((bloch.theta * 180) / Math.PI).toFixed(1)}°
            </span>
          </div>
          <div className="p-2 bg-dark-50 rounded-lg border border-dark-100">
            <span className="text-dark-500 block text-[10px] uppercase font-mono">φ (Azimuth)</span>
            <span className="font-mono font-bold text-primary-700">
              {((bloch.phi * 180) / Math.PI).toFixed(1)}°
            </span>
          </div>
        </div>
      )}

      {/* Screen Reader & Accessible Equivalent Description */}
      <div className="sr-only" aria-live="polite">
        {textDescription}
      </div>
    </div>
  );
}
