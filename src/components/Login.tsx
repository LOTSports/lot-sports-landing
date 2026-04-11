import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validação hardcoded conforme pedido
    if (username === 'admin' && password === '7777') {
      onLogin();
    } else {
      setError('Senha incorreta');
      setPassword('');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_70%)]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          x: shake ? [0, -10, 10, -10, 10, 0] : 0
        }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-brand-red rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-red/20 rotate-3">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-black italic uppercase text-white">
            LOT <span className="text-brand-red">SPORTS</span>
          </h1>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mt-2 italic">Acesso Restrito ao Painel</p>
        </div>

        <div className="glass-card p-8 border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase italic text-zinc-500 mb-2 tracking-widest">Usuário</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-brand-red transition-colors"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase italic text-zinc-500 mb-2 tracking-widest">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-brand-red transition-colors"
                  placeholder="••••••"
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-brand-red text-xs font-black uppercase italic text-center"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 group"
            >
              ENTRAR NO PAINEL
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[10px] text-zinc-600 font-black uppercase italic tracking-widest">
          Esqueceu o acesso? Contate o suporte técnico.
        </p>
      </motion.div>
    </div>
  );
}
