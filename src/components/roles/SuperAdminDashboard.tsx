import React from 'react';
import { useStore } from '../../lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, UserCheck, CreditCard, LogOut, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function SuperAdminDashboard() {
  const { config, setConfig, logout } = useStore();

  const toggleStatus = () => {
    setConfig({
      ...config,
      status: config.status === 'ativo' ? 'bloqueado' : 'ativo'
    });
  };

  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold gold-text">Super Admin</h1>
          <p className="text-xs text-muted-foreground">Controle Total do Sistema</p>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground">
          <LogOut className="w-5 h-5" />
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <Card className="border-gold/20 bg-gold/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
              <CardDescription className="text-xs">Uso atual de todos os admins</CardDescription>
            </div>
            {config.status === 'ativo' ? (
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">ATIVO</Badge>
            ) : (
              <Badge variant="destructive">BLOQUEADO</Badge>
            )}
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted-foreground">Expira em: <span className="text-foreground font-medium">{config.data_expiracao}</span></span>
              <Button 
                variant={config.status === 'ativo' ? 'destructive' : 'default'}
                size="sm"
                className={config.status !== 'ativo' ? 'gold-gradient text-black font-bold' : ''}
                onClick={toggleStatus}
              >
                {config.status === 'ativo' ? <><XCircle className="w-4 h-4 mr-2" /> Bloquear</> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Liberar Acesso</>}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Métodos de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {config.metodos_pagamento.map((metodo, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50">
                <span className="text-sm font-medium">{metodo}</span>
                <Badge variant="outline" className="text-[10px]">Padrão</Badge>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-2 border-dashed">
              + Adicionar Novo Método
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Backup de Dados</p>
              <p className="text-xs text-muted-foreground">Último backup realizado há 2 horas.</p>
            </div>
            <Button size="sm" className="w-full">Realizar Backup Agora</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
