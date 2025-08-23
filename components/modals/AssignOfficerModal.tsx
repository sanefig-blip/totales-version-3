
import React, { useState, useMemo } from 'react';
import type { Unit, Personnel } from '../../types';
import { useAppData } from '../../hooks/useAppData';
import { BaseModal } from './BaseModal';

interface AssignOfficerModalProps {
  unit: Unit;
  onClose: () => void;
}

export const AssignOfficerModal: React.FC<AssignOfficerModalProps> = ({ unit, onClose }) => {
  const { state, dispatch } = useAppData();
  const [selectedOfficer, setSelectedOfficer] = useState<Personnel | null>(unit.officerInCharge || null);
  const [personnelCount, setPersonnelCount] = useState<string>(unit.personnelCount?.toString() || '');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPersonnel = useMemo(() => {
    if (!searchTerm) return state.personnel;
    const lowercasedFilter = searchTerm.toLowerCase();
    return state.personnel.filter(p =>
      p.firstName.toLowerCase().includes(lowercasedFilter) ||
      p.lastName.toLowerCase().includes(lowercasedFilter) ||
      p.lp.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm, state.personnel]);

  const handleSave = () => {
    const updatedUnit = {
      ...unit,
      officerInCharge: selectedOfficer,
      personnelCount: personnelCount ? parseInt(personnelCount, 10) : null,
    };
    dispatch({ type: 'UPDATE_UNIT', payload: updatedUnit });
    dispatch({ type: 'ADD_LOG', payload: { user: 'Admin', action: `Assigned officer to unit ${unit.id}` } });
    onClose();
  };
  
  const handleClear = () => {
      setSelectedOfficer(null);
      setPersonnelCount('');
  }

  return (
    <BaseModal title={`Asignar Oficial - Unidad: ${unit.id}`} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <label htmlFor="officer" className="block text-sm font-medium text-gray-300 mb-1">Oficial a Cargo</label>
          <input
            type="text"
            id="officer"
            placeholder="Buscar Oficial (por Nombre, Apellido o LP)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
          />
          {searchTerm && (
            <div className="mt-2 max-h-40 overflow-y-auto border border-gray-600 rounded-md">
              {filteredPersonnel.map(p => (
                <div
                  key={p.lp}
                  onClick={() => {
                    setSelectedOfficer(p);
                    setSearchTerm('');
                  }}
                  className="p-2 hover:bg-gray-700 cursor-pointer"
                >
                  {p.lastName}, {p.firstName} ({p.grade}) - LP: {p.lp}
                </div>
              ))}
            </div>
          )}
           {selectedOfficer && (
             <div className="mt-2 p-3 bg-blue-900/50 border border-blue-500/50 rounded-md">
                <p className="font-bold">{selectedOfficer.lastName}, {selectedOfficer.firstName}</p>
                <p className="text-sm text-gray-400">{selectedOfficer.grade} - LP: {selectedOfficer.lp}</p>
             </div>
           )}
        </div>

        <div>
          <label htmlFor="personnel-count" className="block text-sm font-medium text-gray-300 mb-1">Dotación de la Unidad</label>
          <input
            type="number"
            id="personnel-count"
            placeholder="Cantidad Total de Personal"
            value={personnelCount}
            onChange={(e) => setPersonnelCount(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <button onClick={handleClear} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 transition-colors">Limpiar</button>
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors font-semibold">Guardar Cambios</button>
        </div>
      </div>
    </BaseModal>
  );
};
