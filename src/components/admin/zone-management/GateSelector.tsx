import React from 'react';
import { Gate } from '@/types/parking';

interface GateSelectorProps {
  selectedGate: string;
  gates: Gate[];
  onGateChange: (gateId: string) => void;
}

const GateSelector: React.FC<GateSelectorProps> = React.memo(
  ({ selectedGate, gates, onGateChange }) => (
    <div>
      <label
        htmlFor='gate-select'
        className='block text-sm font-medium text-gray-700 mb-2'
      >
        Select Gate to Manage Zones
      </label>
      <select
        id='gate-select'
        value={selectedGate}
        onChange={(e) => onGateChange(e.target.value)}
        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all focus:outline-none'
        aria-describedby='gate-select-description'
      >
        <option value=''>Choose a gate...</option>
        {gates?.map((gate: Gate) => (
          <option key={gate.id} value={gate.id}>
            {gate.name} - {gate.location}
          </option>
        ))}
      </select>
      <p id='gate-select-description' className='sr-only'>
        Select a gate to view and manage its associated parking zones
      </p>
    </div>
  )
);

GateSelector.displayName = 'GateSelector';

export default GateSelector;
