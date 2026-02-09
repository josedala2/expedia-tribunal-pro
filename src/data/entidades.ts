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
  },
  "G": {
    nome: "Governos Provinciais",
    hasSubcategories: true,
    subcategorias: {
      "luanda": {
        nome: "Governo Provincial de Luanda",
        entidades: [
          "Governo Provincial de Luanda",
          "Administração Municipal de Belas",
          "Administração Municipal de Cacuaco",
          "Administração Municipal de Cazenga",
          "Administração Municipal de Icolo e Bengo",
          "Administração Municipal de Kilamba Kiaxi",
          "Administração Municipal de Luanda",
          "Administração Municipal de Quiçama",
          "Administração Municipal de Talatona",
          "Administração Municipal de Viana"
        ]
      },
      "benguela": {
        nome: "Governo Provincial de Benguela",
        entidades: [
          "Governo Provincial de Benguela",
          "Administração Municipal de Balombo",
          "Administração Municipal de Baía Farta",
          "Administração Municipal de Benguela",
          "Administração Municipal de Bocoio",
          "Administração Municipal de Caimbambo",
          "Administração Municipal de Catumbela",
          "Administração Municipal de Chongoroi",
          "Administração Municipal de Cubal",
          "Administração Municipal de Ganda",
          "Administração Municipal de Lobito"
        ]
      },
      "huila": {
        nome: "Governo Provincial da Huíla",
        entidades: [
          "Governo Provincial da Huíla",
          "Administração Municipal de Caconda",
          "Administração Municipal de Cacula",
          "Administração Municipal de Caluquembe",
          "Administração Municipal de Chibia",
          "Administração Municipal de Chicomba",
          "Administração Municipal de Chipindo",
          "Administração Municipal de Cuvango",
          "Administração Municipal de Gambos",
          "Administração Municipal de Humpata",
          "Administração Municipal de Jamba",
          "Administração Municipal de Lubango",
          "Administração Municipal de Matala",
          "Administração Municipal de Quilengues",
          "Administração Municipal de Quipungo"
        ]
      },
      "huambo": {
        nome: "Governo Provincial do Huambo",
        entidades: [
          "Governo Provincial do Huambo",
          "Administração Municipal de Bailundo",
          "Administração Municipal de Cachiungo",
          "Administração Municipal de Caála",
          "Administração Municipal de Ecunha",
          "Administração Municipal de Huambo",
          "Administração Municipal de Londuimbali",
          "Administração Municipal de Longonjo",
          "Administração Municipal de Mungo",
          "Administração Municipal de Tchicala-Tcholoanga",
          "Administração Municipal de Tchindjenje",
          "Administração Municipal de Ucuma"
        ]
      },
      "bie": {
        nome: "Governo Provincial do Bié",
        entidades: [
          "Governo Provincial do Bié",
          "Administração Municipal de Andulo",
          "Administração Municipal de Camacupa",
          "Administração Municipal de Catabola",
          "Administração Municipal de Chinguar",
          "Administração Municipal de Chitembo",
          "Administração Municipal de Cuemba",
          "Administração Municipal de Cunhinga",
          "Administração Municipal de Cuíto",
          "Administração Municipal de Nharea"
        ]
      },
      "uige": {
        nome: "Governo Provincial do Uíge",
        entidades: [
          "Governo Provincial do Uíge",
          "Administração Municipal de Alto Cauale",
          "Administração Municipal de Ambuíla",
          "Administração Municipal de Bembe",
          "Administração Municipal de Buengas",
          "Administração Municipal de Bungo",
          "Administração Municipal de Damba",
          "Administração Municipal de Maquela do Zombo",
          "Administração Municipal de Mucaba",
          "Administração Municipal de Negage",
          "Administração Municipal de Puri",
          "Administração Municipal de Quimbele",
          "Administração Municipal de Quitexe",
          "Administração Municipal de Sanza Pombo",
          "Administração Municipal de Songo",
          "Administração Municipal de Uíge"
        ]
      },
      "zaire": {
        nome: "Governo Provincial do Zaire",
        entidades: [
          "Governo Provincial do Zaire",
          "Administração Municipal de Cuimba",
          "Administração Municipal de M'Banza Kongo",
          "Administração Municipal de Nóqui",
          "Administração Municipal de N'Zeto",
          "Administração Municipal de Soyo",
          "Administração Municipal de Tomboco"
        ]
      },
      "cabinda": {
        nome: "Governo Provincial de Cabinda",
        entidades: [
          "Governo Provincial de Cabinda",
          "Administração Municipal de Belize",
          "Administração Municipal de Buco-Zau",
          "Administração Municipal de Cabinda",
          "Administração Municipal de Cacongo"
        ]
      },
      "malanje": {
        nome: "Governo Provincial de Malanje",
        entidades: [
          "Governo Provincial de Malanje",
          "Administração Municipal de Cacuso",
          "Administração Municipal de Calandula",
          "Administração Municipal de Cambundi-Catembo",
          "Administração Municipal de Cangandala",
          "Administração Municipal de Caombo",
          "Administração Municipal de Cuaba Nzogo",
          "Administração Municipal de Cunda-Dia-Baze",
          "Administração Municipal de Luquembo",
          "Administração Municipal de Malanje",
          "Administração Municipal de Marimba",
          "Administração Municipal de Massango",
          "Administração Municipal de Mucari",
          "Administração Municipal de Quela",
          "Administração Municipal de Quirima"
        ]
      },
      "kwanza_norte": {
        nome: "Governo Provincial do Kwanza Norte",
        entidades: [
          "Governo Provincial do Kwanza Norte",
          "Administração Municipal de Ambaca",
          "Administração Municipal de Banga",
          "Administração Municipal de Bolongongo",
          "Administração Municipal de Cambambe",
          "Administração Municipal de Cazengo",
          "Administração Municipal de Golungo Alto",
          "Administração Municipal de Gonguembo",
          "Administração Municipal de Lucala",
          "Administração Municipal de Quiculungo",
          "Administração Municipal de Samba Caju"
        ]
      },
      "kwanza_sul": {
        nome: "Governo Provincial do Kwanza Sul",
        entidades: [
          "Governo Provincial do Kwanza Sul",
          "Administração Municipal de Amboim",
          "Administração Municipal de Cassongue",
          "Administração Municipal de Cela",
          "Administração Municipal de Conda",
          "Administração Municipal de Ebo",
          "Administração Municipal de Libolo",
          "Administração Municipal de Mussende",
          "Administração Municipal de Porto Amboim",
          "Administração Municipal de Quibala",
          "Administração Municipal de Quilenda",
          "Administração Municipal de Seles",
          "Administração Municipal de Sumbe"
        ]
      },
      "bengo": {
        nome: "Governo Provincial do Bengo",
        entidades: [
          "Governo Provincial do Bengo",
          "Administração Municipal de Ambriz",
          "Administração Municipal de Bula Atumba",
          "Administração Municipal de Dande",
          "Administração Municipal de Dembos",
          "Administração Municipal de Nambuangongo",
          "Administração Municipal de Pango Aluquém"
        ]
      },
      "lunda_norte": {
        nome: "Governo Provincial da Lunda Norte",
        entidades: [
          "Governo Provincial da Lunda Norte",
          "Administração Municipal de Cambulo",
          "Administração Municipal de Capenda-Camulemba",
          "Administração Municipal de Caungula",
          "Administração Municipal de Chitato",
          "Administração Municipal de Cuango",
          "Administração Municipal de Cuílo",
          "Administração Municipal de Lóvua",
          "Administração Municipal de Lubalo",
          "Administração Municipal de Lucapa",
          "Administração Municipal de Xá-Muteba"
        ]
      },
      "lunda_sul": {
        nome: "Governo Provincial da Lunda Sul",
        entidades: [
          "Governo Provincial da Lunda Sul",
          "Administração Municipal de Cacolo",
          "Administração Municipal de Dala",
          "Administração Municipal de Muconda",
          "Administração Municipal de Saurimo"
        ]
      },
      "moxico": {
        nome: "Governo Provincial do Moxico",
        entidades: [
          "Governo Provincial do Moxico",
          "Administração Municipal de Alto Zambeze",
          "Administração Municipal de Bundas",
          "Administração Municipal de Camanongue",
          "Administração Municipal de Léua",
          "Administração Municipal de Luacano",
          "Administração Municipal de Luau",
          "Administração Municipal de Luchazes",
          "Administração Municipal de Lumeje",
          "Administração Municipal de Moxico"
        ]
      },
      "cuando_cubango": {
        nome: "Governo Provincial do Cuando Cubango",
        entidades: [
          "Governo Provincial do Cuando Cubango",
          "Administração Municipal de Calai",
          "Administração Municipal de Cuangar",
          "Administração Municipal de Cuchi",
          "Administração Municipal de Cuito Cuanavale",
          "Administração Municipal de Dirico",
          "Administração Municipal de Mavinga",
          "Administração Municipal de Menongue",
          "Administração Municipal de Nancova",
          "Administração Municipal de Rivungo"
        ]
      },
      "cunene": {
        nome: "Governo Provincial do Cunene",
        entidades: [
          "Governo Provincial do Cunene",
          "Administração Municipal de Cahama",
          "Administração Municipal de Cuanhama",
          "Administração Municipal de Curoca",
          "Administração Municipal de Cuvelai",
          "Administração Municipal de Namacunde",
          "Administração Municipal de Ombadja"
        ]
      },
      "namibe": {
        nome: "Governo Provincial do Namibe",
        entidades: [
          "Governo Provincial do Namibe",
          "Administração Municipal de Bibala",
          "Administração Municipal de Camucuio",
          "Administração Municipal de Moçâmedes",
          "Administração Municipal de Tômbwa",
          "Administração Municipal de Virei"
        ]
      }
    }
  }
};

export type CategoriaEntidade = keyof typeof entidadesPorCategoria;
