import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LayoutDashboard, Users, Calendar, DollarSign, TrendingUp, Scissors, Plus, LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const { user, appointments, employees, setEmployees, logout } = useStore();
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeSalary, setNewEmployeeSalary] = useState('');

  // Calculations
  const totalFaturado = appointments.reduce((acc, curr) => acc + (curr.status === 'concluído' ? 2500 : 0), 0); // Simplified calc for demo
  const totalSalarios = employees.reduce((acc, curr) => acc + curr.salario, 0);
  const margemLucro = totalFaturado - (totalSalarios / 30); // Monthly approx
  const totalPedidos = appointments.length;
  
  const handleAddEmployee = () => {
    if (!newEmployeeName || !newEmployeeSalary) return;
    setEmployees([
      ...employees,
      { id: Date.now().toString(), nome: newEmployeeName, salario: Number(newEmployeeSalary) }
    ]);
    setNewEmployeeName('');
    setNewEmployeeSalary('');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-20">
      <header className="p-4 border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 gold-gradient rounded-lg flex items-center justify-center font-bold text-black border border-white/10">
               {user?.nome?.[0]}
             </div>
             <div>
               <h1 className="text-lg font-bold">Olá, {user?.nome}</h1>
               <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1">
                 <TrendingUp className="w-2 h-2" /> Admin Dashboard
               </p>
             </div>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-6">
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-secondary/80">
            <TabsTrigger value="stats" className="text-xs">Dashboard</TabsTrigger>
            <TabsTrigger value="agenda" className="text-xs">Agenda</TabsTrigger>
            <TabsTrigger value="team" className="text-xs">Equipa</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-4">
             <div className="grid grid-cols-2 gap-3">
                <Card className="bg-card border-border/40">
                  <CardHeader className="p-3 pb-0">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Faturamento</p>
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                    <p className="text-xl font-bold gold-text">KZ {totalFaturado.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border/40">
                  <CardHeader className="p-3 pb-0">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Margem</p>
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                    <p className={`text-xl font-bold ${margemLucro >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                      {margemLucro >= 0 ? '+' : ''}{Math.round(margemLucro).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border/40">
                  <CardHeader className="p-3 pb-0">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Pedidos</p>
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                   <p className="text-xl font-bold">{totalPedidos}</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border/40">
                  <CardHeader className="p-3 pb-0">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Serviço +</p>
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                    <p className="text-sm font-bold truncate">Degradê</p>
                  </CardContent>
                </Card>
             </div>

             <Card className="border-border/40 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-sm">Visão Geral Mensal</CardTitle>
                </CardHeader>
                <CardContent className="h-32 flex items-end gap-2 overflow-hidden px-2">
                   {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                     <motion.div 
                        key={i} 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        className="flex-1 gold-gradient rounded-t-sm opacity-80"
                     />
                   ))}
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="agenda">
             <Card className="border-border/40 overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary/50">
                    <TableRow>
                      <TableHead className="text-xs">Cliente</TableHead>
                      <TableHead className="text-xs">Serviço</TableHead>
                      <TableHead className="text-xs text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8 text-xs italic">Nenhum agendamento encontrado</TableCell>
                      </TableRow>
                    ) : (
                      appointments.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="text-xs font-medium py-3">ID: {app.cliente_id.slice(0, 5)}</TableCell>
                          <TableCell className="text-xs py-3">{app.servico}</TableCell>
                          <TableCell className="text-right py-3">
                            <Badge variant="outline" className="text-[10px] h-5">
                              {app.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
             </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Seu Time ({employees.length})</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gold-gradient text-black font-bold">
                       <Plus className="w-4 h-4 mr-1" /> Novo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle>Contratar Funcionário</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                       <div className="space-y-2">
                          <Label>Nome do Profissional</Label>
                          <Input placeholder="Ex: João Barbeiro" value={newEmployeeName} onChange={e => setNewEmployeeName(e.target.value)} />
                       </div>
                       <div className="space-y-2">
                          <Label>Salário Mensal (KZ)</Label>
                          <Input type="number" placeholder="85000" value={newEmployeeSalary} onChange={e => setNewEmployeeSalary(e.target.value)} />
                       </div>
                       <Button className="w-full gold-gradient text-black font-bold" onClick={handleAddEmployee}>ADICIONAR</Button>
                    </div>
                  </DialogContent>
                </Dialog>
             </div>

             <div className="space-y-3">
                {employees.map((emp) => (
                  <Card key={emp.id} className="bg-secondary/40 border-border/30">
                    <CardContent className="p-4 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                             <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{emp.nome}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Barbeiro Sênior</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-medium">KZ {emp.salario.toLocaleString()}</p>
                          <p className="text-[9px] text-muted-foreground italic">p/mês</p>
                       </div>
                    </CardContent>
                  </Card>
                ))}
             </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
