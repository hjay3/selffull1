import React from 'react';
import { CharacterProfile } from '../types/json';

interface JsonViewerProps {
  data: any;
  darkMode: boolean;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, darkMode }) => {
  const createHTMLTree = (obj: any): JSX.Element => {
    return (
      <ul className="json-tree">
        {Object.entries(obj).map(([key, value], index) => (
          <li key={index} className={`hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-1`}>
            {typeof value === "object" && value !== null && !Array.isArray(value) ? (
              <>
                <span className="key">{key}:</span>
                {createHTMLTree(value)}
              </>
            ) : Array.isArray(value) ? (
              <>
                <span className="key">{key}:</span>{' '}
                <span className="array">[{value.join(", ")}]</span>
              </>
            ) : (
              <>
                <span className="key">{key}:</span>{' '}
                <span className="value">{String(value)}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const validateAndParseJSON = (data: any): CharacterProfile | any => {
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return parsed;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return data;
    }
  };

  const parsedData = validateAndParseJSON(data);

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow overflow-auto max-h-[600px]`}>
      <h2 className="text-xl font-bold mb-4">JSON Data</h2>
      <div className="json-viewer">
        {createHTMLTree(parsedData)}
      </div>
    </div>
  );
};

export default JsonViewer;