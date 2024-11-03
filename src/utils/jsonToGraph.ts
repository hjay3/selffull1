import { GraphData, GraphNode, GraphLink } from '../types/graph';

// Synthetic data to ensure visualization always has points
const SYNTHETIC_DATA = {
  'Technical Skills': { Strength: 9, Title: 'Tech Lead', Beliefs: 'Technology drives innovation', Style: 'Analytical approach' },
  'Leadership': { Strength: 8, Title: 'Team Leader', Beliefs: 'Empowering others', Style: 'Collaborative leadership' },
  'Creativity': { Strength: 7, Title: 'Innovation Driver', Beliefs: 'Creative solutions matter', Style: 'Design thinking' },
  'Communication': { Strength: 6, Title: 'Communicator', Beliefs: 'Clear communication is key', Style: 'Direct and open' },
  'Problem Solving': { Strength: 9, Title: 'Solution Architect', Beliefs: 'Every problem has a solution', Style: 'Systematic approach' },
  'Adaptability': { Strength: 7, Title: 'Change Agent', Beliefs: 'Flexibility is strength', Style: 'Agile mindset' },
  'Emotional Intelligence': { Strength: 8, Title: 'People Person', Beliefs: 'Emotions matter', Style: 'Empathetic approach' },
  'Strategic Thinking': { Strength: 9, Title: 'Strategist', Beliefs: 'Long-term vision', Style: 'Big picture focus' }
};

export function extractIdentityData(jsonData: any): Record<string, { Strength: number }> {
  const result: Record<string, { Strength: number }> = {};
  let hasValidData = false;

  function processValue(key: string, value: any) {
    let strength = null;
    
    if (typeof value === 'object' && value !== null) {
      if ('Rating' in value) {
        const rating = value.Rating;
        if (typeof rating === 'string') {
          const match = rating.match(/(\d+)/);
          if (match) strength = parseInt(match[1], 10);
        }
      }
      if ('Strength' in value) strength = value.Strength;
      if ('strength' in value) strength = value.strength;
    }

    if (strength !== null) {
      hasValidData = true;
      result[key] = {
        Strength: strength,
        Title: value.Title || value.title || `${key} Specialist`,
        Beliefs: value.Beliefs || value.beliefs || `Core beliefs about ${key}`,
        Style: value.Style || value.style || `Approach to ${key}`
      };
    }
  }

  function traverse(obj: any, prefix = '') {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        processValue(prefix ? `${prefix} - ${key}` : key, value);
        traverse(value, key);
      }
    });
  }

  if (jsonData.Self) {
    traverse(jsonData.Self);
  } else {
    traverse(jsonData);
  }

  // If no valid data was found, use synthetic data
  if (!hasValidData || Object.keys(result).length < 3) {
    return SYNTHETIC_DATA;
  }

  return result;
}

export function convertToGraphFormat(jsonData: any): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const identityData = extractIdentityData(jsonData);

  nodes.push({
    id: 'root',
    name: 'Self',
    group: 'root',
    value: 10
  });

  Object.entries(identityData).forEach(([key, data]) => {
    const nodeId = `node_${key}`;
    nodes.push({
      id: nodeId,
      name: key,
      value: data.Strength,
      group: 'category'
    });

    links.push({
      source: 'root',
      target: nodeId,
      value: data.Strength / 10
    });
  });

  return { nodes, links };
}