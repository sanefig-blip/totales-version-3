
import React, { useState } from 'react';
import type { Station, Unit } from '../types';
import { UnitCard } from './UnitCard';
import { ChevronDownIcon } from './icons';

interface StationSectionProps {
  station: Station;
  units: Unit[];
}

export const StationSection: React.FC<StationSectionProps> = ({ station, units }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-8 bg-gray-800/50 rounded-lg shadow-md overflow-hidden">
      <button 
        className="w-full text-left p-4 bg-gray-800 hover:bg-gray-700 transition-colors flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold uppercase">{station.name}</h3>
        <ChevronDownIcon className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {units.length > 0 ? (
            units.map(unit => <UnitCard key={unit.id} unit={unit} />)
          ) : (
            <p className="text-gray-400 col-span-full">No hay unidades en esta estación.</p>
          )}
        </div>
      )}
    </div>
  );
};
