import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LayoutDashboard, Users, Calendar, DollarSign, TrendingUp, Scissors, Plus, LogOut, Trash2, CreditCard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const { user, appointments, employees, setEmployees, services, setServices, config, setConfig, logout } = useStore();
  
  // States for Employees
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeSalary, setNewEmployeeSalary] = useState('');

  // States for Services
  const [svcName, setSvcName] = useState('');
  const [svcPrice, setSvcPrice] = useState('');
  const [svcImg, setSvcImg] = useState('');

  // Calculations
  const totalFaturado = appointments.reduce((acc, curr) => acc + (curr.status === 'concluído' ? 2500 : 0), 0);
  const totalSalarios = employees.reduce((acc, curr) => acc + curr.salario, 0);
  const margemLucro = totalFaturado - (totalSalarios / 30);
  
  const handleAddEmployee = () => {
    if (!newEmployeeName || !newEmployeeSalary) return;
    setEmployees([...employees, { id: Date.now().toString(), nome: newEmployeeName, salario: Number(newEmployeeSalary) }]);
    setNewEmployeeName(''); setNewEmployeeSalary('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSvcImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddService = () => {
    if (!svcName || !svcPrice) return;
    setServices([...services, { 
      id: Date.now().toString(), 
      nome: svcName, 
      preco: Number(svcPrice), 
      imagem: svcImg || 'https://images.unsplash.com/photo-1512690117789-8fe1df0f4f0a?w=400&q=80' 
    }]);
    setSvcName(''); setSvcPrice(''); setSvcImg('');
  };

  const removeService = (id: string) => setServices(services.filter(s => s.id !== id));

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-20">
      <header className="p-4 border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 gold-gradient rounded-lg flex items-center justify-center font-bold text-black border border-white/10">
               {user?.nome?.[0]}
             </div>
             <div>
               <h1 className="text-lg font-bold">Gerência Premium</h1>
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
            <TabsTrigger value="stats" className="text-[10px]">Geral</TabsTrigger>
            <TabsTrigger value="services" className="text-[10px]">Serviços</TabsTrigger>
            <TabsTrigger value="team" className="text-[10px]">Time</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-4">
             <div className="grid grid-cols-2 gap-3">
                <Card className="bg-card border-border/40">
                  <CardHeader className="p-3 pb-0"><p className="text-[10px] uppercase font-bold text-muted-foreground">Faturamento</p></CardHeader>
                  <CardContent className="p-3 pt-1"><p className="text-xl font-bold gold-text">KZ {totalFaturado.toLocaleString()}</p></CardContent>
                </Card>
                <Card className="bg-card border-border/40">
                  <CardHeader className="p-3 pb-0"><p className="text-[10px] uppercase font-bold text-muted-foreground">Margem</p></CardHeader>
                  <CardContent className="p-3 pt-1"><p className={`text-xl font-bold ${margemLucro >= 0 ? 'text-green-500' : 'text-destructive'}`}>{margemLucro >= 0 ? '+' : ''}{Math.round(margemLucro).toLocaleString()}</p></CardContent>
                </Card>
             </div>
             
             <Card className="border-border/40 bg-card/50 overflow-hidden">
                <CardHeader><CardTitle className="text-sm">Agendamentos Recentes</CardTitle></CardHeader>
                <Table>
                  <TableBody>
                    {appointments.slice(0, 5).map(app => (
                      <TableRow key={app.id}>
                        <TableCell className="text-xs p-3">Cliente ID: {app.cliente_id.slice(0,4)}</TableCell>
                        <TableCell className="text-xs p-3">{app.servico}</TableCell>
                        <TableCell className="text-right p-3"><Badge variant="outline" className="text-[9px]">{app.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
             </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Catálogo</h3>
                <Dialog>
                  <DialogTrigger render={<Button size="sm" className="h-8 gold-gradient text-black font-bold"> <Plus className="w-4 h-4 mr-1" /> Novo </Button>} />
                  <DialogContent className="bg-card border-border">
                    <DialogHeader><DialogTitle>Novo Serviço</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                       <div className="space-y-2"><Label>Nome do Serviço</Label><Input placeholder="Ex: Degradê Americano" value={svcName} onChange={e => setSvcName(e.target.value)} /></div>
                       <div className="space-y-2"><Label>Preço (KZ)</Label><Input type="number" placeholder="2500" value={svcPrice} onChange={e => setSvcPrice(e.target.value)} /></div>
                       <div className="space-y-2">
                          <Label>Imagem do Serviço</Label>
                          <div className="flex items-center gap-4">
                            {svcImg && <img src={svcImg} className="w-12 h-12 rounded object-cover" alt="Preview" />}
                            <Input type="file" accept="image/*" onChange={handleImageUpload} className="h-9 text-xs py-1" />
                          </div>
                       </div>
                       <Button className="w-full gold-gradient text-black font-bold" onClick={handleAddService}>SALVAR SERVIÇO</Button>
                    </div>
                  </DialogContent>
                </Dialog>
             </div>
             <div className="grid grid-cols-1 gap-3">
                {services.map(s => (
                  <Card key={s.id} className="bg-secondary/20 border-border/20 overflow-hidden">
                    <div className="flex">
                       <img src={s.imagem} alt={s.nome} className="w-20 h-20 object-cover opacity-80" />
                       <div className="p-3 flex-1 flex justify-between items-center">
                          <div><p className="text-sm font-bold">{s.nome}</p><p className="text-xs text-primary font-bold">KZ {s.preco.toLocaleString()}</p></div>
                          <Button variant="ghost" size="icon" onClick={() => removeService(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                       </div>
                    </div>
                  </Card>
                ))}
             </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Time ({employees.length})</h3>
                <Button size="sm" className="h-8 gold-gradient text-black font-bold" onClick={() => {}}> <Plus className="w-4 h-4 mr-1" /> Funcionário </Button>
             </div>
             <div className="space-y-3">
                {employees.map((emp) => (
                  <Card key={emp.id} className="bg-secondary/40 border-border/30">
                    <CardContent className="p-4 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30"><Users className="w-5 h-5 text-primary" /></div>
                          <div><p className="text-sm font-bold">{emp.nome}</p><p className="text-[10px] text-muted-foreground uppercase">Barbeiro Profissional</p></div>
                       </div>
                       <p className="text-xs font-medium">KZ {emp.salario.toLocaleString()}</p>
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
