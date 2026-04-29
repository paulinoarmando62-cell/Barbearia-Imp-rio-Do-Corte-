import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, UserRole, Employee, Service, Appointment, AppConfig } from '../types';

export const supabaseService = {
  // Config
  async getConfig(): Promise<AppConfig | null> {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('config')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching config:', error);
      return null;
    }
    return data as AppConfig;
  },

  async updateConfig(config: AppConfig) {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('config')
      .update(config)
      .eq('id', 1); // Assuming single config row
    
    if (error) console.error('Error updating config:', error);
  },

  // Services
  async getServices(): Promise<Service[]> {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('services')
      .select('*');
    
    if (error) {
      console.error('Error fetching services:', error);
      return [];
    }
    return data as Service[];
  },

  async upsertService(service: Service) {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('services')
      .upsert(service);
    
    if (error) console.error('Error upserting service:', error);
  },

  async deleteService(id: string) {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) console.error('Error deleting service:', error);
  },

  // Employees
  async getEmployees(): Promise<Employee[]> {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('employees')
      .select('*');
    
    if (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
    return data as Employee[];
  },

  async upsertEmployee(employee: Employee) {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('employees')
      .upsert(employee);
    
    if (error) console.error('Error upserting employee:', error);
  },

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
      .from('appointments')
      .select('*');
    
    if (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
    return data as Appointment[];
  },

  async addAppointment(appointment: Appointment) {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('appointments')
      .insert(appointment);
    
    if (error) console.error('Error adding appointment:', error);
  },

  async updateAppointment(id: string, updates: Partial<Appointment>) {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id);
    
    if (error) console.error('Error updating appointment:', error);
  },

  // Profiles / Users
  async getProfile(id: string): Promise<User | null> {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as User;
  }
};
