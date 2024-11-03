import React, { useState } from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import SupabaseViewer from './components/SupabaseViewer';
import ThemeToggle from './components/ThemeToggle';
import SelfMapVisualization from './components/SelfMapVisualization';

const App = () => {
  const [darkMode, setDarkMode] = useDarkMode();
  const [currentData, setCurrentData] = useState<any>(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const transformDataForSelfMap = (jsonData: any) => {
    if (!jsonData) return {};

    const transformedData: Record<string, { Strength: number }> = {};
    Object.entries(jsonData).forEach(([key, value]: [string, any]) => {
      if (typeof value === 'object' && value !== null) {
        if ('strength' in value || 'Strength' in value) {
          transformedData[key] = {
            Strength: value.strength || value.Strength || Math.floor(Math.random() * 10) + 1,
            Title: value.title || value.Title || `${key} Specialist`,
            Beliefs: value.beliefs || value.Beliefs || `Core beliefs about ${key}`,
            Style: value.style || value.Style || `Approach to ${key}`
          };
        }
      }
    });
    return transformedData;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Identity Map Visualizer</h1>
          <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>

        <div className="grid gap-8">
          <SupabaseViewer 
            darkMode={darkMode} 
            onDataChange={(data) => setCurrentData(data)}
          />
          
          {currentData && (
            <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-6">Identity Map Visualization</h2>
              <SelfMapVisualization 
                data={transformDataForSelfMap(currentData)}
                darkMode={darkMode}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;