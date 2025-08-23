
export enum UnitStatus {
  InService = 'Para Servicio',
  OutOfService = 'Fuera de Servicio',
  Reserve = 'Reserva',
  OnLoan = 'A Préstamo',
}

export interface Personnel {
  lp: string;
  grade: string;
  lastName:string;
  firstName: string;
}

export interface Unit {
  id: string;
  internalId?: string;
  type: string;
  status: UnitStatus;
  officerInCharge?: Personnel | null;
  personnelCount: number | null;
  stationId: string;
  reason?: string;
}

export interface Station {
  id: string;
  name: string;
  zone?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
}

export interface AppState {
  units: Unit[];
  stations: Station[];
  personnel: Personnel[];
  logs: ActivityLog[];
}

export type AppAction =
  | { type: 'UPDATE_UNIT'; payload: Unit }
  | { type: 'ADD_UNIT'; payload: Unit }
  | { type: 'DELETE_UNIT'; payload: string }
  | { type: 'ADD_LOG'; payload: Omit<ActivityLog, 'id' | 'timestamp'> }
  | { type: 'ADD_PERSONNEL', payload: Personnel };

export type ModalType = 'nomenclador' | 'personnel' | 'internos' | 'logs' | 'pdf' | 'access-codes';