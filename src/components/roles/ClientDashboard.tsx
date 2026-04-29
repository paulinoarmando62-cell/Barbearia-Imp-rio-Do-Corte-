import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { AppointmentStatus } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Calendar as CalendarIcon, Clock, Scissors, User, History, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'motion/react';

export default function ClientDashboard() {
  const { user, services, appointments, setAppointments, logout } = useStore();
  const [selectedService, setSelectedService] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);

  const myHistory = appointments.filter(app => app.cliente_id === user?.id);

  const handleBooking = () => {
    if (!selectedService || !date || !time || !user) return;
    
    const newAppointment = {
      id: Math.random().toString(36).substr(2, 9),
      cliente_id: user.id,
      funcionario_id: 'emp1', // Default per demo
      servico: selectedService,
      data: date.toLocaleDateString('pt-BR'),
      hora: time,
      status: AppointmentStatus.PENDING
    };

    setAppointments([...appointments, newAppointment]);
    setIsBooking(false);
    setSelectedService('');
    setTime('');
  };

  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className="min-h-screen bg-[#080808] pb-24 overflow-x-hidden">
      <header className="p-6 bg-gradient-to-b from-card/80 to-transparent flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12" />
        <div className="relative">
          <h1 className="text-2xl font-bold gold-text">Seja bem-vindo,</h1>
          <p className="text-lg font-medium text-white/90">{user?.nome}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground z-10">
          <LogOut className="w-5 h-5" />
        </Button>
      </header>

      <main className="px-6 space-y-8 max-w-lg mx-auto">
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
               <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary/80">Serviços Premium</h2>
               <p className="text-xl font-bold text-white">Pronto para brilhar?</p>
            </div>
            <Dialog open={isBooking} onOpenChange={setIsBooking}>
              <DialogTrigger
                render={
                  <Button className="gold-gradient text-black font-bold h-12 px-6 rounded-full shadow-lg shadow-gold/20">
                    <Scissors className="w-4 h-4 mr-2" /> AGENDAR
                  </Button>
                }
              />
              <DialogContent className="bg-[#121212] border-border/50 text-white p-4 sm:p-6 w-[95%] rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-center gold-text">Novo Agendamento</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  <div className="space-y-3">
                    <label className="text-xs uppercase font-bold text-muted-foreground tracking-widest pl-1">Serviço</label>
                    <Select onValueChange={setSelectedService}>
                      <SelectTrigger className="bg-secondary/50 border-border/50 h-12">
                        <SelectValue placeholder="Escolha um serviço" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {services.map(s => (
                          <SelectItem key={s.id} value={s.nome}>{s.nome} - KZ {s.preco}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs uppercase font-bold text-muted-foreground tracking-widest pl-1">Data</label>
                    <div className="bg-secondary/30 rounded-xl border border-border/30 p-2 flex justify-center">
                      <Calendar 
                        mode="single" 
                        selected={date} 
                        onSelect={setDate} 
                        className="bg-transparent text-white" 
                        disabled={(date) => date < new Date() || date.getDay() === 1} // No Mondays
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs uppercase font-bold text-muted-foreground tracking-widest pl-1">Horário</label>
                    <div className="grid grid-cols-4 gap-2">
                       {times.map(t => (
                         <Button 
                           key={t} 
                           variant={time === t ? 'default' : 'outline'}
                           className={`h-10 text-xs border-border/30 ${time === t ? 'gold-gradient text-black font-bold border-none' : 'hover:bg-primary/10'}`}
                           onClick={() => setTime(t)}
                         >
                           {t}
                         </Button>
                       ))}
                    </div>
                  </div>

                  <Button className="w-full h-14 gold-gradient text-black font-bold text-base rounded-xl mt-4" onClick={handleBooking}>
                    CONFIRMAR AGENDAMENTO
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-4 overflow-x-hidden">
            {services.map((s, i) => (
              <motion.div 
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-[#121212]/50 border-border/30 backdrop-blur-sm group hover:border-primary/50 transition-colors overflow-hidden">
                  <div className="flex">
                    <img src={s.imagem} alt={s.nome} className="w-24 h-24 object-cover" />
                    <CardContent className="p-4 flex flex-1 justify-between items-center">
                      <div className="flex gap-4 items-center">
                        <div>
                            <h3 className="font-bold text-lg">{s.nome}</h3>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">35 - 45 MINUTOS</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-bold">KZ {s.preco.toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
           <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary/80">Meu Histórico</h2>
           </div>
           
           <div className="space-y-4">
              {myHistory.length === 0 ? (
                <Card className="bg-secondary/20 border-dashed border-border py-10">
                   <CardContent className="text-center space-y-2">
                      <p className="text-muted-foreground text-sm">Você ainda não realizou agendamentos.</p>
                      <p className="text-[10px] text-muted-foreground/60">Seus agendamentos aparecerão aqui após confirmados.</p>
                   </CardContent>
                </Card>
              ) : (
                myHistory.sort((a,b) => b.id.localeCompare(a.id)).map((app) => (
                  <Card key={app.id} className="bg-[#121212]/30 border-border/20 overflow-hidden">
                    <div className="flex">
                       <div className={`w-1.5 ${
                         app.status === AppointmentStatus.COMPLETED ? 'bg-green-500/50' : 
                         app.status === AppointmentStatus.IN_PROGRESS ? 'bg-blue-500/50' : 'bg-amber-500/50'
                       }`} />
                       <CardContent className="p-4 flex-1 flex justify-between items-center">
                          <div className="space-y-1">
                             <h4 className="font-bold text-sm">{app.servico}</h4>
                             <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                                <span className="flex items-center gap-1"><CalendarIcon className="w-2.5 h-2.5" /> {app.data}</span>
                                <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {app.hora}</span>
                             </div>
                          </div>
                          <Badge variant="outline" className={`text-[9px] h-5 px-1.5 ${
                            app.status === AppointmentStatus.COMPLETED ? 'text-green-500 border-green-500/30' : ''
                          }`}>
                            {app.status.toUpperCase()}
                          </Badge>
                       </CardContent>
                    </div>
                  </Card>
                ))
              )}
           </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-border/50 p-4 pb-8 z-50">
         <div className="flex justify-around items-center max-w-lg mx-auto">
            <Button variant="ghost" size="sm" className="flex flex-col h-auto gap-1 text-primary">
               <Scissors className="w-5 h-5" />
               <span className="text-[10px] font-bold">Home</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col h-auto gap-1 text-muted-foreground opacity-50">
               <User className="w-5 h-5" />
               <span className="text-[10px] font-bold">Perfil</span>
            </Button>
         </div>
      </nav>
    </div>
  );
}
