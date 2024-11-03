import React, { useEffect, useRef, useState } from 'react';
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
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const createVisualization = (containerRef: React.RefObject<HTMLDivElement>, data: Record<string, IdentityData>) => {
    if (!containerRef.current || !data) return;

    // Clear previous content
    d3.select(containerRef.current).selectAll('*').remove();

    const margin = { top: 60, right: 60, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create SVG
    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Create scales
    const radiusScale = d3.scaleLinear()
      .domain([1, 10])  // Strength range
      .range([Math.min(width, height) / 2 - 50, 0]);  // 10 at center, 1 at edge

    // Create grid
    const gridRadius = Math.min(width, height) / 2 - 50;
    const gridCircles = [2, 4, 6, 8, 10];  // Strength levels for grid

    // Add grid circles
    gridCircles.forEach(strength => {
      svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', radiusScale(strength))
        .attr('fill', 'none')
        .attr('stroke', darkMode ? '#374151' : '#E5E7EB')
        .attr('stroke-dasharray', '2,2');

      // Add strength labels
      svg.append('text')
        .attr('x', centerX)
        .attr('y', centerY - radiusScale(strength))
        .attr('dy', -5)
        .attr('text-anchor', 'middle')
        .attr('fill', darkMode ? '#9CA3AF' : '#6B7280')
        .attr('font-size', '10px')
        .text(strength.toString());
    });

    // Add axes
    const axes = [0, 45, 90, 135, 180, 225, 270, 315];
    axes.forEach(angle => {
      const radians = (angle * Math.PI) / 180;
      svg.append('line')
        .attr('x1', centerX)
        .attr('y1', centerY)
        .attr('x2', centerX + Math.cos(radians) * gridRadius)
        .attr('y2', centerY + Math.sin(radians) * gridRadius)
        .attr('stroke', darkMode ? '#374151' : '#E5E7EB')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2,2');
    });

    // Process and plot data points
    const dataArray = Object.entries(data);
    const angleStep = (2 * Math.PI) / dataArray.length;
    const colorScale = d3.scaleOrdinal(d3.schemeSet3);

    dataArray.forEach(([key, value], i) => {
      const angle = i * angleStep;
      const radius = radiusScale(value.Strength);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Create point group
      const point = svg.append('g')
        .attr('class', 'point')
        .style('cursor', 'pointer');

      // Add glow effect
      point.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 15)
        .attr('fill', colorScale(key))
        .attr('opacity', 0.2);

      // Add main point
      point.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 8)
        .attr('fill', colorScale(key))
        .attr('stroke', darkMode ? '#fff' : '#000')
        .attr('stroke-width', 2);

      // Add label
      const label = point.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', -15)
        .attr('text-anchor', 'middle')
        .attr('fill', darkMode ? '#fff' : '#000')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text(key);

      // Add interaction
      point
        .on('mouseover', (event) => {
          // Enlarge point
          point.select('circle:nth-child(2)')
            .transition()
            .duration(200)
            .attr('r', 10);

          // Show tooltip
          const tooltip = d3.select(containerRef.current)
            .append('div')
            .attr('class', `absolute bg-${darkMode ? 'gray-800' : 'white'} p-4 rounded-lg shadow-lg border border-${darkMode ? 'gray-700' : 'gray-200'} z-50`)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`);

          tooltip.html(`
            <div class="space-y-2">
              <div class="font-bold">${key}</div>
              <div>Strength: ${value.Strength}/10</div>
              ${value.Title ? `<div class="text-sm text-gray-500">${value.Title}</div>` : ''}
              ${value.Beliefs ? `<div class="text-sm text-gray-500">${value.Beliefs}</div>` : ''}
              ${value.Style ? `<div class="text-sm text-gray-500">${value.Style}</div>` : ''}
            </div>
          `);
        })
        .on('mouseout', () => {
          point.select('circle:nth-child(2)')
            .transition()
            .duration(200)
            .attr('r', 8);
          
          d3.selectAll('.absolute').remove();
        })
        .on('click', () => {
          setSelectedElement(key);
        });
    });
  };

  useEffect(() => {
    createVisualization(chartRef, data);
  }, [data, darkMode]);

  return (
    <div className="space-y-6">
      <div className="relative w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Info size={20} />
        </button>

        {showInfo && (
          <div className="absolute top-14 right-4 w-64 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10 text-sm">
            <h3 className="font-bold mb-2">How to Use</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Hover over points to see details</li>
              <li>• Click points to explore details</li>
              <li>• Distance from center shows strength (10 at center, 1 at edge)</li>
              <li>• Colors distinguish different aspects</li>
            </ul>
          </div>
        )}

        <div
          ref={chartRef}
          className="w-full"
          style={{ minHeight: '700px' }}
        />
      </div>

      {selectedElement && (
        <div className="relative w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-fadeIn">
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <button
              onClick={() => setSelectedElement(null)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
            >
              <ChevronLeft size={16} />
              Back to Overview
            </button>
          </div>
          <button
            onClick={() => setSelectedElement(null)}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">{selectedElement} Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Strength</h3>
                <p className="text-gray-600 dark:text-gray-300">{data[selectedElement].Strength}/10</p>
              </div>
              {data[selectedElement].Title && (
                <div>
                  <h3 className="text-lg font-semibold">Title</h3>
                  <p className="text-gray-600 dark:text-gray-300">{data[selectedElement].Title}</p>
                </div>
              )}
              {data[selectedElement].Beliefs && (
                <div>
                  <h3 className="text-lg font-semibold">Beliefs</h3>
                  <p className="text-gray-600 dark:text-gray-300">{data[selectedElement].Beliefs}</p>
                </div>
              )}
              {data[selectedElement].Style && (
                <div>
                  <h3 className="text-lg font-semibold">Style</h3>
                  <p className="text-gray-600 dark:text-gray-300">{data[selectedElement].Style}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfMapVisualization;