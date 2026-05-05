/**
 * ARQUIVO DE CONFIGURAÇÃO CENTRAL DA LANDING PAGE
 * Edite este objeto para alterar todo o conteúdo do site.
 */

export interface LandingData {
  branding: {
    nomeLoja: string;
    anosMercado: string;
    frete: string;
  };
  textos: {
    headline_principal: string;
    subheadline_principal: string;
    comparativo_titulo: string;
    comparativo_subtitulo: string;
    oferta_titulo: string;
    oferta_subtitulo: string;
    beneficios_titulo: string;
    galeria_titulo: string;
    depoimentos_titulo: string;
    prints_titulo: string;
    faq_titulo: string;
    como_funciona_titulo: string;
    garantia_titulo: string;
    garantia_texto: string;
    cta_final_titulo: string;
    cta_final_subtitulo: string;
  };
  precos: {
    hero_preco_destaque: string;
    hero_texto_destaque: string;
    comparativo_original: string;
    comparativo_lot: string;
    oferta_preco_unitario: string;
    oferta_preco_total: string;
    oferta_parcelamento: string;
  };
  botoes: {
    hero_whatsapp_texto: string;
    hero_whatsapp_link: string;
    hero_site_texto: string;
    hero_link: string; // Master link
    hero_site_link?: string; // Legacy
    oferta_cta_texto: string;
    oferta_cta_link: string;
    final_whatsapp_texto: string;
    final_whatsapp_link: string;
    final_site_texto: string;
    final_site_link?: string; // Legacy
  };
  midia: {
    video_vsl: string;
    thumbnail_vsl: string;
    imagem_hero: string;
    prints: { url: string; legenda: string }[];
  };
  depoimentos: {
    nome: string;
    texto: string;
  }[];
  beneficios: {
    titulo: string;
    descricao: string;
  }[];
  faq: {
    pergunta: string;
    resposta: string;
  }[];
  redes: {
    instagram: string;
    grupoVip: string;
  };
  comoFunciona: {
    passos: { titulo: string; descricao: string }[];
  };
  produtos: {
    nome: string;
    preco: string;
    imagem: string;
    link: string;
  }[];
}

export const defaultData: LandingData = {
  branding: {
    nomeLoja: "LOT Sports",
    anosMercado: "6 anos de mercado",
    frete: "Frete grátis para todo o Brasil"
  },
  textos: {
    headline_principal: "CARREGANDO...",
    subheadline_principal: "Os melhores mantos estão chegando...",
    comparativo_titulo: "POR QUE PAGAR MAIS CARO?",
    comparativo_subtitulo: "A mesma qualidade, por menos da metade do preço.",
    oferta_titulo: "LEVE 3, PAGUE 2",
    oferta_subtitulo: "Só hoje / Estoque limitado",
    beneficios_titulo: "POR QUE ESCOLHER A LOT SPORTS?",
    galeria_titulo: "NOSSOS MANTOS",
    depoimentos_titulo: "O QUE DIZEM NOSSOS CLIENTES",
    prints_titulo: "PROVA REAL NO WHATSAPP",
    faq_titulo: "DÚVIDAS FREQUENTES",
    como_funciona_titulo: "COMO FUNCIONA O PROCESSO?",
    garantia_titulo: "SATISFAÇÃO GARANTIDA",
    garantia_texto: "Ou você ama ou devolvemos seu dinheiro. Oferecemos 7 dias de garantia incondicional.",
    cta_final_titulo: "NÃO PERCA ESSA PROMOÇÃO",
    cta_final_subtitulo: "Leve 3, pague 2 ainda disponível. Escolha seu time agora."
  },
  precos: {
    hero_preco_destaque: "---",
    hero_texto_destaque: "no Pix",
    comparativo_original: "---",
    comparativo_lot: "---",
    oferta_preco_unitario: "---",
    oferta_preco_total: "---",
    oferta_parcelamento: "Calculando parcelas..."
  },
  botoes: {
    hero_whatsapp_texto: "Falar no WhatsApp",
    hero_whatsapp_link: "https://wa.me/5511999999999",
    hero_site_texto: "QUERO MINHA CAMISA AGORA",
    hero_link: "https://lotsports.com.br",
    oferta_cta_texto: "GARANTIR MINHAS CAMISAS",
    oferta_cta_link: "https://lotsports.com.br",
    final_whatsapp_texto: "FALAR NO WHATSAPP",
    final_whatsapp_link: "https://wa.me/5511999999999",
    final_site_texto: "COMPRAR AGORA",
  },
  midia: {
    video_vsl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail_vsl: "https://picsum.photos/seed/vsl-thumb/1280/720.jpg",
    imagem_hero: "https://picsum.photos/seed/hero/1920/1080.jpg",
    prints: [
      { url: "https://picsum.photos/seed/proof-1/800/600.jpg", legenda: "Cliente satisfeito no WhatsApp" },
      { url: "https://picsum.photos/seed/proof-2/800/600.jpg", legenda: "Unboxing real do produto" }
    ]
  },
  depoimentos: [
    {
      nome: "Ricardo S.",
      texto: "Qualidade absurda, parece original! Comprei 3 e vou comprar mais!"
    },
    {
      nome: "Juliana M.",
      texto: "Entrega rápida e produto top! O atendimento no WhatsApp foi excelente."
    },
    {
      nome: "Marcos P.",
      texto: "Melhor custo-benefício que já encontrei. As camisas são impecáveis."
    }
  ],
  beneficios: [
    {
      titulo: "Taxas e impostos por nossa conta",
      descricao: "Você paga apenas o valor anunciado. Nós cuidamos de toda a burocracia e impostos de importação."
    },
    {
      titulo: "Frete grátis para todo Brasil",
      descricao: "Entrega segura e rastreada sem custo adicional para qualquer cidade do país."
    },
    {
      titulo: "Conforto premium com tecnologia Dry-Fit",
      descricao: "Tecido leve que não esquenta e mantém seu corpo seco mesmo nos dias mais quentes."
    },
    {
      titulo: "Alta durabilidade (não desbota)",
      descricao: "Cores vivas mesmo após várias lavagens, sem desbotar ou perder qualidade."
    }
  ],
  faq: [
    {
      pergunta: "É igual a original?",
      resposta: "Nossas camisas são versão torcedor com altíssima qualidade, utilizando os mesmos padrões de tecido e acabamento premium das oficiais."
    },
    {
      pergunta: "Quanto tempo demora?",
      resposta: "O prazo médio de entrega é de 12 a 20 dias úteis, com rastreio completo enviado para seu e-mail e WhatsApp."
    }
  ],
  redes: {
    instagram: "https://instagram.com/lotsports",
    grupoVip: "https://t.me/lotsports_vip"
  },
  comoFunciona: {
    passos: [
      { titulo: "Escolha seu Manto", descricao: "Navegue pelo nosso catálogo e escolha suas camisas favoritas." },
      { titulo: "Finalize o Pedido", descricao: "Pagamento seguro via Pix ou Cartão com desconto exclusivo." },
      { titulo: "Acompanhe o Envio", descricao: "Receba o código de rastreio e acompanhe até chegar na sua casa." }
    ]
  },
  produtos: [
    {
      nome: "Camisa Brasil Home 2024",
      preco: "R$ 161,49",
      imagem: "https://picsum.photos/seed/br-2024/600/800.jpg",
      link: "https://lotsports.com.br/produto/brasil-home-2024"
    },
    {
      nome: "Camisa Flamengo Home 2024",
      preco: "R$ 161,49",
      imagem: "https://picsum.photos/seed/fla-2024/600/800.jpg",
      link: "https://lotsports.com.br/produto/flamengo-home-2024"
    },
    {
      nome: "Camisa Real Madrid 2024",
      preco: "R$ 161,49",
      imagem: "https://picsum.photos/seed/real-2024/600/800.jpg",
      link: "https://lotsports.com.br/produto/real-madrid-2024"
    },
    {
      nome: "Camisa Inter Miami 2024",
      preco: "R$ 161,49",
      imagem: "https://picsum.photos/seed/miami-2024/600/800.jpg",
      link: "https://lotsports.com.br/produto/inter-miami-2024"
    }
  ]
};
