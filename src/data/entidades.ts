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
        hasTutelas: true,
        porTutela: {
          "MINFIN": {
            nome: "Ministério das Finanças",
            entidades: [
              "Instituto Nacional de Estatística (INE)",
              "Unidade de Gestão do Sector Empresarial Público (IGAPE)",
              "Autoridade Tributária / Administração Geral Tributária",
              "Serviços de Administração Aduaneira"
            ]
          },
          "MAPTSS": {
            nome: "Ministério da Administração Pública, Trabalho e Segurança Social",
            entidades: [
              "Instituto Nacional de Segurança Social (INSS)",
              "Instituto de Formação Profissional (ENAPP)"
            ]
          },
          "MINSA": {
            nome: "Ministério da Saúde",
            entidades: [
              "Instituto Nacional de Saúde Pública (INSP)",
              "Instituto Nacional de Alimentação e Nutrição"
            ]
          },
          "MESCTI": {
            nome: "Ministério do Ensino Superior, Ciência, Tecnologia e Inovação",
            entidades: [
              "Instituto de Investigação Científica de Angola (IICA)",
              "Instituto Nacional de Gestão de Bolsas de Estudo (INAGBE)",
              "Instituto Nacional de Formação de Quadros (INFQ)",
              "Instituto Nacional de Estudos e Pesquisa"
            ]
          },
          "MIREMPET": {
            nome: "Ministério dos Recursos Minerais, Petróleo e Gás",
            entidades: [
              "Instituto Nacional do Petróleo (INP)",
              "Instituto Geológico de Angola",
              "Instituto Nacional de Minas (INAM)",
              "Agência Nacional de Petróleo"
            ]
          },
          "MINAGRIF": {
            nome: "Ministério da Agricultura e Florestas",
            entidades: [
              "Instituto de Desenvolvimento Agrário de Angola (IDA)",
              "Instituto Nacional de Investigação Veterinária (INIV)",
              "Instituto Nacional de Investigação Agrária (INIA)",
              "Instituto de Desenvolvimento Florestal (IDF)",
              "Instituto Nacional de Investigação Agronómica"
            ]
          },
          "MINTRANS": {
            nome: "Ministério dos Transportes",
            entidades: [
              "Instituto Marítimo e Portuário de Angola (IMPA)",
              "Instituto Nacional de Aviação Civil (INÁCIA)",
              "Agência Reguladora de Certificação de Carga e Logística de Angola (ARCCLA)"
            ]
          },
          "MINOPUH": {
            nome: "Ministério das Obras Públicas, Urbanismo e Habitação",
            entidades: [
              "Instituto de Estradas de Angola (INEA)",
              "Instituto Geográfico e Cadastral de Angola (IGCA)",
              "Instituto Nacional de Habitação",
              "Empresa Nacional de Estradas"
            ]
          },
          "MEP": {
            nome: "Ministério da Economia e Planeamento",
            entidades: [
              "Instituto Nacional da Qualidade (IANORQ)",
              "Instituto de Propriedade Industrial (INAPI)"
            ]
          },
          "MINCULTUR": {
            nome: "Ministério da Cultura e Turismo",
            entidades: [
              "Instituto Nacional de Turismo (INATUR)",
              "Entidade Nacional de Turismo"
            ]
          },
          "MINEA": {
            nome: "Ministério da Energia e Águas",
            entidades: [
              "Instituto Nacional de Meteorologia e Geofísica (INAMET)"
            ]
          }
        }
      },
      "empresas": {
        nome: "Empresas Públicas",
        hasTutelas: true,
        porTutela: {
          "MIREMPET": {
            nome: "Ministério dos Recursos Minerais, Petróleo e Gás",
            entidades: [
              "Sonangol - Sociedade Nacional de Combustíveis de Angola",
              "ENDIAMA - Empresa Nacional de Diamantes de Angola",
              "SODIAM - Empresa de Comercialização de Diamantes",
              "Empresa Nacional de Hidrocarbonetos"
            ]
          },
          "MINTRANS": {
            nome: "Ministério dos Transportes",
            entidades: [
              "TAAG - Linhas Aéreas de Angola",
              "FERRANGOL - Caminho de Ferro de Angola",
              "ENANA - Empresa Nacional de Navegação Aérea",
              "Sonair - Empresa de Aviação",
              "Administração do Porto de Luanda",
              "Porto de Luanda - Empresa Portuária",
              "Empresa Portuária de Lobito",
              "Empresa Portuária do Namibe",
              "Aeroportos de Angola",
              "Sociedade Gestora de Aeroportos"
            ]
          },
          "MINEA": {
            nome: "Ministério da Energia e Águas",
            entidades: [
              "ENDE - Empresa Nacional de Distribuição de Electricidade",
              "Prodel - Empresa de Produção de Electricidade",
              "EPAL - Empresa Pública de Águas de Luanda",
              "Empresa Nacional de Águas"
            ]
          },
          "MINFIN": {
            nome: "Ministério das Finanças",
            entidades: [
              "BCI - Banco de Comércio e Indústria",
              "BDA - Banco de Desenvolvimento de Angola",
              "BPC - Banco de Poupança e Crédito",
              "ENSA - Empresa Nacional de Seguros de Angola",
              "EMPA - Empresa de Meios de Pagamento de Angola"
            ]
          },
          "MINTTICS": {
            nome: "Ministério das Telecomunicações, Tecnologias de Informação e Comunicação Social",
            entidades: [
              "Angola Telecom",
              "Multitel",
              "Correios de Angola",
              "Televisão Pública de Angola (TPA)",
              "Rádio Nacional de Angola (RNA)"
            ]
          },
          "MINPRM": {
            nome: "Ministério das Pescas e Recursos Marinhos",
            entidades: [
              "IFP - Instituto de Fomento Pesqueiro"
            ]
          },
          "MINAGRIF": {
            nome: "Ministério da Agricultura e Florestas",
            entidades: [
              "GRECIMA - Grémio de Criadores de Gado de Angola"
            ]
          },
          "MAT": {
            nome: "Ministério da Administração do Território",
            entidades: [
              "ELISAL - Empresa Nacional de Saneamento e Limpeza"
            ]
          },
          "MINDCOM": {
            nome: "Ministério da Indústria e Comércio",
            entidades: [
              "Empresa Nacional de Cervejas"
            ]
          }
        }
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
