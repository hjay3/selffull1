import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import ForceGraph from './ForceGraph';
import JsonViewer from './JsonViewer';
import SelfMapVisualization from './SelfMapVisualization';
import { convertToGraphFormat, extractIdentityData } from '../utils/jsonToGraph';
import { CharacterProfile } from '../types/json';

interface Record {
  id: number;
  json_content: CharacterProfile | any;
  created_at?: string;
}

interface SupabaseViewerProps {
  darkMode: boolean;
  onDataChange?: (data: any) => void;
}

const SupabaseViewer: React.FC<SupabaseViewerProps> = ({ darkMode, onDataChange }) => {
  const [records, setRecords] = useState<Record[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [graphData, setGraphData] = useState<any>(null);
  const [identityData, setIdentityData] = useState<any>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('selfmapsbench')
        .select('id, json_content, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRecords(data || []);
      if (data?.[0]) {
        const graphData = convertToGraphFormat(data[0].json_content);
        const identityData = extractIdentityData(data[0].json_content);
        setGraphData(graphData);
        setIdentityData(identityData);
        if (onDataChange) {
          onDataChange(data[0].json_content);
        }
      }
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % records.length;
    setCurrentIndex(newIndex);
    const graphData = convertToGraphFormat(records[newIndex].json_content);
    const identityData = extractIdentityData(records[newIndex].json_content);
    setGraphData(graphData);
    setIdentityData(identityData);
    if (onDataChange) {
      onDataChange(records[newIndex].json_content);
    }
  };

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + records.length) % records.length;
    setCurrentIndex(newIndex);
    const graphData = convertToGraphFormat(records[newIndex].json_content);
    const identityData = extractIdentityData(records[newIndex].json_content);
    setGraphData(graphData);
    setIdentityData(identityData);
    if (onDataChange) {
      onDataChange(records[newIndex].json_content);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (records.length > 0) {
      const index = records.findIndex(record => 
        JSON.stringify(record.json_content)
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      );
      if (index !== -1) {
        setCurrentIndex(index);
        const graphData = convertToGraphFormat(records[index].json_content);
        const identityData = extractIdentityData(records[index].json_content);
        setGraphData(graphData);
        setIdentityData(identityData);
        if (onDataChange) {
          onDataChange(records[index].json_content);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>
        <p>{error}</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400">
        <p>No records found</p>
      </div>
    );
  }

  const currentRecord = records[currentIndex];

  return (
    <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Record {currentRecord.id}</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search in JSON..."
              value={searchTerm}
              onChange={handleSearch}
              className={`pl-10 pr-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePrevious}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {currentIndex + 1} of {records.length}
            </span>
            <button 
              onClick={handleNext}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Created: {new Date(currentRecord.created_at!).toLocaleString()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <JsonViewer data={currentRecord.json_content} darkMode={darkMode} />
        <div className="space-y-6">
          <ForceGraph data={graphData} darkMode={darkMode} />
          {identityData && (
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className="text-lg font-semibold mb-4">Identity Map</h3>
              <SelfMapVisualization data={identityData} darkMode={darkMode} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupabaseViewer;