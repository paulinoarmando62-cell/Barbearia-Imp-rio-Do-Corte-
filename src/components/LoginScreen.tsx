import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { UserRole } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scissors } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { supabaseService } from '../services/supabaseService';

export default function LoginScreen() {
  const { setUser, allUsers } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CLIENT);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const superAdminExists = allUsers.some(u => u.tipo === UserRole.SUPER_ADMIN);
  const adminExists = allUsers.some(u => u.tipo === UserRole.ADMIN);

  const handleAuth = async (isLogin: boolean) => {
    if (!isSupabaseConfigured) {
      setError('Supabase não configurado. Adicione as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no painel de configurações.');
      return;
    }
    setIsBusy(true);
    setError(null);
    try {
      if (isLogin) {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (loginError) throw loginError;
        
        if (data.user) {
          const profile = await supabaseService.getProfile(data.user.id);
          if (profile) {
            setUser(profile);
          } else {
            // Unlikely if registered correctly
            setError('Perfil não encontrado.');
          }
        }
      } else {
        if (!name || !email || !password) {
          setError('Preencha todos os campos.');
          return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          const newUser = {
            id: data.user.id,
            nome: name,
            email: email,
            tipo: selectedRole
          };
          
          await supabase.from('profiles').insert(newUser);
          setUser(newUser);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro na autenticação.');
    } finally {
      setIsBusy(false);
    }
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
          <h1 className="text-3xl font-bold gold-text tracking-tighter">IMPÉRIO DO CORTE</h1>
          <p className="text-muted-foreground uppercase text-[10px] tracking-[0.4em] mt-1 font-bold">Barbearia Premium</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg text-center font-bold uppercase">
            {error}
          </div>
        )}

        {!isSupabaseConfigured && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] rounded-lg text-center font-bold uppercase tracking-wider">
            Aviso: Conexão com Supabase Pendente
          </div>
        )}

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Cadastrar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Bem-vindo Profissional</CardTitle>
                <CardDescription>Acesse sua conta para gerenciar seus agendamentos.</CardDescription>
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
                
                <Button 
                  disabled={isBusy}
                  className="w-full gold-gradient text-black font-bold h-12" 
                  onClick={() => handleAuth(true)}
                >
                  {isBusy ? 'CARREGANDO...' : 'ENTRAR'}
                </Button>

                <div className="pt-4 border-t border-border/50">
                   <p className="text-[10px] text-muted-foreground mb-3 font-semibold text-center uppercase tracking-widest italic opacity-50">Logins salvos requerem conta no Supabase</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Criar Nova Conta</CardTitle>
                <CardDescription>Junte-se ao império mais exclusivo do corte.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Nome Completo</Label>
                  <Input id="reg-name" placeholder="Ex: Lucas Barbeiro" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">E-mail</Label>
                  <Input id="reg-email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-pass">Senha</Label>
                  <Input id="reg-pass" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                
                <div className="space-y-2">
                  <Label>Tipo de Conta</Label>
                  <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
                    <SelectTrigger className="h-10 bg-secondary/30">
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.CLIENT}>Cliente</SelectItem>
                      <SelectItem value={UserRole.EMPLOYEE}>Funcionário</SelectItem>
                      {!adminExists && <SelectItem value={UserRole.ADMIN}>Administrador (Dono)</SelectItem>}
                      {!superAdminExists && <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground italic">
                    Cargos administrativos só podem ser criados uma única vez.
                  </p>
                </div>

                <Button 
                  disabled={isBusy}
                  className="w-full gold-gradient text-black font-bold h-12 mt-4" 
                  onClick={() => handleAuth(false)}
                >
                  {isBusy ? 'CRIANDO...' : 'CRIAR CONTA'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
