export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EMPLOYEE = 'funcionario',
  CLIENT = 'cliente'
}

export enum AppointmentStatus {
  PENDING = 'pendente',
  IN_PROGRESS = 'em andamento',
  COMPLETED = 'concluído'
}

export interface User {
  id: string;
  nome: string;
  email: string;
  tipo: UserRole;
}

export interface Employee {
  id: string;
  nome: string;
  salario: number;
}

export interface Service {
  id: string;
  nome: string;
  preco: number;
}

export interface Appointment {
  id: string;
  cliente_id: string;
  funcionario_id: string;
  servico: string;
  data: string;
  hora: string;
  status: AppointmentStatus;
}

export interface AppConfig {
  status: 'ativo' | 'bloqueado';
  data_expiracao: string;
  metodos_pagamento: string[];
}

export interface Payment {
  id: string;
  valor: number;
  data: string;
  status: 'pendente' | 'aprovado';
}
