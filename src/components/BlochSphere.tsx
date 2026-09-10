"use client";

import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type Vector3 = [number, number, number];

export type BlochSphereProps = {
  vector?: Vector3;
  isPreview?: boolean;
};

function SphereScene({ vector }: { vector: Vector3 }) {
  // Map physical Bloch coordinates to Three.js coordinates:
  // Bloch z points upward, and Bloch y points toward negative scene z.
  const { endpoint, length, direction, rotation } = useMemo(() => {
    const endpoint = new THREE.Vector3(
      vector[0],
      vector[2],
      -vector[1]
    );

    // Valid Bloch vectors lie on or inside the unit sphere.
    if (endpoint.length() > 1) {
      endpoint.normalize();
    }

    const length = endpoint.length();

    const direction =
      length > 0.00001
        ? endpoint.clone().normalize()
        : new THREE.Vector3(0, 1, 0);

    const rotation = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction
    );

    return { endpoint, length, direction, rotation };
  }, [vector]);

  const equator = useMemo<Vector3[]>(
    () =>
      Array.from({ length: 97 }, (_, index) => {
        const angle = (index / 96) * Math.PI * 2;

        return [Math.cos(angle), 0, Math.sin(angle)];
      }),
    []
  );

  const arrowHeight = Math.min(0.16, length * 0.35);
  const arrowRadius = Math.min(0.055, length * 0.15);

  const arrowPosition = endpoint
    .clone()
    .addScaledVector(direction, -arrowHeight / 2);

  return (
    <>
      <ambientLight intensity={1.3} />

      <directionalLight
        position={[3, 4, 5]}
        intensity={2}
      />

      {/* Transparent sphere */}
      <mesh>
        <sphereGeometry args={[1, 48, 32]} />
        <meshStandardMaterial
          color="#93c5fd"
          transparent
          opacity={0.1}
          depthWrite={false}
          side={THREE.DoubleSide}
          roughness={0.4}
        />
      </mesh>

      {/* Latitude and longitude grid */}
      <mesh>
        <sphereGeometry args={[1, 20, 12]} />
        <meshBasicMaterial
          color="#93c5fd"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Equator */}
      <Line
        points={equator}
        color="#60a5fa"
        lineWidth={1.3}
      />

      {/* Coordinate axes */}
      <Line
        points={[[-1.25, 0, 0], [1.25, 0, 0]]}
        color="#a3b4cc"
        lineWidth={1}
      />

      <Line
        points={[[0, -1.25, 0], [0, 1.25, 0]]}
        color="#a3b4cc"
        lineWidth={1}
      />

      <Line
        points={[[0, 0, -1.25], [0, 0, 1.25]]}
        color="#a3b4cc"
        lineWidth={1}
      />

      {/* State-vector arrow */}
      {length > 0.00001 && (
        <>
          <Line
            points={[
              [0, 0, 0],
              endpoint.toArray() as Vector3
            ]}
            color="#2563eb"
            lineWidth={3}
          />

          <mesh
            position={arrowPosition}
            quaternion={rotation}
          >
            <coneGeometry args={[arrowRadius, arrowHeight, 24]} />
            <meshStandardMaterial color="#2563eb" />
          </mesh>
        </>
      )}

      {/* State-vector endpoint; at the center for a maximally mixed state */}
      <mesh position={endpoint}>
        <sphereGeometry args={[0.04, 20, 20]} />
        <meshStandardMaterial
          color="#2563eb"
          emissive="#2563eb"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Labels */}
      <AxisLabel position={[0, 1.43, 0]} text="|0⟩" />
      <AxisLabel position={[0, -1.43, 0]} text="|1⟩" />
      <AxisLabel position={[1.4, 0, 0]} text="x" />
      <AxisLabel position={[0, 0, -1.4]} text="y" />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={2.8}
        maxDistance={6}
      />
    </>
  );
}

function AxisLabel({
  position,
  text
}: {
  position: Vector3;
  text: string;
}) {
  return (
    <Html center position={position}>
      <span
        style={{
          color: "#5675a3",
          fontFamily: "Arial, sans-serif",
          fontSize: 13,
          fontWeight: 600,
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none"
        }}
      >
        {text}
      </span>
    </Html>
  );
}

export default function BlochSphere({
  vector = [0, 0, 1],
  isPreview = true
}: BlochSphereProps) {
  return (
    <section
      style={{
        width: "100%",
        overflow: "hidden",
        border: "1px solid #e7edf5",
        borderRadius: 16,
        background: "#ffffff",
        boxShadow: "0 5px 24px rgba(21, 52, 103, 0.04)"
      }}
    >
      <div
        aria-label={`Interactive Bloch sphere. Bloch vector: ${vector.join(", ")}`}
        style={{
          width: "100%",
          height: 320,
          touchAction: "none",
          background:
            "radial-gradient(circle, #eff6ff 0%, #ffffff 75%)"
        }}
      >
        <Canvas
          camera={{
            position: [2.7, 1.8, 3.2],
            fov: 42
          }}
          dpr={[1, 2]}
          fallback={
            <p style={{ padding: 24, color: "#64748b" }}>
              WebGL is required to display the 3D Bloch sphere.
            </p>
          }
        >
          <SphereScene vector={vector} />
        </Canvas>
      </div>

      <div
        style={{
          display: "grid",
          gap: 7,
          padding: "0 16px 22px",
          textAlign: "center",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <strong
          style={{
            fontSize: 13,
            color: "#4d6589"
          }}
        >
          Qubit q0 · Bloch sphere
        </strong>

        <span
          style={{
            fontSize: 11,
            color: "#94a3b8"
          }}
        >
          {isPreview
            ? "Initial state preview · Run your circuit"
            : "Drag to orbit · Scroll to zoom"}
        </span>
      </div>
    </section>
  );
}
