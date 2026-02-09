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
      "bengo": {
        nome: "Governo Provincial do Bengo",
        entidades: [
          "Governo Provincial do Bengo",
          "Administração Municipal de Ambriz",
          "Administração Municipal de Barra do Dande",
          "Administração Municipal de Bula Atumba",
          "Administração Municipal de Dande",
          "Administração Municipal de Muxaluando",
          "Administração Municipal de Nambuangongo",
          "Administração Municipal de Panguila",
          "Administração Municipal de Pango Aluquém",
          "Administração Municipal de Piri",
          "Administração Municipal de Quicunzo",
          "Administração Municipal de Quibaxe",
          "Administração Municipal de Úcua"
        ]
      },
      "benguela": {
        nome: "Governo Provincial de Benguela",
        entidades: [
          "Governo Provincial de Benguela",
          "Administração Municipal de Baía Farta",
          "Administração Municipal de Babaera",
          "Administração Municipal de Balombo",
          "Administração Municipal de Benguela",
          "Administração Municipal de Biópio",
          "Administração Municipal de Bocoio",
          "Administração Municipal de Bolonguera",
          "Administração Municipal de Catumbela",
          "Administração Municipal de Catengue",
          "Administração Municipal de Caimbambo",
          "Administração Municipal de Canhamela",
          "Administração Municipal de Capupa",
          "Administração Municipal de Chicuma",
          "Administração Municipal de Chila",
          "Administração Municipal de Chindumbo",
          "Administração Municipal de Chongorói",
          "Administração Municipal de Cubal",
          "Administração Municipal de Dombe Grande",
          "Administração Municipal de Egito Praia",
          "Administração Municipal de Iambala",
          "Administração Municipal de Lobito",
          "Administração Municipal de Navegante",
          "Administração Municipal de Ganda"
        ]
      },
      "bie": {
        nome: "Governo Provincial do Bié",
        entidades: [
          "Governo Provincial do Bié",
          "Administração Municipal de Andulo",
          "Administração Municipal de Belo Horizonte",
          "Administração Municipal de Camacupa",
          "Administração Municipal de Calucinga",
          "Administração Municipal de Catabola",
          "Administração Municipal de Cambândua",
          "Administração Municipal de Cuíto",
          "Administração Municipal de Chicala",
          "Administração Municipal de Chinguar",
          "Administração Municipal de Chipeta",
          "Administração Municipal de Chitembo",
          "Administração Municipal de Cunhinga",
          "Administração Municipal de Cuemba",
          "Administração Municipal de Mumbué",
          "Administração Municipal de Nharêa",
          "Administração Municipal de Ringoma",
          "Administração Municipal de Umpulo"
        ]
      },
      "cabinda": {
        nome: "Governo Provincial de Cabinda",
        entidades: [
          "Governo Provincial de Cabinda",
          "Administração Municipal de Belize",
          "Administração Municipal de Buco Zau",
          "Administração Municipal de Cabinda",
          "Administração Municipal de Cacongo",
          "Administração Municipal de Miconje",
          "Administração Municipal de Necuto",
          "Administração Municipal de Ngoio",
          "Administração Municipal de Liambo",
          "Administração Municipal de Tando Zinze"
        ]
      },
      "cubango": {
        nome: "Governo Provincial do Cubango",
        entidades: [
          "Governo Provincial do Cubango",
          "Administração Municipal de Calai",
          "Administração Municipal de Caiundo",
          "Administração Municipal de Cutato",
          "Administração Municipal de Cuchi",
          "Administração Municipal de Cuangar",
          "Administração Municipal de Chinguanja",
          "Administração Municipal de Menongue",
          "Administração Municipal de Mavengue",
          "Administração Municipal de Nancova",
          "Administração Municipal de Longa"
        ]
      },
      "cuando": {
        nome: "Governo Provincial do Cuando",
        entidades: [
          "Governo Provincial do Cuando",
          "Administração Municipal de Cuito Cuanavale",
          "Administração Municipal de Dima",
          "Administração Municipal de Dirico",
          "Administração Municipal de Mavinga",
          "Administração Municipal de Mucusso",
          "Administração Municipal de Luiana",
          "Administração Municipal de Luengue",
          "Administração Municipal de Rivungo",
          "Administração Municipal de Xipundo"
        ]
      },
      "cuanza_norte": {
        nome: "Governo Provincial do Cuanza Norte",
        entidades: [
          "Governo Provincial do Cuanza Norte",
          "Administração Municipal de Ambaca",
          "Administração Municipal de Aldeia Nova",
          "Administração Municipal de Banga",
          "Administração Municipal de Bolongongo",
          "Administração Municipal de Cazengo",
          "Administração Municipal de Cêrca",
          "Administração Municipal de Cambambe",
          "Administração Municipal de Caculo Cabaça",
          "Administração Municipal de Golungo Alto",
          "Administração Municipal de Massangano",
          "Administração Municipal de Ngonguembo",
          "Administração Municipal de Lucala",
          "Administração Municipal de Luinga",
          "Administração Municipal de Tango",
          "Administração Municipal de Terreiro",
          "Administração Municipal de Samba Cajú",
          "Administração Municipal de Quiculungo"
        ]
      },
      "cuanza_sul": {
        nome: "Governo Provincial do Cuanza Sul",
        entidades: [
          "Governo Provincial do Cuanza Sul",
          "Administração Municipal de Sumbe",
          "Administração Municipal de Calulo (Libolo)",
          "Administração Municipal de Gabela (Amboím)",
          "Administração Municipal de Cassongue",
          "Administração Municipal de Porto Amboím",
          "Administração Municipal de Quibala",
          "Administração Municipal de Seles",
          "Administração Municipal de Waku Kungo (Cela)",
          "Administração Municipal de Ebo",
          "Administração Municipal de Boa Entrada",
          "Administração Municipal de Munenga",
          "Administração Municipal de Gungo",
          "Administração Municipal de Gangula",
          "Administração Municipal de Quissongo",
          "Administração Municipal de Condé",
          "Administração Municipal de Amboiva",
          "Administração Municipal de Lonhe",
          "Administração Municipal de Sanga",
          "Administração Municipal de Pambangala"
        ]
      },
      "cunene": {
        nome: "Governo Provincial do Cunene",
        entidades: [
          "Governo Provincial do Cunene",
          "Administração Municipal de Cafima",
          "Administração Municipal de Cuvelai",
          "Administração Municipal de Cahama",
          "Administração Municipal de Curoca",
          "Administração Municipal de Chitado",
          "Administração Municipal de Chiéde",
          "Administração Municipal de Chissuata",
          "Administração Municipal de Cuanhama",
          "Administração Municipal de Mupa",
          "Administração Municipal de Naulila",
          "Administração Municipal de Namacunde",
          "Administração Municipal de Humbe",
          "Administração Municipal de Ombadja"
        ]
      },
      "huambo": {
        nome: "Governo Provincial do Huambo",
        entidades: [
          "Governo Provincial do Huambo",
          "Administração Municipal de Bailundo",
          "Administração Municipal de Bimbe",
          "Administração Municipal de Caála",
          "Administração Municipal de Cuima",
          "Administração Municipal de Chicala Choloanga",
          "Administração Municipal de Chinjenje",
          "Administração Municipal de Chilata",
          "Administração Municipal de Galanga",
          "Administração Municipal de Ecunha",
          "Administração Municipal de Longonjo",
          "Administração Municipal de Londuimbali",
          "Administração Municipal de Mungo",
          "Administração Municipal de Huambo",
          "Administração Municipal de Ucuma",
          "Administração Municipal de Sambo"
        ]
      },
      "huila": {
        nome: "Governo Provincial da Huíla",
        entidades: [
          "Governo Provincial da Huíla",
          "Administração Municipal de Cacula",
          "Administração Municipal de Caconda",
          "Administração Municipal de Caluquembe",
          "Administração Municipal de Chicomba",
          "Administração Municipal de Chipindo",
          "Administração Municipal de Cuvango",
          "Administração Municipal de Capelongo",
          "Administração Municipal de Chicungo",
          "Administração Municipal de Chibia",
          "Administração Municipal de Chituto",
          "Administração Municipal de Capunda Cavilongo",
          "Administração Municipal de Gambos",
          "Administração Municipal de Dongo",
          "Administração Municipal de Galangue",
          "Administração Municipal de Jamba Mineira",
          "Administração Municipal de Hoque",
          "Administração Municipal de Humpata",
          "Administração Municipal de Lubango",
          "Administração Municipal de Palanca",
          "Administração Municipal de Quipungo",
          "Administração Municipal de Quilengues"
        ]
      },
      "icolo_e_bengo": {
        nome: "Governo Provincial do Icolo e Bengo",
        entidades: [
          "Governo Provincial do Icolo e Bengo",
          "Administração Municipal de Bom Jesus",
          "Administração Municipal de Cabo Ledo",
          "Administração Municipal de Cabiri",
          "Administração Municipal de Catete",
          "Administração Municipal de Calumbo",
          "Administração Municipal de Sequele",
          "Administração Municipal de Quiçama"
        ]
      },
      "luanda": {
        nome: "Governo Provincial de Luanda",
        entidades: [
          "Governo Provincial de Luanda",
          "Administração Municipal de Belas",
          "Administração Municipal de Camama",
          "Administração Municipal de Cacuaco",
          "Administração Municipal de Cazenga",
          "Administração Municipal de Ingombota",
          "Administração Municipal de Maianga",
          "Administração Municipal de Hoji ya Henda",
          "Administração Municipal de Mussulo",
          "Administração Municipal de Mulenvos",
          "Administração Municipal de Kilamba Kiaxi",
          "Administração Municipal de Kilamba",
          "Administração Municipal de Talatona",
          "Administração Municipal de Rangel",
          "Administração Municipal de Sambizanga",
          "Administração Municipal de Samba",
          "Administração Municipal de Viana"
        ]
      },
      "lunda_norte": {
        nome: "Governo Provincial da Lunda Norte",
        entidades: [
          "Governo Provincial da Lunda Norte",
          "Administração Municipal de Camaxilo",
          "Administração Municipal de Caungula",
          "Administração Municipal de Cafunfo",
          "Administração Municipal de Camdulo",
          "Administração Municipal de Cuango",
          "Administração Municipal de Cassanje Calucala",
          "Administração Municipal de Capenda Camulemba",
          "Administração Municipal de Cuílo",
          "Administração Municipal de Chitato",
          "Administração Municipal de Canzar",
          "Administração Municipal de Dundo",
          "Administração Municipal de Mussungue",
          "Administração Municipal de Luangue",
          "Administração Municipal de Lubalo",
          "Administração Municipal de Luremo",
          "Administração Municipal de Xá Muteba",
          "Administração Municipal de Xá Cassau"
        ]
      },
      "lunda_sul": {
        nome: "Governo Provincial da Lunda Sul",
        entidades: [
          "Governo Provincial da Lunda Sul",
          "Administração Municipal de Alto Chicapa",
          "Administração Municipal de Cazage",
          "Administração Municipal de Cassengo",
          "Administração Municipal de Cacolo",
          "Administração Municipal de Chiluage",
          "Administração Municipal de Cassai-Sul",
          "Administração Municipal de Dala",
          "Administração Municipal de Muangueji",
          "Administração Municipal de Muriege",
          "Administração Municipal de Muconda",
          "Administração Municipal de Luma Cassai",
          "Administração Municipal de Saurimo",
          "Administração Municipal de Sombo"
        ]
      },
      "malanje": {
        nome: "Governo Provincial de Malanje",
        entidades: [
          "Governo Provincial de Malanje",
          "Administração Municipal de Capunda",
          "Administração Municipal de Cambundi Catembo",
          "Administração Municipal de Cangandala",
          "Administração Municipal de Cacuso",
          "Administração Municipal de Calandula",
          "Administração Municipal de Cuale",
          "Administração Municipal de Cateco Cangola",
          "Administração Municipal de Caculama",
          "Administração Municipal de Cambo Suinginge",
          "Administração Municipal de Marimba",
          "Administração Municipal de Massango",
          "Administração Municipal de Mbanji ya Ngola",
          "Administração Municipal de Milando",
          "Administração Municipal de Muquixe",
          "Administração Municipal de Malanje",
          "Administração Municipal de Ngola Luiji",
          "Administração Municipal de Luquembo",
          "Administração Municipal de Kiwaba Nzoji",
          "Administração Municipal de Kunda dya Baze",
          "Administração Municipal de Quihuhu",
          "Administração Municipal de Quela",
          "Administração Municipal de Quitapa",
          "Administração Municipal de Quirima",
          "Administração Municipal de Quêssua",
          "Administração Municipal de Pungu a Ndongo",
          "Administração Municipal de Xandel"
        ]
      },
      "moxico": {
        nome: "Governo Provincial do Moxico",
        entidades: [
          "Governo Provincial do Moxico",
          "Administração Municipal de Alto Cuito",
          "Administração Municipal de Camanongue",
          "Administração Municipal de Cangamba",
          "Administração Municipal de Chiúme",
          "Administração Municipal de Léua",
          "Administração Municipal de Luena",
          "Administração Municipal de Lutuai",
          "Administração Municipal de Lucusse",
          "Administração Municipal de Lutembo",
          "Administração Municipal de Lumbala Nguimbo",
          "Administração Municipal de Ninda"
        ]
      },
      "moxico_leste": {
        nome: "Governo Provincial do Moxico Leste",
        entidades: [
          "Governo Provincial do Moxico Leste",
          "Administração Municipal de Cameia",
          "Administração Municipal de Cazombo",
          "Administração Municipal de Caianda",
          "Administração Municipal de Macondo",
          "Administração Municipal de Nana Candundo",
          "Administração Municipal de Lago Dilolo",
          "Administração Municipal de Lóvua do Zambeze",
          "Administração Municipal de Luacano",
          "Administração Municipal de Luau"
        ]
      },
      "namibe": {
        nome: "Governo Provincial do Namibe",
        entidades: [
          "Governo Provincial do Namibe",
          "Administração Municipal de Bibala",
          "Administração Municipal de Camucuio",
          "Administração Municipal de Cacimbas",
          "Administração Municipal de Moçâmedes",
          "Administração Municipal de Lucira",
          "Administração Municipal de Iona",
          "Administração Municipal de Tômbwa",
          "Administração Municipal de Sacomar",
          "Administração Municipal de Virei"
        ]
      },
      "uige": {
        nome: "Governo Provincial do Uíge",
        entidades: [
          "Governo Provincial do Uíge",
          "Administração Municipal de Ambuíla",
          "Administração Municipal de Alto Zaza",
          "Administração Municipal de Bungo",
          "Administração Municipal de Bembe",
          "Administração Municipal de Cangola",
          "Administração Municipal de Damba",
          "Administração Municipal de Dange Quitexe",
          "Administração Municipal de Mucaba",
          "Administração Municipal de Maquela do Zombo",
          "Administração Municipal de Milunga",
          "Administração Municipal de Massau",
          "Administração Municipal de Nsosso",
          "Administração Municipal de Negage",
          "Administração Municipal de Nova Esperança",
          "Administração Municipal de Lucunga",
          "Administração Municipal de Puri",
          "Administração Municipal de Sanza Pombo",
          "Administração Municipal de Songo",
          "Administração Municipal de Sacandica",
          "Administração Municipal de Quimbele",
          "Administração Municipal de Quipedro",
          "Administração Municipal de Uíge",
          "Administração Municipal de Vista Alegre"
        ]
      },
      "zaire": {
        nome: "Governo Provincial do Zaire",
        entidades: [
          "Governo Provincial do Zaire",
          "Administração Municipal de Cuimba",
          "Administração Municipal de Mbanza Kongo",
          "Administração Municipal de Nóqui",
          "Administração Municipal de Nzeto",
          "Administração Municipal de Lufico",
          "Administração Municipal de Luvo",
          "Administração Municipal de Soyo",
          "Administração Municipal de Serra de Canda",
          "Administração Municipal de Quêlo",
          "Administração Municipal de Tomboco",
          "Administração Municipal de Quindeje"
        ]
      }
    }
  }
};

export type CategoriaEntidade = keyof typeof entidadesPorCategoria;
