
import React from 'react';
import type { ModalType } from '../types';
import { UserIcon, UsersIcon, FileTextIcon, HistoryIcon, HashIcon, TruckIcon, RefreshCwIcon, LogOutIcon } from './icons';
import { useAppData } from '../hooks/useAppData';
import { generatePdf } from '../services/pdfGenerator';

interface HeaderProps {
    onOpenModal: (modal: ModalType) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenModal }) => {
    const { state } = useAppData();

    const handlePdfClick = () => {
        generatePdf(state);
    };

    return (
        <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                           <h1 className="text-xl font-bold text-red-500 uppercase flex items-center gap-2">
                                <TruckIcon className="w-8 h-8"/> Unidades de Bomberos
                           </h1>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-2">
                        <HeaderButton icon={<TruckIcon className="w-5 h-5"/>} label="Nomenclador" onClick={() => onOpenModal('nomenclador')} />
                        <HeaderButton icon={<UsersIcon className="w-5 h-5"/>} label="Personal" onClick={() => onOpenModal('personnel')} />
                        <HeaderButton icon={<HashIcon className="w-5 h-5"/>} label="Internos" onClick={() => alert('Internos management not implemented.')} />
                        <HeaderButton icon={<HistoryIcon className="w-5 h-5"/>} label="Registros" onClick={() => onOpenModal('logs')} />
                        <HeaderButton icon={<FileTextIcon className="w-5 h-5"/>} label="PDF" onClick={handlePdfClick} />
                    </div>
                    <div className="flex items-center">
                         <div className="text-right mr-4">
                            <p className="text-sm font-semibold">O.C.O.B.</p>
                            <p className="text-xs text-gray-400">Admin</p>
                        </div>
                        <button className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                            <LogOutIcon className="h-6 w-6"/>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

const HeaderButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
    >
        {icon}
        <span>{label}</span>
    </button>
);
