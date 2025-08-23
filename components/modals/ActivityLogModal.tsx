
import React from 'react';
import { useAppData } from '../../hooks/useAppData';
import { BaseModal } from './BaseModal';

export const ActivityLogModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state } = useAppData();

  return (
    <BaseModal title="Registros de Actividad" onClose={onClose}>
        <div className="mb-4">
             <input
              type="text"
              placeholder="Buscar en registros por usuario o acción..."
              className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
            />
        </div>
      <div className="overflow-y-auto max-h-[60vh]">
        {state.logs.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-gray-700 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3">Fecha y Hora</th>
                <th scope="col" className="px-6 py-3">Usuario</th>
                <th scope="col" className="px-6 py-3">Acción Realizada</th>
              </tr>
            </thead>
            <tbody>
              {state.logs.map(log => (
                <tr key={log.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                  <td className="px-6 py-4">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4">{log.user}</td>
                  <td className="px-6 py-4">{log.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 py-8">No se encontraron registros.</p>
        )}
      </div>
    </BaseModal>
  );
};
