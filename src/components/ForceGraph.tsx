import React, { useEffect, useRef } from 'react';
import ForceGraph3D from '3d-force-graph';
import * as THREE from 'three';
import { GraphData } from '../types/graph';

interface ForceGraphProps {
  data: GraphData;
  darkMode: boolean;
}

const ForceGraph: React.FC<ForceGraphProps> = ({ data, darkMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous instance
    if (graphRef.current) {
      graphRef.current._destructor();
    }
    containerRef.current.innerHTML = '';

    const Graph = ForceGraph3D()(containerRef.current)
      .width(containerRef.current.clientWidth)
      .height(600)
      .backgroundColor(darkMode ? '#1f2937' : '#ffffff')
      .nodeThreeObject(node => {
        const geometry = new THREE.SphereGeometry(node.group === 'root' ? 4 : 2);
        const material = new THREE.MeshPhongMaterial({
          color: getNodeColor(node as any),
          transparent: true,
          opacity: 0.9,
          shininess: 100
        });
        return new THREE.Mesh(geometry, material);
      })
      .linkWidth(0.5)
      .linkDirectionalParticles(1)
      .linkDirectionalParticleWidth(0.8)
      .linkOpacity(0.3)
      .graphData(data);

    // Add lights
    const scene = Graph.scene();
    scene.add(new THREE.AmbientLight(0xbbbbbb));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

    // Adjust force layout parameters
    Graph.d3Force('link')?.distance(30);
    Graph.d3Force('charge')?.strength(-50);

    // Set initial camera position and controls
    Graph.cameraPosition({ x: 100, y: 100, z: 100 });
    Graph.controls().enableDamping = true;
    Graph.controls().dampingFactor = 0.1;
    Graph.controls().rotateSpeed = 0.5;
    Graph.controls().zoomSpeed = 0.5;

    // Add camera rotation
    let angle = 0;
    const distance = 150;

    const animate = () => {
      if (graphRef.current) {
        angle += 0.0002;
        const x = distance * Math.sin(angle);
        const z = distance * Math.cos(angle);
        Graph.cameraPosition({
          x,
          y: 20 * Math.sin(angle * 2),
          z
        });
        requestAnimationFrame(animate);
      }
    };
    animate();

    graphRef.current = Graph;

    // Cleanup
    return () => {
      if (graphRef.current) {
        graphRef.current._destructor();
      }
    };
  }, [data, darkMode]);

  const getNodeColor = (node: any) => {
    switch (node.group) {
      case 'root':
        return darkMode ? '#f87171' : '#ef4444';
      case 'category':
        return darkMode ? '#34d399' : '#10b981';
      default:
        return darkMode ? '#60a5fa' : '#3b82f6';
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-[600px] rounded-lg border ${
        darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
      }`}
    />
  );
};

export default ForceGraph;