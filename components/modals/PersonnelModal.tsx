
import React, { useState } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { BaseModal } from './BaseModal';
import { PlusIcon } from '../icons';

export const PersonnelModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state, dispatch } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [newPersonnel, setNewPersonnel] = useState({ lp: '', grade: '', lastName: '', firstName: '' });

  const filteredPersonnel = state.personnel.filter(p =>
    p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.lp.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPersonnel({ ...newPersonnel, [e.target.name]: e.target.value });
  };

  const handleAddPersonnel = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPersonnel.lp && newPersonnel.lastName && newPersonnel.firstName && newPersonnel.grade) {
      dispatch({ type: 'ADD_PERSONNEL', payload: newPersonnel });
      dispatch({ type: 'ADD_LOG', payload: { user: 'Admin', action: `Added personnel: ${newPersonnel.lastName}, ${newPersonnel.firstName}` } });
      setNewPersonnel({ lp: '', grade: '', lastName: '', firstName: '' });
    } else {
      alert('Por favor, complete todos los campos.');
    }
  };

  return (
    <BaseModal title="Listado de Personal" onClose={onClose}>
      <input
        type="text"
        placeholder="Buscar personal..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-red-500 focus:border-red-500"
      />
      <div className="overflow-y-auto max-h-[50vh]">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3">LP</th>
              <th scope="col" className="px-6 py-3">Grado</th>
              <th scope="col" className="px-6 py-3">Apellido</th>
              <th scope="col" className="px-6 py-3">Nombre</th>
            </tr>
          </thead>
          <tbody>
            {filteredPersonnel.map(person => (
              <tr key={person.lp + person.lastName} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-white">{person.lp}</td>
                <td className="px-6 py-4">{person.grade}</td>
                <td className="px-6 py-4">{person.lastName}</td>
                <td className="px-6 py-4">{person.firstName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-700">
        <h3 className="text-lg font-semibold mb-3 text-white">Agregar Nuevo Personal</h3>
        <form onSubmit={handleAddPersonnel} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input name="lp" value={newPersonnel.lp} onChange={handleInputChange} placeholder="LP" className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-red-500 focus:border-red-500" />
          <input name="grade" value={newPersonnel.grade} onChange={handleInputChange} placeholder="Grado" className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-red-500 focus:border-red-500" />
          <input name="lastName" value={newPersonnel.lastName} onChange={handleInputChange} placeholder="Apellido" className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-red-500 focus:border-red-500" />
          <input name="firstName" value={newPersonnel.firstName} onChange={handleInputChange} placeholder="Nombre" className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 focus:ring-red-500 focus:border-red-500" />
          <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors font-semibold">
             <PlusIcon className="w-5 h-5"/>
             <span>Agregar</span>
          </button>
        </form>
      </div>
    </BaseModal>
  );
};