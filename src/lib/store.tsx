import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Employee, Service, Appointment, AppConfig, AppointmentStatus } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';
import { supabaseService } from '../services/supabaseService';

interface AppStore {
  user: User | null;
  setUser: (user: User | null) => void;
  allUsers: User[];
  setAllUsers: (users: User[]) => void;
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  services: Service[];
  setServices: (services: Service[]) => void;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
  logout: () => void;
  isLoading: boolean;
}

const initialConfig: AppConfig = {
  status: 'ativo',
  data_expiracao: '2026-12-31',
  metodos_pagamento: ['Multicaixa Express', 'Unitel Money', 'IBAN']
};

const initialServices: Service[] = [
  { id: '1', nome: 'Corte Degradê', preco: 2500, imagem: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80' },
  { id: '2', nome: 'Barba Terapia', preco: 1500, imagem: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80' },
  { id: '3', nome: 'Pezinho e Sobrancelha', preco: 1000, imagem: 'https://images.unsplash.com/photo-1599351431202-1e0f0131899a?w=400&q=80' },
];

const StoreContext = createContext<AppStore | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [config, setConfig] = useState<AppConfig>(initialConfig);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Sync
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await supabaseService.getProfile(session.user.id);
        if (profile) setUser(profile);
      } else {
        setUser(null);
      }
    });

    const initData = async () => {
      setIsLoading(true);
      try {
        const [dbServices, dbEmployees, dbAppointments, dbConfig] = await Promise.all([
          supabaseService.getServices(),
          supabaseService.getEmployees(),
          supabaseService.getAppointments(),
          supabaseService.getConfig(),
        ]);

        if (dbServices.length > 0) setServices(dbServices);
        if (dbEmployees.length > 0) setEmployees(dbEmployees);
        if (dbAppointments.length > 0) setAppointments(dbAppointments);
        if (dbConfig) setConfig(dbConfig);
      } catch (err) {
        console.error('Error loading Supabase data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initData();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Setters with DB persistence
  const updateServices = (newServices: Service[]) => {
    setServices(newServices);
    // Simple logic: if a service is new or changed, upsert it
    newServices.forEach(s => supabaseService.upsertService(s));
  };

  const updateEmployees = (newEmployees: Employee[]) => {
    setEmployees(newEmployees);
    newEmployees.forEach(e => supabaseService.upsertEmployee(e));
  };

  const updateAppointments = (newAppointments: Appointment[]) => {
    setAppointments(newAppointments);
    // Logic for new appointments would go here
  };

  const updateConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    supabaseService.updateConfig(newConfig);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <StoreContext.Provider value={{
      user, setUser,
      allUsers, setAllUsers,
      employees, setEmployees: updateEmployees,
      services, setServices: updateServices,
      appointments, setAppointments: updateAppointments,
      config, setConfig: updateConfig,
      logout,
      isLoading
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
