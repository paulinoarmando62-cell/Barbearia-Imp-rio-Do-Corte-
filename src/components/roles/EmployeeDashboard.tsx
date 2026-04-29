import React from 'react';
import { useStore } from '../../lib/store';
import { AppointmentStatus } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Calendar, Clock, User, CheckCircle2, PlayCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function EmployeeDashboard() {
  const { user, appointments, setAppointments, logout } = useStore();

  // For simulation, employee sees all appointments since ID isn't linked to them in this simple mock yet
  const agenda = appointments.sort((a, b) => a.hora.localeCompare(b.hora));

  const updateStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status } : app
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 flex justify-between items-center bg-card border-b border-border">
        <div>
          <h1 className="text-xl font-bold gold-text">Agenda Diária</h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground">
          <LogOut className="w-5 h-5" />
        </Button>
      </header>

      <main className="p-4 max-w-lg mx-auto pb-24">
        {agenda.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 opacity-50">
            <Calendar className="w-12 h-12 text-muted-foreground" />
            <p className="text-sm">Nenhum atendimento agendado para hoje.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {agenda.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-border/40 overflow-hidden ${app.status === AppointmentStatus.COMPLETED ? 'opacity-60 grayscale' : ''}`}>
                  <div className={`h-1 w-full ${
                    app.status === AppointmentStatus.PENDING ? 'bg-amber-500' :
                    app.status === AppointmentStatus.IN_PROGRESS ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border">
                            <Clock className="w-5 h-5 text-primary" />
                         </div>
                         <div>
                            <p className="text-lg font-bold">{app.hora}</p>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter italic">Horário Marcado</p>
                         </div>
                      </div>
                      <Badge 
                        variant={app.status === AppointmentStatus.PENDING ? 'outline' : 'secondary'}
                        className={`text-[10px] px-2 py-0.5 ${
                          app.status === AppointmentStatus.IN_PROGRESS ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/10 border-blue-500/20' : ''
                        }`}
                      >
                        {app.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-5 p-3 rounded-lg bg-secondary/30">
                       <div className="space-y-1">
                          <p className="text-[9px] uppercase font-medium text-muted-foreground">Cliente</p>
                          <p className="text-sm font-bold truncate">Pedro Santos</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] uppercase font-medium text-muted-foreground">Serviço</p>
                          <p className="text-sm font-bold truncate">{app.servico}</p>
                       </div>
                    </div>

                    <div className="flex gap-2">
                       {app.status === AppointmentStatus.PENDING && (
                         <Button className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold" onClick={() => updateStatus(app.id, AppointmentStatus.IN_PROGRESS)}>
                           <PlayCircle className="w-3.5 h-3.5 mr-1.5" /> INICIAR
                         </Button>
                       )}
                       {app.status === AppointmentStatus.IN_PROGRESS && (
                         <Button className="flex-1 h-9 bg-green-600 hover:bg-green-700 text-white text-xs font-bold" onClick={() => updateStatus(app.id, AppointmentStatus.COMPLETED)}>
                           <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> CONCLUIR
                         </Button>
                       )}
                       {app.status === AppointmentStatus.COMPLETED && (
                         <div className="flex-1 flex justify-center items-center h-9 text-green-500 text-xs font-bold gap-2">
                           <CheckCircle2 className="w-4 h-4" /> ATENDIMENTO REALIZADO
                         </div>
                       )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
