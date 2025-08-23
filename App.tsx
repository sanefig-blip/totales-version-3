
import React, { useState } from 'react';
import { useAppData } from './hooks/useAppData';
import { Header } from './components/Header';
import { StationSection } from './components/StationSection';
import { NomencladorModal } from './components/modals/NomencladorModal';
import { PersonnelModal } from './components/modals/PersonnelModal';
import { ActivityLogModal } from './components/modals/ActivityLogModal';
import type { ModalType } from './types';


const App: React.FC = () => {
  const { state } = useAppData();
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const groupedStations = state.stations.reduce((acc, station) => {
    const zone = station.zone || 'UNIDADES ESPECIALES';
    if (!acc[zone]) {
      acc[zone] = [];
    }
    acc[zone].push(station);
    return acc;
  }, {} as Record<string, typeof state.stations>);

  const renderModal = () => {
    switch (activeModal) {
      case 'nomenclador':
        return <NomencladorModal onClose={() => setActiveModal(null)} />;
      case 'personnel':
        return <PersonnelModal onClose={() => setActiveModal(null)} />;
      case 'logs':
         return <ActivityLogModal onClose={() => setActiveModal(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header onOpenModal={setActiveModal} />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {Object.entries(groupedStations).map(([zone, stations]) => (
            <div key={zone} className="mb-8">
              <h2 className="text-2xl font-bold text-red-500 border-b-2 border-red-500/30 pb-2 mb-4 uppercase">{zone}</h2>
              {stations.map(station => (
                <StationSection 
                  key={station.id} 
                  station={station} 
                  units={state.units.filter(u => u.stationId === station.id)}
                />
              ))}
            </div>
          ))}
        </div>
      </main>
      {renderModal()}
    </div>
  );
};

export default App;
