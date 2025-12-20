import React from 'react';

interface PhaseSelectorProps {
  selectedPhases: { [key: number]: boolean };
  togglePhase: (phase: number) => void;
}

const PhaseSelector: React.FC<PhaseSelectorProps> = ({ selectedPhases, togglePhase }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Select Phases to Monitor</h3>
        <div className="flex gap-3">
          {[1, 2, 3].map((phase) => (
            <label
              key={phase}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPhases[phase]
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedPhases[phase]}
                onChange={() => togglePhase(phase)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-medium">Phase {phase}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhaseSelector;