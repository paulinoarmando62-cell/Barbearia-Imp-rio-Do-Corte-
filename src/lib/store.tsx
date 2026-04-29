import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Employee, Service, Appointment, AppConfig, AppointmentStatus } from '../types';

interface AppStore {
  user: User | null;
  setUser: (user: User | null) => void;
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  services: Service[];
  setServices: (services: Service[]) => void;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
  logout: () => void;
}

const initialConfig: AppConfig = {
  status: 'ativo',
  data_expiracao: '2026-12-31',
  metodos_pagamento: ['Multicaixa Express', 'Unitel Money', 'IBAN']
};

const initialServices: Service[] = [
  { id: '1', nome: 'Corte Degradê', preco: 2500 },
  { id: '2', nome: 'Barba Terapia', preco: 1500 },
  { id: '3', nome: 'Pezinho e Sobrancelha', preco: 1000 },
  { id: '4', nome: 'Corte + Barba', preco: 3500 },
];

const initialEmployees: Employee[] = [
  { id: 'emp1', nome: 'Mestre Carlos', salario: 85000 },
  { id: 'emp2', nome: 'Barbeiro Silva', salario: 70000 },
];

const StoreContext = createContext<AppStore | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('services');
    return saved ? JSON.parse(saved) : initialServices;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('appointments');
    return saved ? JSON.parse(saved) : [];
  });

  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('config');
    return saved ? JSON.parse(saved) : initialConfig;
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('config', JSON.stringify(config));
  }, [config]);

  const logout = () => setUser(null);

  return (
    <StoreContext.Provider value={{
      user, setUser,
      employees, setEmployees,
      services, setServices,
      appointments, setAppointments,
      config, setConfig,
      logout
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
