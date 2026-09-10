'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BlochVector } from '@/lib/types';
import { AlertTriangle, RotateCcw, Sparkles } from 'lucide-react';
import { MathRenderer } from '@/components/math/MathRenderer';

interface BlochSphere3DProps {
  bloch: BlochVector | null;
  qubitIndex?: number;
  warning?: string;
  size?: number;
  interactive?: boolean;
  showSweepArcs?: boolean;
  activeSweep?: 'theta' | 'phi' | 'both' | null;
}

// 6 3D axis anchors positioned cleanly outside the unit sphere (R = 1.0, label R = 1.55)
// Standard Physics to Three.js mapping:
// +Z = North pole (|0>) -> (0, 1.55, 0)
// -Z = South pole (|1>) -> (0, -1.55, 0)
// +X = Hadamard (|+) -> (1.55, 0, 0)
// -X = Phase (|-) -> (-1.55, 0, 0)
// +Y = Imaginary (|i>) -> (0, 0, 1.55)
// -Y = Imaginary (|-i>) -> (0, 0, -1.55)
const AXIS_ANCHORS = [
  { id: 'z-pos', label: '$|0\\rangle$', axis: '+Z', pos: new THREE.Vector3(0, 1.55, 0), badgeClass: 'text-primary-800 border-primary-300' },
  { id: 'z-neg', label: '$|1\\rangle$', axis: '-Z', pos: new THREE.Vector3(0, -1.55, 0), badgeClass: 'text-sky-800 border-sky-300' },
  { id: 'x-pos', label: '$|+\\rangle$', axis: '+X', pos: new THREE.Vector3(1.55, 0, 0), badgeClass: 'text-indigo-800 border-indigo-300' },
  { id: 'x-neg', label: '$|-\\rangle$', axis: '-X', pos: new THREE.Vector3(-1.55, 0, 0), badgeClass: 'text-purple-800 border-purple-300' },
  { id: 'y-pos', label: '$|i\\rangle$', axis: '+Y', pos: new THREE.Vector3(0, 0, 1.55), badgeClass: 'text-emerald-800 border-emerald-300' },
  { id: 'y-neg', label: '$|-i\\rangle$', axis: '-Y', pos: new THREE.Vector3(0, 0, -1.55), badgeClass: 'text-teal-800 border-teal-300' }
];

export function BlochSphere3D({
  bloch,
  qubitIndex = 0,
  warning,
  size = 340,
  interactive = true,
  showSweepArcs = false,
  activeSweep = null
}: BlochSphere3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const needleGroupRef = useRef<THREE.Group | null>(null);
  const sweepGroupRef = useRef<THREE.Group | null>(null);

  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.35, y: -0.6 });
  const [textDescription, setTextDescription] = useState<string>('');

  // Refs for 2D projected DOM labels so they rotate smoothly with user camera in 60fps
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const thetaLabelRef = useRef<HTMLDivElement | null>(null);
  const phiLabelRef = useRef<HTMLDivElement | null>(null);

  const thetaAnchorRef = useRef<THREE.Vector3 | null>(null);
  const phiAnchorRef = useRef<THREE.Vector3 | null>(null);

  // Generate accessible description for screen readers
  useEffect(() => {
    if (!bloch || !bloch.is_pure) {
      setTextDescription(
        `Qubit ${qubitIndex} is entangled in a mixed quantum state. Single-qubit pure Bloch coordinates are undefined.`
      );
    } else {
      const prob0 = Math.cos(bloch.theta / 2) ** 2;
      const prob1 = Math.sin(bloch.theta / 2) ** 2;
      const degTheta = ((bloch.theta * 180) / Math.PI).toFixed(1);
      const degPhi = ((bloch.phi * 180) / Math.PI).toFixed(1);
      setTextDescription(
        `Qubit ${qubitIndex} pure state: Coordinates (x=${bloch.x}, y=${bloch.y}, z=${bloch.z}). Polar angle theta=${degTheta}°, Azimuth phi=${degPhi}°. Probability |0⟩ = ${(prob0 * 100).toFixed(1)}%, Probability |1⟩ = ${(prob1 * 100).toFixed(1)}%.`
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
    scene.background = null; // Transparent background to match container

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4.15);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Lighting (ambient 1.3, directional 2.0 at [3, 4, 5])
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);

    // Main Sphere Wireframe & Translucent Surface
    const sphereRadius = 1.0;
    const isEntangled = !bloch || !bloch.is_pure;

    // 1. Transparent sphere shell
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 48, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: isEntangled ? 0x94a3b8 : 0x818cf8,
      transparent: true,
      opacity: isEntangled ? 0.08 : 0.16,
      depthWrite: false,
      side: THREE.DoubleSide,
      roughness: 0.4
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);

    // 2. Latitude and longitude grid (wireframe)
    const gridGeo = new THREE.SphereGeometry(sphereRadius, 20, 12);
    const gridMat = new THREE.MeshBasicMaterial({
      color: isEntangled ? 0x94a3b8 : 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: isEntangled ? 0.12 : 0.22
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    scene.add(gridMesh);

    // 3. Equator (smooth circle of 97 points)
    const equatorGeo = new THREE.BufferGeometry();
    const equatorPoints: THREE.Vector3[] = [];
    const eqSteps = 96;
    for (let i = 0; i <= eqSteps; i++) {
      const angle = (i / eqSteps) * Math.PI * 2;
      equatorPoints.push(new THREE.Vector3(Math.cos(angle) * sphereRadius, 0, Math.sin(angle) * sphereRadius));
    }
    equatorGeo.setFromPoints(equatorPoints);
    const ringMat = new THREE.LineBasicMaterial({ color: 0xa5b4fc, linewidth: 1.3, transparent: true, opacity: 0.6 });
    const equatorLine = new THREE.Line(equatorGeo, ringMat);
    scene.add(equatorLine);

    // 4. Coordinate axes (slender lines through origin)
    const axisGroup = new THREE.Group();
    const axisMat = new THREE.LineBasicMaterial({ color: 0x64748b, linewidth: 1, transparent: true, opacity: 0.75 });
    const axisLimit = 1.25;

    const addAxisLine = (from: THREE.Vector3, to: THREE.Vector3) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([from, to]);
      axisGroup.add(new THREE.Line(lineGeo, axisMat));
    };

    // Z Axis (vertical in Three.js)
    addAxisLine(new THREE.Vector3(0, -axisLimit, 0), new THREE.Vector3(0, axisLimit, 0));
    // X Axis (horizontal in Three.js)
    addAxisLine(new THREE.Vector3(-axisLimit, 0, 0), new THREE.Vector3(axisLimit, 0, 0));
    // Y Axis (depth in Three.js)
    addAxisLine(new THREE.Vector3(0, 0, -axisLimit), new THREE.Vector3(0, 0, axisLimit));

    scene.add(axisGroup);

    // State Vector Needle Group
    const needleGroup = new THREE.Group();
    needleGroupRef.current = needleGroup;

    // Sweep Arcs Group
    const sweepGroup = new THREE.Group();
    sweepGroupRef.current = sweepGroup;

    if (bloch && bloch.is_pure) {
      const tx = bloch.x * sphereRadius;
      const ty = bloch.z * sphereRadius; // Physics Z is vertical in Three.js
      const tz = bloch.y * sphereRadius; // Physics Y is depth in Three.js
      const endpoint = new THREE.Vector3(tx, ty, tz);
      const length = endpoint.length();

      // Needle shaft line
      const needlePoints = [new THREE.Vector3(0, 0, 0), endpoint];
      const needleGeo = new THREE.BufferGeometry().setFromPoints(needlePoints);
      const needleMat = new THREE.LineBasicMaterial({ color: 0x4f46e5, linewidth: 3 });
      const needleLine = new THREE.Line(needleGeo, needleMat);
      needleGroup.add(needleLine);

      // State-vector arrow cone
      if (length > 0.00001) {
        const direction = endpoint.clone().normalize();
        const arrowHeight = Math.min(0.16, length * 0.35);
        const arrowRadius = Math.min(0.055, length * 0.15);
        const arrowPosition = endpoint.clone().addScaledVector(direction, -arrowHeight / 2);
        const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

        const coneGeo = new THREE.ConeGeometry(arrowRadius, arrowHeight, 24);
        const coneMat = new THREE.MeshStandardMaterial({ color: 0x4f46e5, roughness: 0.3 });
        const coneMesh = new THREE.Mesh(coneGeo, coneMat);
        coneMesh.position.copy(arrowPosition);
        coneMesh.quaternion.copy(rotation);
        needleGroup.add(coneMesh);
      }

      // State-vector endpoint sphere
      const tipGeo = new THREE.SphereGeometry(0.04, 20, 20);
      const tipMat = new THREE.MeshStandardMaterial({
        color: 0x4f46e5,
        emissive: 0x4f46e5,
        emissiveIntensity: 0.2
      });
      const tipMesh = new THREE.Mesh(tipGeo, tipMat);
      tipMesh.position.copy(endpoint);
      needleGroup.add(tipMesh);

      // Trajectory projection point on equator plane
      const projPoints = [new THREE.Vector3(tx, ty, tz), new THREE.Vector3(tx, 0, tz)];
      const projGeo = new THREE.BufferGeometry().setFromPoints(projPoints);
      const projMat = new THREE.LineDashedMaterial({ color: 0x94a3b8, dashSize: 0.05, gapSize: 0.05 });
      const projLine = new THREE.Line(projGeo, projMat);
      projLine.computeLineDistances();
      needleGroup.add(projLine);

      // Projection vector from origin to equator projection
      const baseProjPoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(tx, 0, tz)];
      const baseProjGeo = new THREE.BufferGeometry().setFromPoints(baseProjPoints);
      const baseProjMat = new THREE.LineDashedMaterial({ color: 0xc7d2fe, dashSize: 0.04, gapSize: 0.04 });
      const baseProjLine = new THREE.Line(baseProjGeo, baseProjMat);
      baseProjLine.computeLineDistances();
      needleGroup.add(baseProjLine);

      // Dynamic Sweep Arcs for θ and φ
      const shouldShowTheta = showSweepArcs || activeSweep === 'theta' || activeSweep === 'both';
      const shouldShowPhi = showSweepArcs || activeSweep === 'phi' || activeSweep === 'both';

      const arcRadius = 0.52;

      // 1. Polar Arc θ (from +Z axis down to state vector)
      if (shouldShowTheta && bloch.theta > 0.02) {
        const thetaPoints: THREE.Vector3[] = [];
        const steps = 28;
        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * bloch.theta;
          thetaPoints.push(
            new THREE.Vector3(
              Math.sin(t) * Math.cos(bloch.phi) * arcRadius,
              Math.cos(t) * arcRadius,
              Math.sin(t) * Math.sin(bloch.phi) * arcRadius
            )
          );
        }
        const thetaGeo = new THREE.BufferGeometry().setFromPoints(thetaPoints);
        const thetaMat = new THREE.LineBasicMaterial({ color: 0x4f46e5, linewidth: 2 });
        sweepGroup.add(new THREE.Line(thetaGeo, thetaMat));

        // Midpoint anchor for θ label
        const midTheta = bloch.theta / 2;
        thetaAnchorRef.current = new THREE.Vector3(
          Math.sin(midTheta) * Math.cos(bloch.phi) * (arcRadius + 0.16),
          Math.cos(midTheta) * (arcRadius + 0.16),
          Math.sin(midTheta) * Math.sin(bloch.phi) * (arcRadius + 0.16)
        );
      } else {
        thetaAnchorRef.current = null;
      }

      // 2. Azimuthal Arc φ (in equator plane from +X to vector projection)
      if (shouldShowPhi && bloch.phi > 0.02) {
        const phiPoints: THREE.Vector3[] = [];
        const steps = 28;
        for (let i = 0; i <= steps; i++) {
          const p = (i / steps) * bloch.phi;
          phiPoints.push(
            new THREE.Vector3(
              Math.cos(p) * arcRadius,
              0,
              Math.sin(p) * arcRadius
            )
          );
        }
        const phiGeo = new THREE.BufferGeometry().setFromPoints(phiPoints);
        const phiMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, linewidth: 2 });
        sweepGroup.add(new THREE.Line(phiGeo, phiMat));

        // Midpoint anchor for φ label
        const midPhi = bloch.phi / 2;
        phiAnchorRef.current = new THREE.Vector3(
          Math.cos(midPhi) * (arcRadius + 0.16),
          0,
          Math.sin(midPhi) * (arcRadius + 0.16)
        );
      } else {
        phiAnchorRef.current = null;
      }
    } else {
      // NOTE: Yellow ball in the centre completely removed per user instruction!
      // In mixed states, clean translucent shell is preserved without unwanted center spheres.
      thetaAnchorRef.current = null;
      phiAnchorRef.current = null;
    }

    scene.add(needleGroup);
    scene.add(sweepGroup);

    // Initial root group rotation
    scene.rotation.x = rotationRef.current.x;
    scene.rotation.y = rotationRef.current.y;

    // Projection vector helpers
    const tempVec = new THREE.Vector3();
    const camSpaceVec = new THREE.Vector3();

    // Helper to determine if a 3D point is physically occluded by the unit sphere (R = 1.0)
    const isOccludedBySphere = (point: THREE.Vector3) => {
      const D = camera.position.z;
      const Px = point.x;
      const Py = point.y;
      const Pz = point.z;

      const Vz = Pz - D;
      const a = Px * Px + Py * Py + Vz * Vz;
      const tMin = -(D * Vz) / a;

      // If the closest point to origin along line of sight is between camera (t=0) and point (t=1)
      if (tMin > 0 && tMin < 1) {
        const dMinSq = (D * D * (Px * Px + Py * Py)) / a;
        // Unit sphere radius = 1.0. If ray passes within sphere radius, it is hidden behind the sphere
        if (dMinSq < 1.06) {
          return true;
        }
      }
      return false;
    };

    // Render loop: renders scene and updates 2D screen projected labels at 60 FPS
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      scene.rotation.x = rotationRef.current.x;
      scene.rotation.y = rotationRef.current.y;
      renderer.render(scene, camera);

      // Project 6 axis labels outside the sphere dynamically with user rotations
      // Calculate exact 2D radius of unit sphere on screen to ensure labels ALWAYS stay outside
      const sphereLimbVec = new THREE.Vector3(1.0, 0, 0).project(camera);
      const sphereRadiusPx = Math.abs(sphereLimbVec.x) * (width * 0.5);
      const minOutsideRadiusPx = sphereRadiusPx + 26; // Always stay at least 26px outside sphere silhouette
      const centerX = width * 0.5;
      const centerY = height * 0.5;

      AXIS_ANCHORS.forEach((anchor, idx) => {
        const el = labelRefs.current[idx];
        if (!el) return;

        // 1. Calculate 3D position in rotated camera space
        camSpaceVec.copy(anchor.pos).applyEuler(scene.rotation);

        // 2. Project to 2D screen coordinates
        tempVec.copy(camSpaceVec).project(camera);
        let screenX = (tempVec.x * 0.5 + 0.5) * width;
        let screenY = (-tempVec.y * 0.5 + 0.5) * height;

        // 3. Guarantee the notation is NEVER inside the sphere silhouette on screen
        let dx = screenX - centerX;
        let dy = screenY - centerY;
        const dist2D = Math.sqrt(dx * dx + dy * dy);

        if (dist2D < minOutsideRadiusPx) {
          if (dist2D > 0.001) {
            const pushFactor = minOutsideRadiusPx / dist2D;
            dx *= pushFactor;
            dy *= pushFactor;
          } else {
            // If perfectly aligned with center, default along anchor axis direction
            dx = anchor.pos.x * minOutsideRadiusPx;
            dy = -anchor.pos.y * minOutsideRadiusPx;
          }
          screenX = centerX + dx;
          screenY = centerY + dy;
        }

        // 4. When behind the sphere, reduce transparency rather than hiding
        const isBehind = isOccludedBySphere(camSpaceVec);
        if (isBehind) {
          el.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%) scale(0.88)`;
          el.style.opacity = '0.35';
          el.style.zIndex = '10';
        } else {
          el.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%) scale(1)`;
          el.style.opacity = '1.0';
          el.style.zIndex = '30';
        }
        el.style.visibility = 'visible';
        el.style.pointerEvents = isBehind ? 'none' : 'auto';
      });

      // Project dynamic theta sweep label
      if (thetaLabelRef.current && thetaAnchorRef.current) {
        camSpaceVec.copy(thetaAnchorRef.current).applyEuler(scene.rotation);
        const isBehind = isOccludedBySphere(camSpaceVec);
        tempVec.copy(camSpaceVec).project(camera);
        const screenX = (tempVec.x * 0.5 + 0.5) * width;
        const screenY = (-tempVec.y * 0.5 + 0.5) * height;
        thetaLabelRef.current.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%) ${isBehind ? 'scale(0.88)' : 'scale(1)'}`;
        thetaLabelRef.current.style.opacity = isBehind ? '0.35' : '1.0';
        thetaLabelRef.current.style.visibility = 'visible';
        thetaLabelRef.current.style.zIndex = isBehind ? '12' : '35';
      }

      // Project dynamic phi sweep label
      if (phiLabelRef.current && phiAnchorRef.current) {
        camSpaceVec.copy(phiAnchorRef.current).applyEuler(scene.rotation);
        const isBehind = isOccludedBySphere(camSpaceVec);
        tempVec.copy(camSpaceVec).project(camera);
        const screenX = (tempVec.x * 0.5 + 0.5) * width;
        const screenY = (-tempVec.y * 0.5 + 0.5) * height;
        phiLabelRef.current.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%) ${isBehind ? 'scale(0.88)' : 'scale(1)'}`;
        phiLabelRef.current.style.opacity = isBehind ? '0.35' : '1.0';
        phiLabelRef.current.style.visibility = 'visible';
        phiLabelRef.current.style.zIndex = isBehind ? '12' : '35';
      }
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
  }, [bloch, size, interactive, showSweepArcs, activeSweep]);

  const resetView = () => {
    rotationRef.current = { x: 0.35, y: -0.6 };
  };

  const isEntangled = !bloch || !bloch.is_pure;
  const isThetaSweepActive = (showSweepArcs || activeSweep === 'theta' || activeSweep === 'both') && bloch && bloch.is_pure && bloch.theta > 0.02;
  const isPhiSweepActive = (showSweepArcs || activeSweep === 'phi' || activeSweep === 'both') && bloch && bloch.is_pure && bloch.phi > 0.02;

  return (
    <div className="flex flex-col items-center bg-white rounded-xl border border-dark-200 p-2 sm:p-2.5 shadow-2xs relative w-full">
      {/* Header Info */}
      <div className="w-full flex items-center justify-between mb-1">
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

      {/* 3D Canvas Container with Dynamic Screen-Projected 6-Axis Labels */}
      <div className="relative flex items-center justify-center overflow-visible select-none" style={{ width: size, height: size }}>
        <div
          ref={containerRef}
          className="cursor-grab active:cursor-grabbing"
          style={{ width: size, height: size }}
          aria-label={`3D Bloch Sphere for Qubit ${qubitIndex}. Drag to rotate.`}
        />

        {/* Dynamic 6-Axis Notations outside the sphere — track 3D rotation in real-time */}
        {AXIS_ANCHORS.map((anchor, idx) => (
          <div
            key={anchor.id}
            ref={(el) => {
              labelRefs.current[idx] = el;
            }}
            className="absolute top-0 left-0 pointer-events-none will-change-transform transition-all duration-150"
            style={{ transform: 'translate3d(-999px, -999px, 0)' }}
          >
            <div className={`px-1.5 py-0.5 rounded-md text-xs font-semibold border shadow-xs flex items-center gap-1 notranslate whitespace-nowrap bg-white select-none ${anchor.badgeClass}`} translate="no">
              <span className="font-semibold text-xs">
                <MathRenderer text={anchor.label} />
              </span>
              <span className="font-mono text-[10px] font-medium text-dark-600">({anchor.axis})</span>
            </div>
          </div>
        ))}

        {/* Dynamic Theta (θ) Sweep Arc Label inside the sphere */}
        {isThetaSweepActive && (
          <div
            ref={thetaLabelRef}
            className="absolute top-0 left-0 pointer-events-none will-change-transform z-30"
            style={{ transform: 'translate3d(-999px, -999px, 0)' }}
          >
            <div className="px-1.5 py-0.5 rounded-md bg-indigo-600 text-white text-[11px] font-mono font-medium shadow-xs border border-indigo-400/80 flex items-center gap-1 notranslate" translate="no">
              <span>θ:</span>
              <span>{((bloch!.theta * 180) / Math.PI).toFixed(1)}°</span>
            </div>
          </div>
        )}

        {/* Dynamic Phi (φ) Sweep Arc Label inside the sphere */}
        {isPhiSweepActive && (
          <div
            ref={phiLabelRef}
            className="absolute top-0 left-0 pointer-events-none will-change-transform z-30"
            style={{ transform: 'translate3d(-999px, -999px, 0)' }}
          >
            <div className="px-1.5 py-0.5 rounded-md bg-cyan-600 text-white text-[11px] font-mono font-medium shadow-xs border border-cyan-400/80 flex items-center gap-1 notranslate" translate="no">
              <span>φ:</span>
              <span>{((bloch!.phi * 180) / Math.PI).toFixed(1)}°</span>
            </div>
          </div>
        )}
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
                  <MathRenderer text="$\text{Tr}(\rho^2) < 1.0$" className="font-bold inline-block" />, meaning quantum information is non-locally distributed.
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Coordinates readout table with LaTeX/MathML formatting */}
      {bloch && bloch.is_pure && (
        <div className="w-full mt-3 grid grid-cols-3 gap-2 text-center text-xs notranslate" translate="no">
          <div className="p-2 bg-dark-50 rounded-lg border border-dark-100">
            <span className="text-dark-500 block text-[10px] uppercase font-mono">X / Y / Z</span>
            <span className="font-mono font-bold text-dark-800 text-[11px]">
              ({bloch.x}, {bloch.y}, {bloch.z})
            </span>
          </div>
          <div className="p-2 bg-dark-50 rounded-lg border border-dark-100">
            <span className="text-dark-500 block text-[10px] uppercase font-mono">
              <MathRenderer text="$\theta$ (Polar)" />
            </span>
            <span className="font-mono font-bold text-primary-700 text-[11px]">
              {((bloch.theta * 180) / Math.PI).toFixed(1)}°
            </span>
          </div>
          <div className="p-2 bg-dark-50 rounded-lg border border-dark-100">
            <span className="text-dark-500 block text-[10px] uppercase font-mono">
              <MathRenderer text="$\phi$ (Azimuth)" />
            </span>
            <span className="font-mono font-bold text-primary-700 text-[11px]">
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
