import React, { useState } from 'react';
import { useAppData } from '../../hooks/useAppData';
import type { Unit } from '../../types';
import { UnitStatus } from '../../types';
import { BaseModal } from './BaseModal';
import { PlusIcon, EditIcon, TrashIcon } from '../icons';

export const NomencladorModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state, dispatch } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UnitStatus | 'all'>('all');

  const filteredUnits = state.units.filter(unit => {
    const statusMatch = statusFilter === 'all' || unit.status === statusFilter;
    if (!statusMatch) {
      return false;
    }

    if (!searchTerm) {
      return true;
    }

    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const station = state.stations.find(s => s.id === unit.stationId);
    const stationName = station ? station.name.toLowerCase() : '';

    return (
      unit.id.toLowerCase().includes(lowercasedSearchTerm) ||
      (unit.internalId && unit.internalId.toLowerCase().includes(lowercasedSearchTerm)) ||
      unit.type.toLowerCase().includes(lowercasedSearchTerm) ||
      stationName.includes(lowercasedSearchTerm)
    );
  });
    
  const handleAddUnit = () => {
    const newId = prompt("Ingrese el ID de la nueva unidad (ej. IV-1234):");
    if (newId && !state.units.find(u => u.id === newId)) {
        const newUnit: Unit = {
            id: newId,
            type: "Tipo Desconocido",
            status: UnitStatus.Reserve,
            stationId: state.stations[0]?.id || '',
            personnelCount: null,
            officerInCharge: null
        };
        dispatch({type: 'ADD_UNIT', payload: newUnit});
        dispatch({ type: 'ADD_LOG', payload: { user: 'Admin', action: `Added new unit ${newId}` } });
    } else if (newId) {
        alert("Una unidad con ese ID ya existe.");
    }
  };

  const handleDeleteUnit = (unitId: string) => {
    if (window.confirm(`¿Está seguro que desea eliminar la unidad ${unitId}?`)) {
      dispatch({ type: 'DELETE_UNIT', payload: unitId });
      dispatch({ type: 'ADD_LOG', payload: { user: 'Admin', action: `Deleted unit ${unitId}` } });
    }
  };


  return (
    <BaseModal title="Nomenclador de Unidades" onClose={onClose}>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-grow flex-wrap md:flex-nowrap">
          <input
            type="text"
            placeholder="Buscar por ID, tipo, estación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-red-500 focus:border-red-500 min-w-[200px]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UnitStatus | 'all')}
            className="bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-red-500 focus:border-red-500 w-full md:w-auto"
          >
            <option value="all">Todos los Estados</option>
            {Object.values(UnitStatus).map(status => (
                <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <button onClick={handleAddUnit} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors font-semibold">
          <PlusIcon className="w-5 h-5"/>
          <span>Agregar Unidad</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">Nombre (ID)</th>
              <th scope="col" className="px-6 py-3">N° Interno</th>
              <th scope="col" className="px-6 py-3">Tipo</th>
              <th scope="col" className="px-6 py-3">Estación / Zona</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUnits.map(unit => {
              const station = state.stations.find(s => s.id === unit.stationId);
              return (
                <tr key={unit.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-white">{unit.id}</td>
                  <td className="px-6 py-4">{unit.internalId || '-'}</td>
                  <td className="px-6 py-4">{unit.type}</td>
                  <td className="px-6 py-4">{station?.name || 'Desconocida'}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button className="text-blue-400 hover:text-blue-300"><EditIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleDeleteUnit(unit.id)} className="text-red-500 hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </BaseModal>
  );
};