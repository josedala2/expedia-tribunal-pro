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
