export const entidadesPorCategoria = {
  "A": {
    nome: "Presidente da República",
    entidades: [
      "Presidência da República",
      "Casa Civil",
      "Casa Militar",
      "Gabinete do Presidente da República",
      "Gabinete da Primeira-Dama",
      "Serviços de Apoio ao Presidente da República"
    ]
  },
  "B": {
    nome: "Assembleia Nacional",
    entidades: [
      "Gabinete do Presidente da Assembleia Nacional",
      "Secretariado-Geral da Assembleia Nacional",
      "Grupos Parlamentares dos Partidos Políticos",
      "Serviços Técnicos e Administrativos da Assembleia Nacional"
    ]
  },
  "C": {
    nome: "Governo (Executivo Central)",
    hasSubcategories: true,
    subcategorias: {
      "ministerios": {
        nome: "Ministérios",
        entidades: [
          "Vice-Presidência da República",
          "Conselho de Ministros",
          "Ministério da Administração do Território (MAT)",
          "Ministério das Finanças (MINFIN)",
          "Ministério da Economia e Planeamento (MEP)",
          "Ministério dos Recursos Minerais, Petróleo e Gás (MIREMPET)",
          "Ministério da Energia e Águas (MINEA)",
          "Ministério da Agricultura e Florestas (MINAGRIF)",
          "Ministério das Pescas e Recursos Marinhos (MINPRM)",
          "Ministério da Indústria e Comércio (MINDCOM)",
          "Ministério das Obras Públicas, Urbanismo e Habitação (MINOPUH)",
          "Ministério dos Transportes (MINTRANS)",
          "Ministério das Telecomunicações, Tecnologias de Informação e Comunicação Social (MINTTICS)",
          "Ministério da Educação (MED)",
          "Ministério do Ensino Superior, Ciência, Tecnologia e Inovação (MESCTI)",
          "Ministério da Saúde (MINSA)",
          "Ministério da Cultura e Turismo (MINCULTUR)",
          "Ministério da Administração Pública, Trabalho e Segurança Social (MAPTSS)",
          "Ministério da Justiça e dos Direitos Humanos (MINJUSDH)",
          "Ministério do Interior (MININT)",
          "Ministério da Defesa Nacional, Antigos Combatentes e Veteranos da Pátria (MDNACVP)",
          "Ministério do Ambiente (MINAMB)",
          "Ministério da Juventude e Desportos (MINJUD)",
          "Ministério das Relações Exteriores (MIREX)"
        ]
      },
      "institutos": {
        nome: "Institutos Públicos",
        entidades: [
          "Instituto Nacional de Segurança Social (INSS)",
          "Instituto Nacional de Estatística (INE)",
          "Instituto Nacional de Saúde Pública",
          "Instituto de Investigação Científica de Angola (IICA)",
          "Instituto Nacional de Gestão de Bolsas de Estudo (INAGBE)",
          "Instituto Nacional de Formação de Quadros (INFQ)",
          "Instituto Nacional de Meteorologia e Geofísica (INAMET)",
          "Instituto de Desenvolvimento Agrário de Angola (IDA)",
          "Instituto Nacional de Investigação Veterinária (INIV)",
          "Instituto Nacional de Investigação Agrária (INIA)",
          "Instituto Marítimo e Portuário de Angola (IMPA)",
          "Instituto Nacional de Aviação Civil (INÁCIA)",
          "Instituto de Estradas de Angola (INEA)",
          "Instituto Geográfico e Cadastral de Angola (IGCA)",
          "Instituto Nacional do Petróleo (INP)",
          "Instituto Geológico de Angola",
          "Instituto Nacional de Minas (INAM)",
          "Instituto de Desenvolvimento Florestal (IDF)",
          "Instituto Nacional da Qualidade (IANORQ)",
          "Instituto Nacional de Turismo (INATUR)"
        ]
      },
      "empresas": {
        nome: "Empresas Públicas",
        entidades: [
          "Sonangol - Sociedade Nacional de Combustíveis de Angola",
          "TAAG - Linhas Aéreas de Angola",
          "ENDE - Empresa Nacional de Distribuição de Electricidade",
          "Prodel - Empresa de Produção de Electricidade",
          "EPAL - Empresa Pública de Águas de Luanda",
          "Angola Telecom",
          "Multitel",
          "Correios de Angola",
          "ENDIAMA - Empresa Nacional de Diamantes de Angola",
          "FERRANGOL - Caminho de Ferro de Angola",
          "Porto de Luanda",
          "ENSA - Empresa Nacional de Seguros de Angola",
          "BCI - Banco de Comércio e Indústria",
          "BDA - Banco de Desenvolvimento de Angola",
          "BPC - Banco de Poupança e Crédito",
          "GRECIMA - Grémio de Criadores de Gado de Angola",
          "IFP - Instituto de Fomento Pesqueiro",
          "EMPA - Empresa de Meios de Pagamento de Angola",
          "SODIAM - Empresa de Comercialização de Diamantes",
          "Empresa Portuária de Lobito",
          "Empresa Portuária do Namibe",
          "Aeroportos de Angola"
        ]
      }
    }
  },
  "D": {
    nome: "Tribunais Superiores",
    entidades: [
      "Tribunal Constitucional",
      "Tribunal Supremo",
      "Tribunal de Contas",
      "Tribunal Militar Supremo"
    ]
  },
  "E": {
    nome: "Procuradoria-Geral da República",
    entidades: [
      "Procuradoria-Geral da República",
      "Serviços Centrais da PGR",
      "Direções Nacionais da PGR"
    ]
  },
  "F": {
    nome: "Outros Órgãos de Soberania",
    entidades: [
      "Comissão Nacional Eleitoral (CNE)",
      "Conselho de Segurança Nacional",
      "Provedoria de Justiça"
    ]
  }
};

export type CategoriaEntidade = keyof typeof entidadesPorCategoria;
