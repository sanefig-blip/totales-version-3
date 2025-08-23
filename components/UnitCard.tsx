
import React, { useState } from 'react';
import type { Unit } from '../types';
import { UnitStatus } from '../types';
import { UsersIcon, EditIcon, PlusIcon, ExternalLinkIcon } from './icons';
import { AssignOfficerModal } from './modals/AssignOfficerModal';
import { UpdateStatusModal } from './modals/UpdateStatusModal';


interface UnitCardProps {
  unit: Unit;
}

const getStatusStyles = (status: UnitStatus) => {
  switch (status) {
    case UnitStatus.InService:
      return { dot: 'bg-green-500', text: 'text-green-400', tag: 'bg-green-500/20 text-green-300' };
    case UnitStatus.OutOfService:
      return { dot: 'bg-red-500', text: 'text-red-400', tag: 'bg-red-500/20 text-red-300' };
    case UnitStatus.Reserve:
      return { dot: 'bg-yellow-500', text: 'text-yellow-400', tag: 'bg-yellow-500/20 text-yellow-300' };
    case UnitStatus.OnLoan:
      return { dot: 'bg-blue-500', text: 'text-blue-400', tag: 'bg-blue-500/20 text-blue-300' };
    default:
      return { dot: 'bg-gray-500', text: 'text-gray-400', tag: 'bg-gray-500/20 text-gray-300' };
  }
};


export const UnitCard: React.FC<UnitCardProps> = ({ unit }) => {
    const [isAssignModalOpen, setAssignModalOpen] = useState(false);
    const [isStatusModalOpen, setStatusModalOpen] = useState(false);
    const statusStyles = getStatusStyles(unit.status);

    const hasAssignment = unit.officerInCharge || unit.personnelCount;

    return (
        <>
            <div className="bg-gray-800 rounded-lg shadow-xl flex flex-col h-full border border-gray-700 hover:border-red-500/50 transition-all duration-300">
                <div className="p-4 flex-grow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${statusStyles.dot}`}></span>
                            <h4 className="font-bold text-lg">{unit.id}</h4>
                        </div>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusStyles.tag}`}>{unit.status}</span>
                    </div>
                    <p className="text-sm text-red-400 font-semibold mb-4">{unit.type.toUpperCase()}</p>

                    <div className={`flex-grow p-4 rounded-md min-h-[100px] flex flex-col justify-center ${hasAssignment ? 'bg-gray-700/50' : 'border-2 border-dashed border-gray-600'}`}>
                        {hasAssignment ? (
                            <div>
                                <p className="text-xs text-gray-400">OFICIAL A CARGO</p>
                                <p className="font-semibold text-yellow-400">{unit.officerInCharge ? `${unit.officerInCharge.grade} ${unit.officerInCharge.lastName}` : 'Sin Asignación'}</p>
                                {unit.officerInCharge && <p className="text-xs text-gray-500">LP: {unit.officerInCharge.lp}</p>}
                                
                                <div className="mt-2 flex items-center">
                                    <UsersIcon className="w-5 h-5 text-gray-400 mr-2"/>
                                    <p className="font-bold text-lg">{unit.personnelCount}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">Sin Asignación</p>
                        )}
                    </div>
                </div>
                
                <div className="bg-gray-900/50 p-2 flex justify-around items-center border-t border-gray-700">
                     <IconButton onClick={() => alert("History not implemented")}>
                        <ExternalLinkIcon className="w-5 h-5"/>
                    </IconButton>
                     <IconButton onClick={() => setStatusModalOpen(true)}>
                        <EditIcon className="w-5 h-5"/>
                    </IconButton>
                    {hasAssignment ? (
                        <button onClick={() => setAssignModalOpen(true)} className="w-full mx-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors">
                            <EditIcon className="w-4 h-4" />
                            <span>Editar</span>
                        </button>
                    ) : (
                        <button onClick={() => setAssignModalOpen(true)} className="w-full mx-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors">
                            <PlusIcon className="w-4 h-4" />
                            <span>Asignar</span>
                        </button>
                    )}
                </div>
            </div>
            {isAssignModalOpen && <AssignOfficerModal unit={unit} onClose={() => setAssignModalOpen(false)} />}
            {isStatusModalOpen && <UpdateStatusModal unit={unit} onClose={() => setStatusModalOpen(false)} />}
        </>
    );
};

const IconButton: React.FC<{onClick: () => void, children: React.ReactNode}> = ({onClick, children}) => (
    <button onClick={onClick} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
        {children}
    </button>
)
