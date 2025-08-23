
import React, { createContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, AppAction, Unit } from '../types';
import { initialData } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'fireDeptAppState';

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'UPDATE_UNIT':
      return {
        ...state,
        units: state.units.map(unit =>
          unit.id === action.payload.id ? action.payload : unit
        ),
      };
    case 'ADD_UNIT':
        return {
            ...state,
            units: [...state.units, action.payload]
        }
    case 'DELETE_UNIT':
        return {
            ...state,
            units: state.units.filter(unit => unit.id !== action.payload)
        }
    case 'ADD_LOG':
      return {
        ...state,
        logs: [
          { 
            id: new Date().toISOString(), 
            timestamp: new Date().toISOString(), 
            ...action.payload 
          }, 
          ...state.logs
        ],
      };
    case 'ADD_PERSONNEL':
      if (state.personnel.some(p => p.lp === action.payload.lp)) {
        alert(`Error: El LP ${action.payload.lp} ya existe.`);
        return state;
      }
      return {
        ...state,
        personnel: [...state.personnel, action.payload].sort((a,b) => a.lastName.localeCompare(b.lastName)),
      };
    default:
      return state;
  }
};

const getInitialState = (): AppState => {
  try {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error("Failed to parse state from localStorage", error);
  }
  return initialData;
};

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: getInitialState(),
  dispatch: () => null,
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState());

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};