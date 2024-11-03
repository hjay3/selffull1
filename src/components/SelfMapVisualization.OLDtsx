import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { X, ChevronLeft, Info } from 'lucide-react';

interface IdentityData {
  Strength: number;
  Title?: string;
  Beliefs?: string;
  Style?: string;
}

interface SelfMapProps {
  data: Record<string, IdentityData>;
  darkMode?: boolean;
}

const SelfMapVisualization: React.FC<SelfMapProps> = ({ data, darkMode = false }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = 800;
    const height = 800;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    // Create radial scale
    const radiusScale = d3.scaleLinear()
      .domain([0, 10])
      .range([50, Math.min(width, height) / 3]);

    // Create color scale
    const colorScale = d3.scaleOrdinal(d3.schemeSet3);

    // Calculate positions
    const dataArray = Object.entries(data);
    const angleStep = (2 * Math.PI) / dataArray.length;

    // Draw connecting lines
    const lineGroup = svg.append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    dataArray.forEach(([_, value], i) => {
      const angle = i * angleStep;
      const radius = radiusScale(10 - value.Strength);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      lineGroup.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", darkMode ? "#4B5563" : "#D1D5DB")
        .attr("stroke-width", 1);
    });

    // Draw nodes and labels
    const nodeGroup = svg.append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    dataArray.forEach(([key, value], i) => {
      const angle = i * angleStep;
      const radius = radiusScale(10 - value.Strength);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // Draw node
      nodeGroup.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 8)
        .attr("fill", colorScale(key))
        .attr("stroke", darkMode ? "#fff" : "#000")
        .attr("stroke-width", 2);

      // Add label
      nodeGroup.append("text")
        .attr("x", x + (x > 0 ? 15 : -15))
        .attr("y", y)
        .attr("text-anchor", x > 0 ? "start" : "end")
        .attr("dominant-baseline", "middle")
        .attr("fill", darkMode ? "#fff" : "#000")
        .text(key);
    });

  }, [data, darkMode]);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        className={`w-full h-full ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
      />
    </div>
  );
};

export default SelfMapVisualization;