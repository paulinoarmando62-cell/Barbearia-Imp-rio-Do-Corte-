import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { UserRole } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Scissors } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginScreen() {
  const { setUser } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleLogin = (role: UserRole) => {
    // Simulate login
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      nome: name || (role === UserRole.SUPER_ADMIN ? 'Super Admin' : role.toUpperCase()),
      email: email || 'user@email.com',
      tipo: role
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mb-4 shadow-lg shadow-gold/20">
            <Scissors className="text-black w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold gold-text">IMPÉRIO DO CORTE</h1>
          <p className="text-muted-foreground uppercase text-xs tracking-widest mt-1 font-medium">Barbearia Premium</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-secondary">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Cadastrar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Bem-vindo de volta</CardTitle>
                <CardDescription>Entre com suas credenciais para acessar o painel.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                
                <div className="pt-4 space-y-2">
                   <p className="text-xs text-muted-foreground mb-2">Entrar como (Demo):</p>
                   <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleLogin(UserRole.CLIENT)}>Cliente</Button>
                      <Button variant="outline" size="sm" onClick={() => handleLogin(UserRole.EMPLOYEE)}>Funcionário</Button>
                      <Button variant="outline" size="sm" onClick={() => handleLogin(UserRole.ADMIN)}>Dono Admin</Button>
                      <Button variant="outline" size="sm" onClick={() => handleLogin(UserRole.SUPER_ADMIN)}>Super Admin</Button>
                   </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Criar Conta</CardTitle>
                <CardDescription>Cadastre-se para agendar seu próximo corte.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Nome Completo</Label>
                  <Input id="reg-name" placeholder="Como quer ser chamado" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">E-mail</Label>
                  <Input id="reg-email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Senha</Label>
                  <Input id="reg-password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <Button className="w-full gold-gradient text-black font-bold" onClick={() => handleLogin(UserRole.CLIENT)}>
                  CADASTRAR
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
