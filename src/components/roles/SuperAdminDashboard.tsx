import React from 'react';
import { useStore } from '../../lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShieldCheck, UserCheck, CreditCard, LogOut, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function SuperAdminDashboard() {
  const { config, setConfig, logout } = useStore();
  const [newExp, setNewExp] = React.useState(config.data_expiracao);
  const [newMetodo, setNewMetodo] = React.useState('');

  const toggleStatus = () => {
    setConfig({ ...config, status: config.status === 'ativo' ? 'bloqueado' : 'ativo' });
  };

  const updateExp = () => {
    setConfig({ ...config, data_expiracao: newExp });
  };

  const addMetodo = () => {
    if (!newMetodo) return;
    setConfig({ ...config, metodos_pagamento: [...config.metodos_pagamento, newMetodo] });
    setNewMetodo('');
  };

  const removeMetodo = (m: string) => {
    setConfig({ ...config, metodos_pagamento: config.metodos_pagamento.filter(item => item !== m) });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 space-y-6 pb-20">
      <header className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold gold-text">Super Admin</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Controle Central</p>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive">
          <LogOut className="w-5 h-5" />
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
        <Card className="border-gold/20 bg-gold/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
            </div>
            {config.status === 'ativo' ? (
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">SISTEMA ATIVO</Badge>
            ) : (
              <Badge variant="destructive">SISTEMA BLOQUEADO</Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-bold">Acesso aos Clientes:</span>
              <Button 
                variant={config.status === 'ativo' ? 'destructive' : 'default'}
                size="sm"
                className={config.status !== 'ativo' ? 'gold-gradient text-black font-bold h-8' : 'h-8'}
                onClick={toggleStatus}
              >
                {config.status === 'ativo' ? <><XCircle className="w-4 h-4 mr-2" /> Bloquear</> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Liberar Acesso</>}
              </Button>
            </div>
            
            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Data de Expiração da Licença</label>
                <div className="flex gap-2">
                  <Input type="date" value={newExp} onChange={e => setNewExp(e.target.value)} className="h-9 text-xs" />
                  <Button size="sm" onClick={updateExp} className="h-9 gold-gradient text-black font-bold">Salvar</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/30">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 gold-text" /> Métodos de Pagamento Oficiais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex gap-2">
                <Input placeholder="Novo método..." value={newMetodo} onChange={e => setNewMetodo(e.target.value)} className="h-9 text-xs" />
                <Button size="sm" onClick={addMetodo} className="h-9 bg-secondary">Add</Button>
             </div>
             <div className="space-y-2">
                {config.metodos_pagamento.map((metodo, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-secondary/20 text-xs">
                    <span>{metodo}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeMetodo(metodo)}>
                      <XCircle className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
