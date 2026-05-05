/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  Instagram, 
  Globe, 
  Users, 
  ShieldCheck, 
  RotateCcw, 
  Lock, 
  ChevronDown, 
  HelpCircle, 
  Star, 
  CheckCircle2, 
  ArrowRight,
  Play,
  CircleDollarSign,
  X,
  Save,
  Plus,
  Trash2,
  Truck,
  Award,
  Zap,
  TrendingDown,
  ShoppingBag,
  Check,
  BadgeCheck,
  RefreshCw,
  Eye,
  LogOut,
  User
} from 'lucide-react';
import { defaultData, LandingData } from './content';
import Login from './components/Login';
import { supabase } from './lib/supabase';

/**
 * 🖼️ UTILITÁRIOS DE IMAGEM
 */
const PLACEHOLDER_IMAGE = "https://picsum.photos/seed/lotsports/800/800";

const formatImageURL = (url: string) => {
  if (!url) return url;
  
  // Google Drive
  if (url.includes("drive.google.com")) {
    const idMatch = url.match(/\/d\/(.*?)\//) || url.match(/id=(.*?)(&|$)/);
    if (idMatch) {
      const id = idMatch[1];
      return `https://drive.google.com/uc?export=view&id=${id}`;
    }
  }

  // ImgBB Viewer Link Detection (Common mistake)
  if (url.includes("ibb.co/") && !url.includes("i.ibb.co")) {
    console.warn(`Atenção: O link ${url} parece ser um link de visualização do ImgBB, não o link direto da imagem. No ImgBB, use a opção 'Links diretos' ou clique com o botão direito na imagem e selecione 'Copiar endereço da imagem'.`);
  }

  return url;
};

const isValidImage = (url: string) => {
  return url && url.startsWith("http");
};

const formatarBR = (valor: number | string) => {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
};

const calcularEconomia = (original: string, lot: string) => {
  const vOriginal = parseFloat(original.replace(',', '.'));
  const vLot = parseFloat(lot.replace(',', '.'));
  if (isNaN(vOriginal) || isNaN(vLot)) return 0;
  return vOriginal - vLot;
};

const SafeImage = ({ src, alt, className, ...props }: any) => {
  const formattedSrc = formatImageURL(src);
  const [imgSrc, setImgSrc] = useState(() => {
    if (formattedSrc && formattedSrc !== "" && isValidImage(formattedSrc)) {
      return formattedSrc;
    }
    return PLACEHOLDER_IMAGE;
  });
  const [isInvalid, setIsInvalid] = useState(false);
  const [isImgBBViewer, setIsImgBBViewer] = useState(false);

  useEffect(() => {
    const currentFormatted = formatImageURL(src);
    const isIBB = src?.includes("ibb.co/") && !src?.includes("i.ibb.co");
    setIsImgBBViewer(isIBB);

    if (currentFormatted && currentFormatted !== "" && isValidImage(currentFormatted) && !isIBB) {
      setImgSrc(currentFormatted);
      setIsInvalid(false);
    } else {
      if (src && src !== "") {
        if (!isIBB) {
          console.warn(`URL de imagem inválida detectada: ${src}. Certifique-se que o link começa com http/https.`);
          setIsInvalid(true);
        }
      }
      setImgSrc(PLACEHOLDER_IMAGE);
    }
  }, [src]);

  return (
    <div className="relative w-full h-full">
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} ${isInvalid || isImgBBViewer ? 'opacity-50 grayscale' : ''}`}
        onError={(e) => {
          if (!isImgBBViewer) {
            console.error(`Falha no carregamento da imagem: ${imgSrc}`);
          }
          if (imgSrc.includes("ibb.co/") && !imgSrc.includes("i.ibb.co")) {
            setIsImgBBViewer(true);
          }
          setImgSrc(PLACEHOLDER_IMAGE);
        }}
        referrerPolicy="no-referrer"
        {...props}
      />
      {(isInvalid || isImgBBViewer) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 p-4 text-center">
          <p className="text-[10px] text-brand-red font-black uppercase italic leading-tight">
            {isImgBBViewer ? (
              <>Link de Visualização!<br/>Use o "Link Direto" do ImgBB</>
            ) : (
              <>Link Inválido!<br/>Use um link válido (http/https)</>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * 🎥 SISTEMA DE VÍDEO VSL (YouTube, Vimeo ou MP4)
 * Proporção 9:6 (3:2) com Thumbnail + Play - Estilo Cinema Esportivo
 */
const VSLPlayer = ({ url, thumbnail }: { url: string; thumbnail: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    setViewers(Math.floor(Math.random() * (450 - 320 + 1)) + 320);
    const interval = setInterval(() => {
      setViewers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeo = url.includes('vimeo.com');
  const isMP4 = url.toLowerCase().endsWith('.mp4');

  const getYouTubeID = (url: string) => {
    const regExp = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^&?/\s]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const renderPlayer = () => {
    if (isYouTube) {
      const videoID = getYouTubeID(url);
      if (!videoID) return renderFallback("ID do YouTube não encontrado");
      
      return (
        <iframe
          id="video"
          src={`https://www.youtube.com/embed/${videoID}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
          className="absolute top-0 left-0 w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          frameBorder="0"
          onError={() => setHasError(true)}
        />
      );
    }

    if (isVimeo) {
      const videoId = url.split('/').pop()?.split('?')[0];
      if (!videoId) return renderFallback("ID do Vimeo não encontrado");
      
      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?autoplay=1&muted=0&badge=0&autopause=0`}
          className="absolute top-0 left-0 w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
          frameBorder="0"
          onError={() => setHasError(true)}
        />
      );
    }

    if (isMP4) {
      return (
        <video
          src={url}
          className="absolute top-0 left-0 w-full h-full object-cover"
          controls
          autoPlay
          onError={() => setHasError(true)}
        />
      );
    }

    return renderFallback("Formato de vídeo não suportado");
  };

  const renderFallback = (message: string) => (
    <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-brand-red/10 rounded-full flex items-center justify-center mb-6 border border-brand-red/20">
        <Play className="w-10 h-10 text-brand-red opacity-50" />
      </div>
      <h3 className="text-white text-xl font-black uppercase italic tracking-tighter mb-2">Erro de Transmissão</h3>
      <p className="text-zinc-500 text-xs uppercase font-bold">{message}</p>
      <button 
        onClick={() => setIsPlaying(false)}
        className="mt-6 btn-outline py-2 px-6 text-xs"
      >
        Tentar novamente
      </button>
    </div>
  );

  if (hasError) return (
    <div className="relative w-full pt-[66.66%] bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
      {renderFallback("Erro de conexão ou link inválido")}
    </div>
  );

  return (
    <div className="relative w-full pt-[66.66%] bg-black rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(255,0,0,0.15)] border border-white/10 group">
      {!isPlaying ? (
        <div 
          className="absolute inset-0 cursor-pointer"
          onClick={() => setIsPlaying(true)}
        >
          <SafeImage 
            src={thumbnail} 
            alt="VSL Thumbnail" 
            className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-24 h-24 bg-brand-red rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,0,0,0.6)] relative"
            >
              <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
              <Play className="w-12 h-12 text-white fill-current ml-2" />
            </motion.div>
          </div>

          <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-3 h-3 bg-brand-red rounded-full animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.8)]"></div>
               <span className="text-white text-sm font-black italic uppercase tracking-widest">{viewers} pessoas assistindo agora</span>
             </div>
             <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">HD 1080P</span>
          </div>
        </div>
      ) : (
        renderPlayer()
      )}
    </div>
  );
};

/**
 * ⏳ CONTADOR REGRESSIVO - Estilo Placar de Estádio
 */
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex gap-3 justify-center items-center scoreboard-font">
      {[
        { val: timeLeft.h, label: 'HRS' },
        { val: timeLeft.m, label: 'MIN' },
        { val: timeLeft.s, label: 'SEG' }
      ].map((t, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="bg-zinc-950 text-brand-red text-4xl md:text-6xl font-black p-4 rounded border border-white/10 min-w-[90px] shadow-inner flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 z-10"></div>
            {format(t.val)}
          </div>
          <span className="text-[9px] font-black mt-2 text-zinc-600 tracking-[0.2em]">{t.label}</span>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [data, setData] = useState<LandingData>(defaultData);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [canAccessAdmin, setCanAccessAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [notification, setNotification] = useState<{name: string, city: string, product: string} | null>(null);

  // Sistema de Notificações Fake
  useEffect(() => {
    const names = ["Carlos", "Lucas", "Mateus", "Gabriel", "Felipe", "Pedro", "João", "André"];
    const cities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Fortaleza", "Brasília", "Salvador"];
    const products = ["Camisa Brasil Home", "Camisa Flamengo Home", "Camisa Real Madrid", "Camisa Inter Miami"];

    const showNotification = () => {
      const name = names[Math.floor(Math.random() * names.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      
      setNotification({ name, city, product });
      setTimeout(() => setNotification(null), 5000);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) showNotification();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // 🔄 SINCRONIZAÇÃO EM TEMPO REAL (REALTIME)
  useEffect(() => {
    if (!supabase) return;

    console.log('Iniciando Realtime para sincronização global...');
    
    const channel = supabase
      .channel('landing_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'landing_data' },
        (payload: any) => {
          console.log('🔄 Mudança detectada no Supabase!', payload);
          if (payload.new && payload.new.dados) {
            setData(mergeWithDefault(payload.new.dados));
          }
        }
      )
      .subscribe((status) => {
        console.log('Status da inscrição Realtime:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Carregar dados do Supabase ao montar
  useEffect(() => {
    // 1. Verificar acesso secreto (Admin)
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'lot2026') {
      setCanAccessAdmin(true);
      setIsAdminOpen(true);
    }

    // 2. Carregar dados do Supabase (PARA TODOS)
    loadData();
  }, []);

  const loadData = async () => {
    if (!supabase) {
      console.log('Sincronização desativada: Supabase não configurado.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const { data: result, error } = await supabase
        .from('landing_data')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (result?.dados) {
        const merged = mergeWithDefault(result.dados);
        setData(merged);
        console.log('Dados carregados com sucesso do Supabase');
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Função robusta de merge
  const mergeWithDefault = (dbConfig: any): LandingData => {
    if (!dbConfig) return defaultData;

    return {
      ...defaultData,
      ...dbConfig,
      branding: { ...defaultData.branding, ...(dbConfig.branding || {}) },
      textos: { ...defaultData.textos, ...(dbConfig.textos || {}) },
      precos: { ...defaultData.precos, ...(dbConfig.precos || {}) },
      botoes: { ...defaultData.botoes, ...(dbConfig.botoes || {}) },
      midia: { ...defaultData.midia, ...(dbConfig.midia || {}) },
      redes: { ...defaultData.redes, ...(dbConfig.redes || {}) },
      comoFunciona: { ...defaultData.comoFunciona, ...(dbConfig.comoFunciona || {}) },
      // Arrays
      depoimentos: dbConfig.depoimentos || defaultData.depoimentos,
      beneficios: dbConfig.beneficios || defaultData.beneficios,
      faq: dbConfig.faq || defaultData.faq,
      produtos: dbConfig.produtos || defaultData.produtos
    };
  };

  const updateLocalData = (newData: LandingData) => {
    // Atualiza apenas o estado React para resposta imediata na UI (preview)
    // O salvamento real ocorre apenas ao clicar em "Salvar" no admin
    setData(newData);
  };

  const syncWithSupabase = async () => {
    if (!supabase) {
      alert('Configuração do Supabase ausente.');
      return;
    }

    try {
      setIsSaving(true);
      console.log("Tentando salvar dados no Supabase:", data);

      // 1. Verificar se já existe um registro
      const { data: existing, error: fetchError } = await supabase
        .from('landing_data')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      let response;

      if (existing) {
        // 2a. Se existe, faz UPDATE
        console.log("Registro existente encontrado (ID:", existing.id, "). Fazendo UPDATE...");
        response = await supabase
          .from('landing_data')
          .update({ dados: data })
          .eq('id', existing.id);
      } else {
        // 2b. Se não existe, faz INSERT
        console.log("Nenhum registro encontrado. Fazendo INSERT...");
        response = await supabase
          .from('landing_data')
          .insert({ dados: data });
      }

      console.log("Resposta do Supabase:", response);

      if (response.error) throw response.error;

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Recarregar para garantir consistência total
      await loadData();
    } catch (err: any) {
      console.error('Erro ao salvar no Supabase:', err);
      alert('Erro ao salvar: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setIsSaving(false);
    }
  };

  const resetData = () => {
    if (window.confirm('Tem certeza que deseja resetar todos os dados para o padrão de fábrica?')) {
      updateLocalData(defaultData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdminOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-black italic uppercase tracking-widest text-xs animate-pulse">Carregando LOT Sports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark overflow-x-hidden">
      
      {/* 🔥 BARRA DE AVISO TOPO */}
      <div className="bg-brand-red py-2 px-4 text-center relative z-[60]">
        <p className="text-[10px] md:text-xs font-black uppercase italic tracking-[0.2em] text-white flex items-center justify-center gap-3">
          <Zap className="w-3 h-3 fill-current animate-pulse" />
          MANTOS 2024/25 DISPONÍVEIS + LEVE 3 PAGUE 2 ATÉ ÀS 23:59 DE HOJE
          <Zap className="w-3 h-3 fill-current animate-pulse" />
        </p>
      </div>

      {/* 🚀 HEADER FIXO */}
      <header className="fixed top-0 left-0 w-full z-50 bg-brand-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter text-white italic">
            {(data.branding?.nomeLoja || 'LOT Sports').split(' ')[0]}<span className="text-brand-red">{(data.branding?.nomeLoja || 'LOT Sports').split(' ')[1] || ''}</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#oferta" className="text-[10px] font-black uppercase italic text-zinc-400 hover:text-brand-red transition-colors tracking-widest">Oferta</a>
            <a href="#modelos" className="text-[10px] font-black uppercase italic text-zinc-400 hover:text-brand-red transition-colors tracking-widest">Modelos</a>
            <a href="#faq" className="text-[10px] font-black uppercase italic text-zinc-400 hover:text-brand-red transition-colors tracking-widest">Dúvidas</a>
          </nav>
          <a href={data.botoes.hero_whatsapp_link} className="bg-brand-green hover:bg-brand-green/90 text-white text-[10px] font-black px-6 py-2.5 rounded transition-all uppercase tracking-widest italic flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            {data.botoes.hero_whatsapp_texto.split(' ')[2] || 'WhatsApp'}
          </a>
        </div>
      </header>

      {/* 🔥 HERO SECTION - ESTILO ESTÁDIO */}
      <section className="pt-32 pb-24 relative overflow-hidden bg-grass tactical-lines stadium-glow diagonal-cut-bottom">
        <div className="container mx-auto px-6 relative z-10 text-center mb-8">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full text-[10px] font-black uppercase italic text-zinc-300">
             <Eye className="w-3 h-3 text-brand-red" />
             482 pessoas vendo esta página agora
           </div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap justify-center gap-4">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-green/10 border border-brand-green/30 rounded-sm text-brand-green text-[11px] font-black italic uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(37,211,102,0.1)]">
                  <Truck className="w-4 h-4" />
                  {data.branding.frete}
                </div>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red/10 border border-brand-red/30 rounded-sm text-brand-red text-[11px] font-black italic uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,0,0,0.1)]">
                  <Award className="w-4 h-4" />
                  {data.branding.anosMercado}
                </div>
              </div>
              
              <h1 id="headline" className="text-5xl md:text-8xl font-black leading-[0.85] italic uppercase tracking-tighter">
                {data.textos.headline_principal.split(' ').map((word, i) => (
                  <span key={i} className={i > 3 ? 'text-brand-red block md:inline' : ''}>{word} </span>
                ))}
              </h1>
              
              <p className="text-zinc-400 text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
                {data.textos.subheadline_principal}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-4xl mx-auto relative"
            >
              <div className="absolute -inset-10 bg-brand-red/10 blur-[100px] rounded-full -z-10 animate-pulse-soft"></div>
              <VSLPlayer url={data.midia.video_vsl} thumbnail={data.midia.thumbnail_vsl} />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center gap-6 w-full justify-center"
            >
              <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                <a href={data.botoes.hero_link} className="btn-secondary py-6 px-12 text-xl group min-w-[280px]">
                  {data.botoes.hero_site_texto}
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </a>
                <a href={data.redes.grupoVip} className="btn-primary bg-brand-green hover:bg-brand-green/90 border-brand-green shadow-brand-green/20 py-6 px-12 text-xl min-w-[280px] animate-pulse-green">
                  <Users className="w-6 h-6" />
                  ENTRAR NO GRUPO VIP
                </a>
              </div>
              <p className="text-brand-green font-black uppercase italic tracking-widest text-[10px] flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" /> Sem taxas escondidas
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🏆 AUTORIDADE - ESTILO ESTATÍSTICA */}
      <section className="py-24 bg-brand-gray relative overflow-hidden tactical-lines">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto"
          >
            <div className="space-y-2">
              <Award className="w-8 h-8 md:w-12 md:h-12 text-brand-red mx-auto mb-4" />
              <div className="text-6xl md:text-8xl font-black text-white italic leading-none scoreboard-font">06</div>
              <p className="text-zinc-500 font-black uppercase italic tracking-widest text-xs">Anos de mercado</p>
            </div>
            <div className="space-y-2">
              <Truck className="w-8 h-8 md:w-12 md:h-12 text-white mx-auto mb-4" />
              <div className="text-6xl md:text-8xl font-black text-white italic leading-none scoreboard-font">BR</div>
              <p className="text-zinc-500 font-black uppercase italic tracking-widest text-xs">Envios para todo o Brasil 🇧🇷</p>
            </div>
            <div className="space-y-2">
              <ShieldCheck className="w-8 h-8 md:w-12 md:h-12 text-brand-green mx-auto mb-4" />
              <div className="text-6xl md:text-8xl font-black text-white italic leading-none scoreboard-font">100%</div>
              <p className="text-zinc-500 font-black uppercase italic tracking-widest text-xs">Garantia de entrega</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ⚔️ COMPARATIVO - ESTILO BATALHA */}
      <section className="py-32 relative overflow-hidden bg-brand-dark diagonal-cut-top diagonal-cut-bottom">
        <div className="absolute inset-0 bg-grass opacity-20 -z-10"></div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-7xl mb-4 italic font-black uppercase tracking-tighter">O DUELO DA <span className="text-brand-red">QUALIDADE</span></h2>
            <p className="text-zinc-500 uppercase font-black tracking-[0.3em] text-xs">Por que pagar mais pelo mesmo visual?</p>
          </div>

          <div className="grid md:grid-cols-2 gap-0 max-w-6xl mx-auto items-stretch border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            {/* ORIGINAL */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-950 p-12 relative flex flex-col justify-center border-r border-white/5"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-red opacity-50"></div>
              <div className="mb-10">
                <span className="text-brand-red font-black italic uppercase tracking-widest text-xs block mb-2">ADVERSÁRIO</span>
                <h3 className="text-3xl font-black italic text-zinc-400">CAMISA OFICIAL</h3>
              </div>
              <div className="space-y-8">
                <div className="text-5xl font-black italic text-zinc-600 scoreboard-font">R$ {data.precos.comparativo_original}</div>
                <ul className="space-y-5">
                  <li className="flex items-center gap-4 text-zinc-500 font-bold italic uppercase text-xs">
                    <X className="w-5 h-5 text-brand-red" /> Preço Abusivo
                  </li>
                  <li className="flex items-center gap-4 text-zinc-500 font-bold italic uppercase text-xs">
                    <Check className="w-5 h-5 text-zinc-700" /> Mesma Tecnologia
                  </li>
                  <li className="flex items-center gap-4 text-zinc-500 font-bold italic uppercase text-xs">
                    <Check className="w-5 h-5 text-zinc-700" /> Tecido Idêntico
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* LOT SPORTS */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-brand-gray p-12 relative flex flex-col justify-center stadium-glow"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-green"></div>
              <div className="mb-10">
                <span className="text-brand-green font-black italic uppercase tracking-widest text-xs block mb-2">VENCEDOR</span>
                <h3 className="text-3xl font-black italic text-white">CAMISA {(data.branding?.nomeLoja || 'LOT Sports').toUpperCase()}</h3>
              </div>
              <div className="space-y-8">
                <div className="text-7xl font-black italic text-white scoreboard-font leading-none">
                  <span className="text-brand-green text-3xl align-top mr-1">R$</span>
                  <span id="preco">{data.precos.comparativo_lot}</span>
                </div>
                <div className="bg-brand-green/20 text-brand-green text-xs font-black py-2 px-6 rounded-sm inline-block italic uppercase tracking-widest border border-brand-green/30">
                  ECONOMIA DE {formatarBR(calcularEconomia(data.precos.comparativo_original, data.precos.comparativo_lot))} POR CAMISA
                </div>
                <ul className="space-y-5">
                  <li className="flex items-center gap-4 text-white font-black italic uppercase text-xs">
                    <CheckCircle2 className="w-5 h-5 text-brand-green" /> Qualidade Premium
                  </li>
                  <li className="flex items-center gap-4 text-white font-black italic uppercase text-xs">
                    <CheckCircle2 className="w-5 h-5 text-brand-green" /> Melhor Custo-Benefício
                  </li>
                  <li className="flex items-center gap-4 text-white font-black italic uppercase text-xs">
                    <CheckCircle2 className="w-5 h-5 text-brand-green" /> Visual 100% Autêntico
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          <div className="mt-20 text-center">
            <a href={data.botoes.hero_whatsapp_link} className="btn-primary py-6 px-16 text-xl inline-flex items-center gap-4 group">
              GARANTIR MEU MANTO AGORA
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* 💰 OFERTA - ESTILO PROMOÇÃO ESPORTIVA */}
      <section id="oferta" className="py-32 bg-brand-gray relative overflow-hidden tactical-lines">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto glass-card p-1 md:p-12 border-brand-red/30 relative overflow-visible">
            <div className="absolute top-3 right-3 md:top-6 md:right-6 bg-gradient-to-r from-brand-red to-[#ff4d4d] text-white font-black italic uppercase px-4 py-2 rounded-md shadow-[0_0_15px_rgba(255,0,0,0.4)] z-20 text-[10px] md:text-xs tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3 fill-current" /> OFERTA LIMITADA
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                  {data.textos.oferta_titulo.split(',')[0]} <br/>
                  <span className="text-brand-red">{data.textos.oferta_titulo.split(',')[1]}</span>
                </h2>
                <p className="text-zinc-500 uppercase font-black tracking-[0.4em] text-xs">{data.textos.oferta_subtitulo}</p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
                <div className="space-y-6">
                  <div className="inline-block bg-brand-red/10 border border-brand-red/30 text-brand-red font-black italic uppercase px-6 py-2 rounded-sm text-xs tracking-widest">
                    LEVE 3, PAGUE 2 - DESTAQUE MÁXIMO
                  </div>
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-zinc-600 line-through text-3xl font-black italic scoreboard-font">R$ {data.precos.comparativo_original}</span>
                    <div className="text-brand-green text-7xl md:text-9xl font-black italic leading-none scoreboard-font flex items-start">
                      <span className="text-3xl mt-2 mr-2">R$</span>
                      {data.precos.oferta_preco_unitario}
                    </div>
                    <p className="text-zinc-500 mt-4 font-black uppercase text-[10px] tracking-widest italic">Preço por unidade na promoção exclusiva</p>
                  </div>
                </div>

                <div className="bg-zinc-950/50 p-8 rounded-2xl border border-white/5 space-y-6">
                  <p className="text-white font-black italic uppercase tracking-[0.2em] text-xs">O placar está correndo:</p>
                  <CountdownTimer />
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase italic">Restam apenas 14 kits disponíveis para sua região</p>
                  </div>
                </div>
              </div>

              <div className="w-full space-y-4">
                <a href={data.botoes.hero_link} className="btn-primary w-full text-2xl py-8 shadow-[0_0_50px_rgba(37,211,102,0.4)] animate-pulse-green">
                  {data.botoes.oferta_cta_texto.toUpperCase()}
                </a>
                <p className="text-brand-green font-black italic uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                  <span className="text-xl">💰</span> Sem taxas extras — você não paga nada além do valor do produto
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ BENEFÍCIOS - ESTILO CARDS PREMIUM */}
      <section className="py-32 bg-brand-dark relative overflow-hidden diagonal-cut-bottom">
        <div className="absolute inset-0 bg-grass opacity-10 -z-10"></div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-7xl mb-4 italic font-black uppercase tracking-tighter leading-none">{data.textos.beneficios_titulo.split(' ').slice(0, -2).join(' ')} <span className="text-brand-red">{data.textos.beneficios_titulo.split(' ').slice(-2).join(' ')}</span></h2>
            <p className="text-zinc-500 uppercase font-black tracking-[0.3em] text-xs">Cada detalhe importa.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(data.beneficios || []).map((ben, i) => {
              const isTrustBuilder = i < 2; // Taxas e Frete
              const Icon = [CircleDollarSign, Truck, Zap, ShieldCheck][i] || CheckCircle2;
              
              return (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className={`glass-card p-10 border-white/5 transition-all group ${
                    isTrustBuilder ? 'hover:border-brand-green/30' : 'hover:border-brand-red/30'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all ${
                    isTrustBuilder 
                      ? 'bg-brand-green/10 group-hover:bg-brand-green group-hover:shadow-[0_0_30px_rgba(37,211,102,0.5)]' 
                      : 'bg-brand-red/10 group-hover:bg-brand-red group-hover:shadow-[0_0_30px_rgba(255,0,0,0.5)]'
                  }`}>
                    <Icon className={`w-8 h-8 transition-colors ${
                      isTrustBuilder 
                        ? 'text-brand-green group-hover:text-white' 
                        : 'text-brand-red group-hover:text-white'
                    }`} />
                  </div>
                  <h3 className={`text-xl font-black italic uppercase mb-4 text-white transition-colors ${
                    isTrustBuilder ? 'group-hover:text-brand-green' : 'group-hover:text-brand-red'
                  }`}>
                    {ben.titulo}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                    {ben.descricao}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🛠️ COMO FUNCIONA - ESTILO LINHA DO TEMPO ESPORTIVA */}
      <section className="py-32 bg-brand-gray tactical-lines">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-7xl italic uppercase font-black tracking-tighter leading-none">{data.textos.como_funciona_titulo.split(' ')[0]} <span className="text-brand-red">{data.textos.como_funciona_titulo.split(' ').slice(1).join(' ')}</span></h2>
            <p className="text-zinc-500 uppercase font-black tracking-[0.3em] text-xs">Do clique ao gol: como seu manto chega até você.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-brand-red/20 -translate-y-1/2 -z-10"></div>
            {(data.comoFunciona?.passos || []).map((step, i) => {
              const icons = [ShoppingBag, TrendingDown, Truck];
              const Icon = icons[i % icons.length];
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-zinc-950 p-10 rounded-2xl border border-white/5 relative group hover:border-brand-red/30 transition-all"
                >
                  <div className="absolute -top-6 left-10 w-12 h-12 bg-brand-red text-white font-black italic flex items-center justify-center rounded-sm shadow-xl text-xl scoreboard-font">0{i + 1}</div>
                  <div className="w-20 h-20 bg-brand-red/10 rounded-full flex items-center justify-center mb-8 border border-brand-red/20 group-hover:bg-brand-red transition-all">
                    <Icon className="w-10 h-10 text-brand-red group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="text-xl font-black italic uppercase mb-4 group-hover:text-brand-red transition-colors">{step.titulo}</h4>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed">{step.descricao}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🟢 GRUPO VIP - DESTAQUE MÁXIMO */}
      <section className="py-32 bg-brand-dark relative overflow-hidden diagonal-cut-top diagonal-cut-bottom">
        <div className="absolute inset-0 bg-grass opacity-10 -z-10"></div>
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto bg-zinc-950 border border-brand-green/30 rounded-3xl p-8 md:p-20 relative overflow-hidden shadow-[0_0_100px_rgba(37,211,102,0.15)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-green"></div>
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-green/10 blur-[100px] rounded-full"></div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 border border-brand-green/30 rounded-sm text-brand-green text-[10px] font-black italic uppercase tracking-widest">
                    <Zap className="w-4 h-4 fill-current" /> ACESSO EXCLUSIVO
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-sm text-zinc-400 text-[10px] font-black italic uppercase tracking-widest">
                    <Users className="w-4 h-4" /> +3.742 MEMBROS ATIVOS
                  </div>
                </div>
                <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                  ENTRE PARA A <br/>
                  <span className="text-brand-green">ELITE DO FUTEBOL</span>
                </h2>
                <p className="text-zinc-400 text-lg font-medium leading-relaxed">
                  Faça parte do nosso Grupo VIP e receba lançamentos mundiais, promoções relâmpago e cupons secretos antes de todo mundo.
                </p>
                <div className="inline-block bg-brand-red/10 border border-brand-red/30 px-3 py-1 rounded text-[9px] font-black uppercase text-brand-red animate-pulse">
                   🔥 VAGAS LIMITADAS HOJE
                </div>
                <ul className="space-y-4">
                  {[
                    'Ofertas exclusivas',
                    'Promoções antecipadas',
                    'Acesso prioritário'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white font-black italic uppercase text-xs">
                      <div className="w-2 h-2 bg-brand-green rounded-full shadow-[0_0_10px_rgba(37,211,102,0.8)]"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-center justify-center space-y-8">
                <div className="relative">
                  <div className="absolute -inset-10 bg-brand-green/20 blur-3xl rounded-full animate-pulse"></div>
                  <div className="w-48 h-48 bg-zinc-900 rounded-full border-4 border-brand-green flex items-center justify-center shadow-2xl relative z-10">
                    <Users className="w-24 h-24 text-brand-green" />
                  </div>
                </div>
                <a 
                  href={data.redes.grupoVip} 
                  className="btn-primary bg-brand-green hover:bg-brand-green/90 border-brand-green w-full py-8 text-2xl shadow-[0_0_50px_rgba(37,211,102,0.4)] animate-pulse-green group"
                >
                  ENTRAR AGORA E GARANTIR VANTAGENS
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </a>
                <p className="text-[10px] text-zinc-500 font-black uppercase italic">Última vaga preenchida há 4 minutos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🛒 NOSSOS MANTOS - ESTILO LOJA MODERNA */}
      <section id="modelos" className="py-32 bg-brand-dark relative overflow-hidden tactical-lines diagonal-cut-top">
        <div className="absolute inset-0 bg-grass opacity-10 -z-10"></div>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-7xl italic font-black uppercase tracking-tighter leading-none">
                {data.textos.galeria_titulo.split(' ')[0]} <span className="text-brand-red">{data.textos.galeria_titulo.split(' ').slice(1).join(' ')}</span>
              </h2>
              <p className="text-zinc-500 uppercase font-black tracking-[0.3em] text-xs">Os mantos que estão dominando os estádios.</p>
            </div>
            <a href={data.botoes.hero_link} className="btn-outline py-4 px-10 text-sm border-brand-red/30 hover:border-brand-red">VER TODOS OS MODELOS</a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(data.produtos || []).map((produto, i) => {
              console.log(`Produto: ${produto.nome}, Imagem: ${produto.imagem}`);
              return (
                <motion.div 
                  key={i}
                  whileHover={{ y: -15 }}
                  className="glass-card overflow-hidden group border-white/5 hover:border-brand-red/30 flex flex-col h-full"
                >
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <SafeImage src={produto.imagem} alt={produto.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <div className="bg-brand-red text-white text-[9px] font-black px-3 py-1 rounded-sm italic uppercase shadow-xl flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" /> {produto.vendidosHoje || 'Destaque'}
                      </div>
                      <div className="bg-brand-green text-white text-[9px] font-black px-3 py-1 rounded-sm italic uppercase shadow-xl flex items-center gap-1">
                        <Check className="w-3 h-3" /> {produto.estoque || 'Disponível'}
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                       <div className="bg-black/60 backdrop-blur-md rounded-lg p-2 flex items-center justify-center gap-2 border border-white/10 group-hover:bg-brand-red/80 transition-colors">
                          <Truck className="w-3 h-3 text-brand-green group-hover:text-white" />
                          <span className="text-[8px] font-black uppercase text-white tracking-widest">Entrega Expressa para todo Brasil 🇧🇷</span>
                       </div>
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 gap-4">
                      <div className="text-white text-center space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform">
                        <p className="text-[10px] font-black uppercase italic tracking-widest">Tamanhos Disponíveis</p>
                        <div className="flex gap-2 justify-center">
                          {['P', 'M', 'G', 'GG'].map(size => (
                            <span key={size} className="w-8 h-8 rounded border border-white/30 flex items-center justify-center text-xs font-black hover:bg-white hover:text-black transition-colors">{size}</span>
                          ))}
                        </div>
                      </div>
                      <a 
                        href={`https://wa.me/${data.botoes.hero_whatsapp_link.split('/').pop()}?text=Olá, quero saber mais sobre a ${produto.nome}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-primary w-full py-4 text-xs shadow-2xl flex items-center justify-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform delay-75"
                      >
                        <MessageCircle className="w-4 h-4" />
                        COMPRAR VIA WHATSAPP
                      </a>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-between bg-zinc-950/30">
                    <div>
                      <h4 className="text-white text-lg mb-3 font-black italic uppercase leading-tight group-hover:text-brand-red transition-colors">{produto.nome}</h4>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-brand-green font-black italic text-2xl scoreboard-font">{produto.preco}</span>
                          <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">{produto.avaliacoes || 'Novidade'}</p>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 text-brand-red fill-brand-red" />)}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🗣️ DEPOIMENTOS - ESTILO VESTIÁRIO VIP */}
      <section className="py-32 bg-brand-dark relative overflow-hidden diagonal-cut-top diagonal-cut-bottom">
        <div className="absolute inset-0 bg-grass opacity-10 -z-10"></div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-7xl italic font-black uppercase tracking-tighter leading-none">{data.textos.depoimentos_titulo.split(' ').slice(0, -2).join(' ')} <span className="text-brand-red">{data.textos.depoimentos_titulo.split(' ').slice(-2).join(' ')}</span></h2>
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-brand-red fill-brand-red shadow-[0_0_15px_rgba(255,0,0,0.4)]" />)}
            </div>
            <p className="text-zinc-500 uppercase font-black tracking-[0.3em] text-xs mt-6">A voz de quem já veste o manto.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(data.depoimentos || []).map((dep, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="glass-card p-10 relative border-white/5 hover:border-brand-red/30 transition-all group"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-brand-red flex items-center justify-center text-white text-2xl font-black italic rounded-sm shadow-xl z-10">"</div>
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center border border-brand-red/20 overflow-hidden">
                    {dep.avatar ? (
                      <SafeImage src={dep.avatar} alt={dep.nome} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-brand-red" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-black italic uppercase tracking-widest text-sm">{dep.nome}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">{dep.cidade || 'Brasil'}</p>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 text-brand-red fill-brand-red" />)}
                    </div>
                  </div>
                </div>
                <p className="text-zinc-400 italic text-base leading-relaxed font-medium group-hover:text-white transition-colors mb-6">
                  {dep.texto}
                </p>
                <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block text-right italic">{dep.tempo || 'Comprou recentemente'}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 📸 PROVA SOCIAL (PRINTS) - ESTILO GALERIA DE CONQUISTAS */}
      <section className="py-32 bg-brand-gray tactical-lines relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-7xl italic font-black uppercase tracking-tighter leading-none">{data.textos.prints_titulo.split(' ').slice(0, -2).join(' ')} <span className="text-brand-red">{data.textos.prints_titulo.split(' ').slice(-2).join(' ')}</span></h2>
            <p className="text-zinc-500 uppercase font-black tracking-[0.3em] text-xs mt-4">Nossos clientes não mentem. O placar é real.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {(data.midia?.prints || []).map((print, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glass-card p-6 group hover:border-brand-red/30 transition-all"
              >
                <div className="rounded-xl overflow-hidden border border-white/5 relative group-hover:border-brand-red/30 transition-all">
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-100 group-hover:opacity-0 transition-opacity z-10 flex items-center justify-center">
                     <p className="text-white text-[10px] font-black uppercase italic tracking-[0.2em] bg-brand-red/80 px-4 py-2 rounded">Clica para revelar o print</p>
                  </div>
                  <div className="absolute top-4 right-4 z-20">
                     <div className="bg-brand-green text-white text-[8px] font-black px-2 py-1 rounded-sm italic uppercase flex items-center gap-1 shadow-lg">
                        <Check className="w-3 h-3" /> Compra confirmada
                     </div>
                  </div>
                  <div className="absolute inset-0 bg-brand-red/10 opacity-0 group-hover:opacity-30 transition-opacity z-10 pointer-events-none"></div>
                  <SafeImage src={print.url} alt={print.legenda} className="w-full hover:scale-105 transition-transform duration-700 blur-[4px] group-hover:blur-0" />
                  
                  <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="bg-white text-black text-[8px] font-black px-3 py-1.5 rounded shadow-xl flex items-center gap-2">
                        <MessageCircle className="w-3 h-3" /> Mensagem real do WhatsApp
                     </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-zinc-400 text-xs font-black uppercase italic tracking-widest">{print.legenda}</p>
                  <div className="flex items-center gap-2 text-brand-green">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase italic">Verificado</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🛡️ GARANTIA - ESTILO ESCUDO IMPENETRÁVEL */}
      <section className="py-32 bg-brand-dark relative overflow-hidden diagonal-cut-top">
        <div className="absolute inset-0 bg-grass opacity-10 -z-10"></div>
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto glass-card p-12 md:p-24 text-center border-brand-red/30 relative overflow-hidden shadow-[0_0_100px_rgba(255,0,0,0.1)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-red/5 blur-[100px] rounded-full"></div>
            
            <motion.div
              initial={{ rotate: -5, scale: 0.9 }}
              whileInView={{ rotate: 3, scale: 1 }}
              viewport={{ once: true }}
              className="w-32 h-32 bg-brand-red rounded-3xl flex items-center justify-center mx-auto mb-12 shadow-[0_0_50px_rgba(255,0,0,0.5)] relative z-10"
            >
              <div className="absolute -top-4 -right-4 bg-white text-brand-red p-2 rounded-full shadow-xl">
                 <BadgeCheck className="w-8 h-8" />
              </div>
              <ShieldCheck className="w-16 h-16 text-white" />
            </motion.div>
            
            <h2 className="text-5xl md:text-8xl mb-4 italic font-black uppercase tracking-tighter leading-none">
              GARANTIA <span className="text-brand-red">BLINDADA</span>
            </h2>
            <div className="inline-block bg-brand-green/20 border border-brand-green/30 text-brand-green font-black italic uppercase px-4 py-1 rounded text-[10px] mb-8">
               🛡️ 7 DIAS DE SEGURANÇA TOTAL
            </div>
            <p className="text-zinc-400 max-w-3xl mx-auto mb-16 text-xl italic font-medium leading-relaxed">
              {data.textos.garantia_texto}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 max-w-4xl mx-auto">
              {[
                { icon: Lock, title: 'PAGAMENTO SEGURO', desc: 'Criptografia de nível estádio.' },
                { icon: ShieldCheck, title: 'ENTREGA GARANTIDA', desc: 'Rastreio tático em tempo real.' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center group">
                  <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-white/5 group-hover:border-brand-red/50 transition-all">
                    <item.icon className="w-8 h-8 text-brand-red group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="text-white text-sm font-black italic uppercase tracking-widest mb-2">{item.title}</h4>
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ❓ FAQ - ESTILO ACORDEÃO LIMPO */}
      <section id="faq" className="py-32 bg-brand-gray tactical-lines">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-7xl italic font-black uppercase tracking-tighter leading-none mb-4">DÚVIDAS DO <span className="text-brand-red">VESTIÁRIO</span></h2>
            <p className="text-zinc-500 uppercase font-black tracking-[0.3em] text-xs">Tudo o que você precisa saber antes de entrar em campo.</p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {(data.faq || []).map((item, i) => (
              <motion.div 
                key={i}
                initial={false}
                className="glass-card overflow-hidden border-white/5 hover:border-brand-red/20 transition-colors"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-8 text-left flex justify-between items-center group"
                >
                  <span className="text-white font-black italic uppercase tracking-widest text-sm group-hover:text-brand-red transition-colors">{item.pergunta}</span>
                  <ChevronDown className={`w-5 h-5 text-brand-red transition-transform duration-500 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="px-8 pb-8 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-6">
                        {item.resposta}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 FINAL CTA - ESTILO EMOCIONAL E URGENTE */}
      <section className="py-32 bg-brand-dark relative overflow-hidden bg-grass tactical-lines diagonal-cut-top">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-red/20 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex flex-col items-center gap-4 mb-8">
                 <div className="bg-brand-red text-white font-black italic uppercase px-6 py-2 rounded-sm text-xs tracking-widest animate-pulse">
                    🔥 O FERTA ENCERRA EM BREVE
                 </div>
                 <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase text-[10px]">
                    <Users className="w-4 h-4" /> Mais de 120 pessoas compraram hoje
                 </div>
              </div>
              <h2 className="text-5xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.85]">
                VISTA A SUA <br/>
                <span className="text-brand-red">PAIXÃO</span>
              </h2>
              <p className="text-zinc-400 text-xl md:text-3xl font-medium italic">
                Não assista ao jogo. Faça parte dele com o manto que você sempre sonhou.
              </p>
              <div className="pt-8">
                 <CountdownTimer />
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href={data.botoes.hero_link} className="btn-primary py-8 px-16 text-2xl shadow-[0_0_60px_rgba(37,211,102,0.4)] animate-pulse-green group w-full sm:w-auto">
                {data.botoes.final_site_texto}
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </a>
              <a href={data.botoes.final_whatsapp_link} className="btn-secondary bg-brand-red hover:bg-brand-red/90 py-8 px-16 text-2xl shadow-[0_0_60px_rgba(255,0,0,0.4)] group w-full sm:w-auto">
                {data.botoes.final_whatsapp_texto}
                <MessageCircle className="w-8 h-8" />
              </a>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 pt-8">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-green" />
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Compra 100% Segura</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-brand-green" />
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Envio com Rastreio</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* 👣 FOOTER - LIMPO E PROFISSIONAL */}
      <footer className="py-20 bg-zinc-950 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="space-y-6 text-center md:text-left">
              <div className="text-3xl font-black italic tracking-tighter">
                LOT<span className="text-brand-red">SPORTS</span>
              </div>
              <p className="text-zinc-500 text-xs max-w-xs uppercase font-bold tracking-widest leading-loose">
                A maior loja de artigos esportivos premium do Brasil. Qualidade de jogador, preço de torcedor.
              </p>
            </div>
            
            <div className="flex gap-8">
              <a href={data.redes.instagram} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-zinc-400 hover:text-brand-red hover:bg-white/10 transition-all">
                <Instagram className="w-6 h-6" />
              </a>
              <a href={data.botoes.hero_whatsapp_link} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-zinc-400 hover:text-brand-green hover:bg-white/10 transition-all">
                <MessageCircle className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
              © 2026 LOT Sports. Todos os direitos reservados.
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 🔥 BARRA FIXA GRUPO VIP */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 w-full z-[60] bg-brand-dark/80 backdrop-blur-xl border-t border-brand-green/30 p-4 md:hidden"
      >
        <a 
          href={data.redes.grupoVip}
          className="btn-primary bg-brand-green hover:bg-brand-green/90 border-brand-green w-full py-4 flex items-center justify-center gap-3 font-black italic uppercase text-sm shadow-[0_-10px_30px_rgba(37,211,102,0.2)]"
        >
          <span className="animate-bounce">🔥</span> ACESSE O GRUPO VIP
        </a>
      </motion.div>

      {/* 💬 WHATSAPP FLUTUANTE */}
      <a 
        href={data.botoes.final_whatsapp_link}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-brand-green text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-red text-[10px] font-black flex items-center justify-center rounded-full animate-bounce">1</span>
        <div className="absolute right-20 bg-white text-black px-4 py-2 rounded-lg text-xs font-black italic uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
          {data.botoes.final_whatsapp_texto}
        </div>
      </a>

      {/* 🛎️ NOTIFICAÇÕES FAKE */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed bottom-24 left-8 z-[100] bg-zinc-900 border border-white/10 rounded-xl p-4 shadow-2xl flex items-center gap-4 max-w-xs"
          >
            <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white shrink-0 shadow-[0_0_20px_rgba(37,211,102,0.4)]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1 italic">Venda realizada!</p>
              <p className="text-xs text-white font-medium leading-tight">
                <span className="font-black italic text-brand-green uppercase">{notification.name}</span> de {notification.city} comprou {notification.product}
              </p>
              <p className="text-[8px] text-zinc-600 mt-1 uppercase font-bold">há 2 minutos • verificado</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ NOTIFICAÇÃO DE SUCESSO */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed top-24 right-8 z-[200] bg-brand-green text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-black italic uppercase text-xs"
          >
            <CheckCircle2 className="w-5 h-5" />
            Alterações salvas com sucesso!
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🛠️ PAINEL ADMIN / LOGIN */}
      <AnimatePresence>
        {canAccessAdmin && isAdminOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl overflow-y-auto"
          >
            {!isAuthenticated ? (
              <Login onLogin={() => setIsAuthenticated(true)} />
            ) : (
              <div className="p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                      <h2 className="text-3xl font-black italic uppercase">PAINEL DE <span className="text-brand-red">CONTROLE</span></h2>
                      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Gerencie sua landing page em tempo real</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={resetData}
                        className="flex items-center gap-2 text-[10px] font-black uppercase italic text-zinc-500 hover:text-brand-red transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Resetar Dados
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-[10px] font-black uppercase italic text-zinc-500 hover:text-white transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair
                      </button>
                      <button onClick={() => setIsAdminOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-8 h-8" />
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-12">
                    {/* 🏷️ BRANDING E HERO */}
                    <div className="space-y-8">
                      <div className="glass-card p-6">
                        <h3 className="text-xs font-black uppercase italic mb-4 text-brand-red flex items-center gap-2">
                          <Award className="w-4 h-4" /> Branding
                        </h3>
                        <div className="space-y-4">
                          <input 
                            type="text" 
                            value={data.branding?.nomeLoja || ''}
                            onChange={(e) => updateLocalData({ ...data, branding: { ...data.branding, nomeLoja: e.target.value } })}
                            placeholder="Nome da Loja"
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-brand-red outline-none transition-colors"
                          />
                          <input 
                            type="text" 
                            value={data.branding.anosMercado || ''}
                            onChange={(e) => updateLocalData({ ...data, branding: { ...data.branding, anosMercado: e.target.value } })}
                            placeholder="Anos de Mercado"
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-brand-red outline-none transition-colors"
                          />
                          <input 
                            type="text" 
                            value={data.branding.frete || ''}
                            onChange={(e) => updateLocalData({ ...data, branding: { ...data.branding, frete: e.target.value } })}
                            placeholder="Texto de Frete"
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-brand-red outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="glass-card p-6">
                        <h3 className="text-xs font-black uppercase italic mb-4 text-brand-red flex items-center gap-2">
                          <Play className="w-4 h-4" /> Hero Section
                        </h3>
                        <div className="bg-brand-red/10 border border-brand-red/20 rounded-lg p-3 mb-4">
                          <p className="text-[10px] text-brand-red font-black uppercase italic leading-tight">
                            💡 Dica: Aceitamos links do Google Drive, ImgBB e CDNs. <br/>
                            Para Google Drive, use o link de compartilhamento comum.
                          </p>
                        </div>
                        <div className="space-y-4">
                          <input 
                            type="text" 
                            value={data.textos.headline_principal || ''}
                            onChange={(e) => updateLocalData({ ...data, textos: { ...data.textos, headline_principal: e.target.value } })}
                            placeholder="Headline Principal"
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-brand-red outline-none transition-colors"
                          />
                          <textarea 
                            value={data.textos.subheadline_principal || ''}
                            onChange={(e) => updateLocalData({ ...data, textos: { ...data.textos, subheadline_principal: e.target.value } })}
                            placeholder="Subheadline"
                            rows={3}
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-brand-red outline-none transition-colors resize-none"
                          />
                          <input 
                            type="text" 
                            value={data.midia.video_vsl || ''}
                            onChange={(e) => updateLocalData({ ...data, midia: { ...data.midia, video_vsl: e.target.value } })}
                            placeholder="Link do Vídeo VSL (YouTube/Vimeo/MP4)"
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-brand-red outline-none transition-colors"
                          />
                          <input 
                            type="text" 
                            value={data.midia.thumbnail_vsl || ''}
                            onChange={(e) => updateLocalData({ ...data, midia: { ...data.midia, thumbnail_vsl: e.target.value } })}
                            placeholder="Link da Thumbnail do VSL"
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-brand-red outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="glass-card p-6">
                        <h3 className="text-xs font-black uppercase italic mb-4 text-brand-red flex items-center gap-2">
                          <TrendingDown className="w-4 h-4" /> Preços
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            value={data.precos.comparativo_original || ''}
                            onChange={(e) => updateLocalData({ ...data, precos: { ...data.precos, comparativo_original: e.target.value } })}
                            placeholder="Original (ex: 349,90)"
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-brand-red outline-none transition-colors"
                          />
                          <input 
                            type="text" 
                            value={data.precos.comparativo_lot || ''}
                            onChange={(e) => updateLocalData({ ...data, precos: { ...data.precos, comparativo_lot: e.target.value } })}
                            placeholder="Lot (ex: 161,49)"
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-brand-red outline-none transition-colors"
                          />
                          <input 
                            type="text" 
                            value={data.precos.hero_preco_destaque || ''}
                            onChange={(e) => updateLocalData({ ...data, precos: { ...data.precos, hero_preco_destaque: e.target.value } })}
                            placeholder="Hero Destaque (ex: 161,49)"
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-brand-red outline-none transition-colors"
                          />
                          <input 
                            type="text" 
                            value={data.precos.oferta_preco_unitario || ''}
                            onChange={(e) => updateLocalData({ ...data, precos: { ...data.precos, oferta_preco_unitario: e.target.value } })}
                            placeholder="Oferta Unitário"
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-brand-red outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 🔗 LINKS E BOTÕES */}
                    <div className="space-y-8">
                      <div className="glass-card p-6">
                        <h3 className="text-xs font-black uppercase italic mb-4 text-brand-red flex items-center gap-2">
                          <Globe className="w-4 h-4" /> Botões e Links
                        </h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={data.botoes.hero_whatsapp_texto || ''} onChange={(e) => updateLocalData({ ...data, botoes: { ...data.botoes, hero_whatsapp_texto: e.target.value } })} placeholder="Hero WhatsApp Texto" className="bg-black border border-white/10 rounded p-2 text-xs outline-none focus:border-brand-red" />
                            <input type="text" value={data.botoes.hero_whatsapp_link || ''} onChange={(e) => updateLocalData({ ...data, botoes: { ...data.botoes, hero_whatsapp_link: e.target.value } })} placeholder="Hero WhatsApp Link" className="bg-black border border-white/10 rounded p-2 text-xs outline-none focus:border-brand-red" />
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            <input type="text" value={data.botoes.hero_link || ''} onChange={(e) => updateLocalData({ ...data, botoes: { ...data.botoes, hero_link: e.target.value } })} placeholder="Link Principal (Site/Checkout)" className="bg-black border border-white/10 rounded p-2 text-xs outline-none focus:border-brand-red font-bold text-brand-green" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={data.botoes.hero_site_texto || ''} onChange={(e) => updateLocalData({ ...data, botoes: { ...data.botoes, hero_site_texto: e.target.value } })} placeholder="Hero Site Texto" className="bg-black border border-white/10 rounded p-2 text-xs outline-none focus:border-brand-red" />
                            <input type="text" value={data.botoes.final_site_texto || ''} onChange={(e) => updateLocalData({ ...data, botoes: { ...data.botoes, final_site_texto: e.target.value } })} placeholder="Final Site Texto" className="bg-black border border-white/10 rounded p-2 text-xs outline-none focus:border-brand-red" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={data.botoes.oferta_cta_texto || ''} onChange={(e) => updateLocalData({ ...data, botoes: { ...data.botoes, oferta_cta_texto: e.target.value } })} placeholder="Oferta CTA Texto" className="bg-black border border-white/10 rounded p-2 text-xs outline-none focus:border-brand-red" />
                            <input type="text" value={data.botoes.final_whatsapp_texto || ''} onChange={(e) => updateLocalData({ ...data, botoes: { ...data.botoes, final_whatsapp_texto: e.target.value } })} placeholder="Final WhatsApp Texto" className="bg-black border border-white/10 rounded p-2 text-xs outline-none focus:border-brand-red" />
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            <input type="text" value={data.botoes.final_whatsapp_link || ''} onChange={(e) => updateLocalData({ ...data, botoes: { ...data.botoes, final_whatsapp_link: e.target.value } })} placeholder="Final WhatsApp Link" className="bg-black border border-white/10 rounded p-2 text-xs outline-none focus:border-brand-red" />
                          </div>
                        </div>
                      </div>

                      <div className="glass-card p-6">
                        <h3 className="text-xs font-black uppercase italic mb-4 text-brand-red flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4" /> Oferta e Urgência
                        </h3>
                        <div className="space-y-4">
                          <input 
                            type="text" 
                            value={data.textos.oferta_titulo || ''}
                            onChange={(e) => updateLocalData({ ...data, textos: { ...data.textos, oferta_titulo: e.target.value } })}
                            placeholder="Título da Oferta"
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-brand-red outline-none transition-colors"
                          />
                          <input 
                            type="text" 
                            value={data.textos.oferta_subtitulo || ''}
                            onChange={(e) => updateLocalData({ ...data, textos: { ...data.textos, oferta_subtitulo: e.target.value } })}
                            placeholder="Subtítulo da Oferta"
                            className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-brand-red outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="glass-card p-6">
                        <h3 className="text-xs font-black uppercase italic mb-4 text-brand-red flex items-center gap-2">
                          <Instagram className="w-4 h-4" /> Redes Sociais
                        </h3>
                        <div className="space-y-4">
                          <input type="text" value={data.redes.instagram || ''} onChange={(e) => updateLocalData({ ...data, redes: { ...data.redes, instagram: e.target.value } })} placeholder="Link Instagram" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-brand-red outline-none transition-colors" />
                          <input type="text" value={data.redes.grupoVip || ''} onChange={(e) => updateLocalData({ ...data, redes: { ...data.redes, grupoVip: e.target.value } })} placeholder="Link Grupo VIP" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-brand-red outline-none transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>

                    <div className="glass-card p-6">
                      <h3 className="text-xs font-black uppercase italic mb-4 text-brand-red flex items-center gap-2">
                        <Award className="w-4 h-4" /> Títulos das Seções
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" value={data.textos.comparativo_titulo || ''} onChange={(e) => updateLocalData({ ...data, textos: { ...data.textos, comparativo_titulo: e.target.value } })} placeholder="Título Comparativo" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-brand-red" />
                        <input type="text" value={data.textos.comparativo_subtitulo || ''} onChange={(e) => updateLocalData({ ...data, textos: { ...data.textos, comparativo_subtitulo: e.target.value } })} placeholder="Subtítulo Comparativo" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-brand-red" />
                        <input type="text" value={data.textos.beneficios_titulo || ''} onChange={(e) => updateLocalData({ ...data, textos: { ...data.textos, beneficios_titulo: e.target.value } })} placeholder="Título Benefícios" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-brand-red" />
                        <input type="text" value={data.textos.galeria_titulo || ''} onChange={(e) => updateLocalData({ ...data, textos: { ...data.textos, galeria_titulo: e.target.value } })} placeholder="Título Nossos Mantos" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-brand-red" />
                        <input type="text" value={data.textos.depoimentos_titulo || ''} onChange={(e) => updateLocalData({ ...data, textos: { ...data.textos, depoimentos_titulo: e.target.value } })} placeholder="Título Depoimentos" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-brand-red" />
                        <input type="text" value={data.textos.prints_titulo || ''} onChange={(e) => updateLocalData({ ...data, textos: { ...data.textos, prints_titulo: e.target.value } })} placeholder="Título Prints" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-brand-red" />
                        <input type="text" value={data.textos.faq_titulo || ''} onChange={(e) => updateLocalData({ ...data, textos: { ...data.textos, faq_titulo: e.target.value } })} placeholder="Título FAQ" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-brand-red" />
                        <input type="text" value={data.textos.como_funciona_titulo || ''} onChange={(e) => updateLocalData({ ...data, textos: { ...data.textos, como_funciona_titulo: e.target.value } })} placeholder="Título Como Funciona" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-brand-red" />
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <h3 className="text-xs font-black uppercase italic mb-6 text-brand-red flex justify-between items-center">
                        🗣️ Depoimentos
                        <button onClick={() => updateLocalData({ ...data, depoimentos: [...data.depoimentos, { nome: "Novo Cliente", texto: "Depoimento aqui", cidade: "São Paulo, SP", tempo: "há 2 dias", avatar: "" }] })} className="btn-secondary py-2 px-4 text-[10px]">ADICIONAR</button>
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {(data.depoimentos || []).map((dep, i) => (
                          <div key={i} className="p-4 bg-black/40 rounded border border-white/5 space-y-3">
                            <input type="text" value={dep.nome || ''} onChange={(e) => { const n = [...data.depoimentos]; n[i].nome = e.target.value; updateLocalData({ ...data, depoimentos: n }); }} placeholder="Nome do Cliente" className="w-full bg-black border border-white/10 p-2 text-xs" />
                            <div className="grid grid-cols-2 gap-2">
                              <input type="text" value={dep.cidade || ''} onChange={(e) => { const n = [...data.depoimentos]; n[i].cidade = e.target.value; updateLocalData({ ...data, depoimentos: n }); }} placeholder="Cidade/UF" className="w-full bg-black border border-white/10 p-2 text-xs" />
                              <input type="text" value={dep.tempo || ''} onChange={(e) => { const n = [...data.depoimentos]; n[i].tempo = e.target.value; updateLocalData({ ...data, depoimentos: n }); }} placeholder="Tempo (ex: há 2 dias)" className="w-full bg-black border border-white/10 p-2 text-xs" />
                            </div>
                            <input type="text" value={dep.avatar || ''} onChange={(e) => { const n = [...data.depoimentos]; n[i].avatar = e.target.value; updateLocalData({ ...data, depoimentos: n }); }} placeholder="URL do Avatar" className="w-full bg-black border border-white/10 p-2 text-xs" />
                            <textarea value={dep.texto || ''} onChange={(e) => { const n = [...data.depoimentos]; n[i].texto = e.target.value; updateLocalData({ ...data, depoimentos: n }); }} placeholder="Depoimento" className="w-full bg-black border border-white/10 p-2 text-xs resize-none" rows={2} />
                            <button onClick={() => updateLocalData({ ...data, depoimentos: data.depoimentos.filter((_, idx) => idx !== i) })} className="text-[10px] text-brand-red uppercase font-black">Remover</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <h3 className="text-xs font-black uppercase italic mb-6 text-brand-red flex justify-between items-center">
                        ✅ Benefícios
                        <button onClick={() => updateLocalData({ ...data, beneficios: [...data.beneficios, { titulo: "Novo Benefício", descricao: "Descrição aqui" }] })} className="btn-secondary py-2 px-4 text-[10px]">ADICIONAR</button>
                      </h3>
                      <div className="space-y-4">
                        {(data.beneficios || []).map((ben, i) => (
                          <div key={i} className="p-4 bg-black/40 rounded border border-white/5 space-y-2">
                            <input type="text" value={ben.titulo || ''} onChange={(e) => { const n = [...data.beneficios]; n[i].titulo = e.target.value; updateLocalData({ ...data, beneficios: n }); }} placeholder="Título" className="w-full bg-black border border-white/10 p-2 text-xs" />
                            <textarea value={ben.descricao || ''} onChange={(e) => { const n = [...data.beneficios]; n[i].descricao = e.target.value; updateLocalData({ ...data, beneficios: n }); }} placeholder="Descrição" className="w-full bg-black border border-white/10 p-2 text-xs resize-none" rows={2} />
                            <button onClick={() => updateLocalData({ ...data, beneficios: data.beneficios.filter((_, idx) => idx !== i) })} className="text-[10px] text-brand-red uppercase font-black">Remover</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <h3 className="text-xs font-black uppercase italic mb-6 text-brand-red flex justify-between items-center">
                        ❓ FAQ
                        <button onClick={() => updateLocalData({ ...data, faq: [...data.faq, { pergunta: "Nova Pergunta", resposta: "Nova Resposta" }] })} className="btn-secondary py-2 px-4 text-[10px]">ADICIONAR</button>
                      </h3>
                      <div className="space-y-4">
                        {(data.faq || []).map((item, i) => (
                          <div key={i} className="p-4 bg-black/40 rounded border border-white/5 space-y-2">
                            <input type="text" value={item.pergunta || ''} onChange={(e) => { const n = [...data.faq]; n[i].pergunta = e.target.value; updateLocalData({ ...data, faq: n }); }} className="w-full bg-black border border-white/10 p-2 text-xs" />
                            <textarea value={item.resposta || ''} onChange={(e) => { const n = [...data.faq]; n[i].resposta = e.target.value; updateLocalData({ ...data, faq: n }); }} className="w-full bg-black border border-white/10 p-2 text-xs resize-none" rows={2} />
                            <button onClick={() => updateLocalData({ ...data, faq: data.faq.filter((_, idx) => idx !== i) })} className="text-[10px] text-brand-red uppercase font-black">Remover</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <h3 className="text-xs font-black uppercase italic mb-6 text-brand-red flex justify-between items-center">
                        📸 Prints de Clientes
                        <button onClick={() => updateLocalData({ ...data, midia: { ...data.midia, prints: [...data.midia.prints, { legenda: "Novo Print", url: "https://picsum.photos/seed/print/600/400" }] } })} className="btn-secondary py-2 px-4 text-[10px]">ADICIONAR</button>
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {(data.midia?.prints || []).map((print, i) => (
                          <div key={i} className="p-4 bg-black/40 rounded border border-white/5 space-y-2">
                            <input type="text" value={print.legenda || ''} onChange={(e) => { const n = [...data.midia.prints]; n[i].legenda = e.target.value; updateLocalData({ ...data, midia: { ...data.midia, prints: n } }); }} className="w-full bg-black border border-white/10 p-2 text-xs" />
                            <input type="text" value={print.url || ''} onChange={(e) => { const n = [...data.midia.prints]; n[i].url = e.target.value; updateLocalData({ ...data, midia: { ...data.midia, prints: n } }); }} className="w-full bg-black border border-white/10 p-2 text-[10px]" />
                            <button onClick={() => updateLocalData({ ...data, midia: { ...data.midia, prints: data.midia.prints.filter((_, idx) => idx !== i) } })} className="text-[10px] text-brand-red uppercase font-black">Remover</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <h3 className="text-xs font-black uppercase italic mb-6 text-brand-red flex justify-between items-center">
                        🛠️ Como Funciona
                        <button onClick={() => updateLocalData({ ...data, comoFunciona: { ...data.comoFunciona, passos: [...data.comoFunciona.passos, { titulo: "Novo Passo", descricao: "Descrição aqui" }] } })} className="btn-secondary py-2 px-4 text-[10px]">ADICIONAR</button>
                      </h3>
                      <div className="space-y-4">
                        {(data.comoFunciona?.passos || []).map((passo, i) => (
                          <div key={i} className="p-4 bg-black/40 rounded border border-white/5 space-y-2">
                            <input type="text" value={passo.titulo || ''} onChange={(e) => { const n = [...data.comoFunciona.passos]; n[i].titulo = e.target.value; updateLocalData({ ...data, comoFunciona: { ...data.comoFunciona, passos: n } }); }} className="w-full bg-black border border-white/10 p-2 text-xs" />
                            <textarea value={passo.descricao || ''} onChange={(e) => { const n = [...data.comoFunciona.passos]; n[i].descricao = e.target.value; updateLocalData({ ...data, comoFunciona: { ...data.comoFunciona, passos: n } }); }} className="w-full bg-black border border-white/10 p-2 text-xs resize-none" rows={2} />
                            <button onClick={() => updateLocalData({ ...data, comoFunciona: { ...data.comoFunciona, passos: data.comoFunciona.passos.filter((_, idx) => idx !== i) } })} className="text-[10px] text-brand-red uppercase font-black">Remover</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <h3 className="text-xs font-black uppercase italic mb-6 text-brand-red flex justify-between items-center">
                        👕 Nossos Mantos (Vitrine)
                        <button onClick={() => updateLocalData({ ...data, produtos: [...(data.produtos || []), { nome: "Nova Camisa", preco: "R$ 161,49", imagem: "https://picsum.photos/seed/jersey/600/800.jpg", link: "https://lotsports.com.br", vendidosHoje: "15 vendidos hoje", estoque: "Estoque baixo", avaliacoes: "+40 avaliações" }] })} className="btn-secondary py-2 px-4 text-[10px]">ADICIONAR PRODUTO</button>
                      </h3>
                      <div className="bg-brand-red/10 border border-brand-red/20 rounded-lg p-3 mb-6">
                        <p className="text-[10px] text-brand-red font-black uppercase italic leading-tight">
                          ✅ Suporte total: Google Drive, ImgBB, Dropbox e links diretos. <br/>
                          <span className="text-white">Dica ImgBB:</span> Não use o link da página (ibb.co/xxx). Use a opção <span className="text-white">"Link Direto"</span> (i.ibb.co/xxx.jpg).
                        </p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {(data.produtos || []).map((prod, i) => (
                          <div key={i} className="p-4 bg-black/40 rounded border border-white/5 space-y-2">
                            <input type="text" value={prod.nome || ''} onChange={(e) => { const n = [...data.produtos]; n[i].nome = e.target.value; updateLocalData({ ...data, produtos: n }); }} placeholder="Nome do Produto" className="w-full bg-black border border-white/10 p-2 text-xs" />
                            <div className="grid grid-cols-2 gap-2">
                              <input type="text" value={prod.preco || ''} onChange={(e) => { const n = [...data.produtos]; n[i].preco = e.target.value; updateLocalData({ ...data, produtos: n }); }} placeholder="Preço (ex: R$ 161,49)" className="w-full bg-black border border-white/10 p-2 text-xs" />
                              <input type="text" value={prod.avaliacoes || ''} onChange={(e) => { const n = [...data.produtos]; n[i].avaliacoes = e.target.value; updateLocalData({ ...data, produtos: n }); }} placeholder="Avaliações (ex: +100 avaliações)" className="w-full bg-black border border-white/10 p-2 text-xs" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <input type="text" value={prod.vendidosHoje || ''} onChange={(e) => { const n = [...data.produtos]; n[i].vendidosHoje = e.target.value; updateLocalData({ ...data, produtos: n }); }} placeholder="Vendidos (ex: 20 hoje)" className="w-full bg-black border border-white/10 p-2 text-xs" />
                              <input type="text" value={prod.estoque || ''} onChange={(e) => { const n = [...data.produtos]; n[i].estoque = e.target.value; updateLocalData({ ...data, produtos: n }); }} placeholder="Estoque (ex: 5 unidades)" className="w-full bg-black border border-white/10 p-2 text-xs" />
                            </div>
                            <input type="text" value={prod.imagem || ''} onChange={(e) => { const n = [...data.produtos]; n[i].imagem = e.target.value; updateLocalData({ ...data, produtos: n }); }} placeholder="URL da Imagem" className="w-full bg-black border border-white/10 p-2 text-[10px]" />
                            <input type="text" value={prod.link || ''} onChange={(e) => { const n = [...data.produtos]; n[i].link = e.target.value; updateLocalData({ ...data, produtos: n }); }} placeholder="Link do Produto" className="w-full bg-black border border-white/10 p-2 text-[10px]" />
                            <button onClick={() => updateLocalData({ ...data, produtos: data.produtos.filter((_, idx) => idx !== i) })} className="text-[10px] text-brand-red uppercase font-black">Remover Produto</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <h3 className="text-xs font-black uppercase italic mb-4 text-brand-red flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Garantia
                      </h3>
                      <div className="space-y-4">
                        <input 
                          type="text" 
                          value={data.textos.garantia_titulo || ''}
                          onChange={(e) => updateLocalData({ ...data, textos: { ...data.textos, garantia_titulo: e.target.value } })}
                          placeholder="Título da Garantia"
                          className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-brand-red outline-none transition-colors"
                        />
                        <textarea 
                          value={data.textos.garantia_texto || ''}
                          onChange={(e) => updateLocalData({ ...data, textos: { ...data.textos, garantia_texto: e.target.value } })}
                          placeholder="Texto da Garantia"
                          rows={3}
                          className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-brand-red outline-none transition-colors resize-none"
                        />
                      </div>
                    </div>

                    <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-6 pb-20">
                    <button 
                      onClick={() => setIsAdminOpen(false)}
                      className="btn-secondary py-6 px-20 text-xl flex items-center gap-4 w-full md:w-auto"
                    >
                      <Eye className="w-6 h-6" />
                      VISUALIZAR LANDING
                    </button>
                    <button 
                      onClick={syncWithSupabase}
                      disabled={isSaving}
                      className="btn-primary py-6 px-20 text-xl flex items-center gap-4 w-full md:w-auto disabled:opacity-50"
                    >
                      {isSaving ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Save className="w-6 h-6" />
                      )}
                      {isSaving ? 'SALVANDO...' : 'SALVAR E FECHAR'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
