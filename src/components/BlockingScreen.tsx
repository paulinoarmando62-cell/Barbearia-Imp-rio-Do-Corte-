import React from 'react';
import { useStore } from '../lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function BlockingScreen() {
  const { config, logout } = useStore();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050505]">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm"
      >
        <Card className="border-destructive/50 bg-destructive/5 overflow-hidden">
          <div className="h-2 bg-destructive" />
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="text-destructive w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-destructive">Acesso Indisponível</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-muted-foreground text-sm leading-relaxed">
              O seu prazo de acesso ao aplicativo terminou.
              Pague a mensalidade para voltar a usufruir o aplicativo.
            </p>

            <div className="space-y-3 pt-4 border-t border-border/50">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Métodos de Pagamento</h3>
              <div className="space-y-1">
                {config.metodos_pagamento.map((metodo, i) => (
                  <p key={i} className="text-sm font-medium">{metodo}</p>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="p-3 bg-secondary rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold">950461466</span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs underline" onClick={() => window.open('https://wa.me/244950461466')}>
                  WhatsApp
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Mande o comprovativo para esse WhatsApp para confirmar o pagamento
              </p>
            </div>

            <Button variant="outline" className="w-full mt-4" onClick={logout}>
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
