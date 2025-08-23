
import React, { useState } from 'react';
import type { Unit } from '../../types';
import { UnitStatus } from '../../types';
import { useAppData } from '../../hooks/useAppData';
import { BaseModal } from './BaseModal';

interface UpdateStatusModalProps {
  unit: Unit;
  onClose: () => void;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ unit, onClose }) => {
  const { dispatch } = useAppData();
  const [selectedStatus, setSelectedStatus] = useState<UnitStatus>(unit.status);
  const [reason, setReason] = useState(unit.reason || '');

  const handleSave = () => {
    const updatedUnit = {
      ...unit,
      status: selectedStatus,
      reason: selectedStatus === UnitStatus.OutOfService ? reason : undefined,
    };
    dispatch({ type: 'UPDATE_UNIT', payload: updatedUnit });
    dispatch({ type: 'ADD_LOG', payload: { user: 'Admin', action: `Updated status for unit ${unit.id} to ${selectedStatus}` } });
    onClose();
  };

  const statusOptions = Object.values(UnitStatus);

  return (
    <BaseModal title={`Actualizar Estado - Unidad: ${unit.id}`} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Seleccionar Nuevo Estado</label>
          <div className="space-y-2">
            {statusOptions.map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`w-full text-left p-3 rounded-md border-2 transition-colors ${selectedStatus === status ? 'bg-red-800 border-red-500' : 'bg-gray-700 border-gray-600 hover:border-gray-500'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {selectedStatus === UnitStatus.OutOfService && (
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-1">Motivo (Opcional)</label>
            <input
              type="text"
              id="reason"
              placeholder="Ej: Falta de personal, Problema mecánico"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors font-semibold">Guardar Cambios</button>
        </div>
      </div>
    </BaseModal>
  );
};
