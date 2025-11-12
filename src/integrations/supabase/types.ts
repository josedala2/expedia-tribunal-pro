export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          atualizado_em: string
          criado_em: string
          id: string
          locale: string
          modo_manutencao: boolean
          timezone: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          locale?: string
          modo_manutencao?: boolean
          timezone?: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          locale?: string
          modo_manutencao?: boolean
          timezone?: string
        }
        Relationships: []
      }
      areas_funcionais: {
        Row: {
          actualizado_em: string
          criado_em: string
          descricao: string | null
          id: string
          nome_area: string
          unidades_internas: string[] | null
        }
        Insert: {
          actualizado_em?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          nome_area: string
          unidades_internas?: string[] | null
        }
        Update: {
          actualizado_em?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          nome_area?: string
          unidades_internas?: string[] | null
        }
        Relationships: []
      }
      auth_logs: {
        Row: {
          criado_em: string
          detalhes: Json | null
          email: string | null
          evento: string
          id: string
          ip_address: string | null
          localizacao: string | null
          sucesso: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          criado_em?: string
          detalhes?: Json | null
          email?: string | null
          evento: string
          id?: string
          ip_address?: string | null
          localizacao?: string | null
          sucesso: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          criado_em?: string
          detalhes?: Json | null
          email?: string | null
          evento?: string
          id?: string
          ip_address?: string | null
          localizacao?: string | null
          sucesso?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      calendario_judicial: {
        Row: {
          considera_para_slas: boolean
          criado_em: string
          criado_por: string | null
          descricao: string
          feriado: string
          id: string
        }
        Insert: {
          considera_para_slas?: boolean
          criado_em?: string
          criado_por?: string | null
          descricao: string
          feriado: string
          id?: string
        }
        Update: {
          considera_para_slas?: boolean
          criado_em?: string
          criado_por?: string | null
          descricao?: string
          feriado?: string
          id?: string
        }
        Relationships: []
      }
      dependentes_funcionario: {
        Row: {
          bi: string | null
          criado_em: string
          data_nascimento: string | null
          funcionario_id: string
          id: string
          nome_completo: string
          parentesco: string
        }
        Insert: {
          bi?: string | null
          criado_em?: string
          data_nascimento?: string | null
          funcionario_id: string
          id?: string
          nome_completo: string
          parentesco: string
        }
        Update: {
          bi?: string | null
          criado_em?: string
          data_nascimento?: string | null
          funcionario_id?: string
          id?: string
          nome_completo?: string
          parentesco?: string
        }
        Relationships: [
          {
            foreignKeyName: "dependentes_funcionario_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      doc_templates: {
        Row: {
          ativo: boolean
          atualizado_em: string
          criado_em: string
          formato: string
          id: string
          nome: string
          placeholders: string[] | null
          tipo: string
          versao: string
        }
        Insert: {
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          formato: string
          id?: string
          nome: string
          placeholders?: string[] | null
          tipo: string
          versao: string
        }
        Update: {
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          formato?: string
          id?: string
          nome?: string
          placeholders?: string[] | null
          tipo?: string
          versao?: string
        }
        Relationships: []
      }
      documentos_oficiais: {
        Row: {
          atualizado_em: string
          autor_id: string | null
          categoria: string
          criado_em: string
          data_documento: string | null
          descricao: string | null
          id: string
          numero_documento: string | null
          publicado: boolean | null
          publicado_em: string | null
          tamanho_arquivo: number | null
          tipo_arquivo: string | null
          titulo: string
          url_arquivo: string | null
        }
        Insert: {
          atualizado_em?: string
          autor_id?: string | null
          categoria: string
          criado_em?: string
          data_documento?: string | null
          descricao?: string | null
          id?: string
          numero_documento?: string | null
          publicado?: boolean | null
          publicado_em?: string | null
          tamanho_arquivo?: number | null
          tipo_arquivo?: string | null
          titulo: string
          url_arquivo?: string | null
        }
        Update: {
          atualizado_em?: string
          autor_id?: string | null
          categoria?: string
          criado_em?: string
          data_documento?: string | null
          descricao?: string | null
          id?: string
          numero_documento?: string | null
          publicado?: boolean | null
          publicado_em?: string | null
          tamanho_arquivo?: number | null
          tipo_arquivo?: string | null
          titulo?: string
          url_arquivo?: string | null
        }
        Relationships: []
      }
      documentos_pensionista: {
        Row: {
          criado_em: string
          criado_por: string | null
          data_validade: string | null
          descricao: string | null
          id: string
          pensionista_id: string
          tipo_documento: string
          titulo: string
          url_arquivo: string | null
        }
        Insert: {
          criado_em?: string
          criado_por?: string | null
          data_validade?: string | null
          descricao?: string | null
          id?: string
          pensionista_id: string
          tipo_documento: string
          titulo: string
          url_arquivo?: string | null
        }
        Update: {
          criado_em?: string
          criado_por?: string | null
          data_validade?: string | null
          descricao?: string | null
          id?: string
          pensionista_id?: string
          tipo_documento?: string
          titulo?: string
          url_arquivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentos_pensionista_pensionista_id_fkey"
            columns: ["pensionista_id"]
            isOneToOne: false
            referencedRelation: "pensionistas"
            referencedColumns: ["id"]
          },
        ]
      }
      emolumentos_tabela: {
        Row: {
          atualizado_em: string
          criado_em: string
          formula: string
          id: string
          maximo_pct: number | null
          minimo: number
          tipo_processo: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          formula: string
          id?: string
          maximo_pct?: number | null
          minimo: number
          tipo_processo: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          formula?: string
          id?: string
          maximo_pct?: number | null
          minimo?: number
          tipo_processo?: string
        }
        Relationships: []
      }
      expedientes: {
        Row: {
          aceito_destinatario: boolean | null
          assinado: boolean | null
          assinatura_destinatario: string | null
          assinatura_digital: string | null
          assunto: string
          atualizado_em: string | null
          criado_em: string | null
          criado_por: string | null
          data_aceite_destinatario: string | null
          data_assinatura: string | null
          data_recepcao: string | null
          descricao: string
          destino: string
          email_externo: string | null
          entidade_externa: string | null
          id: string
          local_recepcao: string | null
          natureza: string
          nome_destinatario_assinatura: string | null
          numero: string
          numero_acta: string | null
          observacoes_acta: string | null
          origem: string
          prioridade: string
          responsavel_entrega_cargo: string | null
          responsavel_entrega_instituicao: string | null
          responsavel_entrega_nome: string | null
          responsavel_recepcao_cargo: string | null
          responsavel_recepcao_departamento: string | null
          responsavel_recepcao_nome: string | null
          resposta_a: string | null
          status: string | null
          telefone_externo: string | null
          tipo: string
        }
        Insert: {
          aceito_destinatario?: boolean | null
          assinado?: boolean | null
          assinatura_destinatario?: string | null
          assinatura_digital?: string | null
          assunto: string
          atualizado_em?: string | null
          criado_em?: string | null
          criado_por?: string | null
          data_aceite_destinatario?: string | null
          data_assinatura?: string | null
          data_recepcao?: string | null
          descricao: string
          destino: string
          email_externo?: string | null
          entidade_externa?: string | null
          id?: string
          local_recepcao?: string | null
          natureza: string
          nome_destinatario_assinatura?: string | null
          numero: string
          numero_acta?: string | null
          observacoes_acta?: string | null
          origem: string
          prioridade: string
          responsavel_entrega_cargo?: string | null
          responsavel_entrega_instituicao?: string | null
          responsavel_entrega_nome?: string | null
          responsavel_recepcao_cargo?: string | null
          responsavel_recepcao_departamento?: string | null
          responsavel_recepcao_nome?: string | null
          resposta_a?: string | null
          status?: string | null
          telefone_externo?: string | null
          tipo: string
        }
        Update: {
          aceito_destinatario?: boolean | null
          assinado?: boolean | null
          assinatura_destinatario?: string | null
          assinatura_digital?: string | null
          assunto?: string
          atualizado_em?: string | null
          criado_em?: string | null
          criado_por?: string | null
          data_aceite_destinatario?: string | null
          data_assinatura?: string | null
          data_recepcao?: string | null
          descricao?: string
          destino?: string
          email_externo?: string | null
          entidade_externa?: string | null
          id?: string
          local_recepcao?: string | null
          natureza?: string
          nome_destinatario_assinatura?: string | null
          numero?: string
          numero_acta?: string | null
          observacoes_acta?: string | null
          origem?: string
          prioridade?: string
          responsavel_entrega_cargo?: string | null
          responsavel_entrega_instituicao?: string | null
          responsavel_entrega_nome?: string | null
          responsavel_recepcao_cargo?: string | null
          responsavel_recepcao_departamento?: string | null
          responsavel_recepcao_nome?: string | null
          resposta_a?: string | null
          status?: string | null
          telefone_externo?: string | null
          tipo?: string
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          ativo: boolean
          atualizado_em: string
          chave: string
          criado_em: string
          descricao: string
          id: string
        }
        Insert: {
          ativo?: boolean
          atualizado_em?: string
          chave: string
          criado_em?: string
          descricao: string
          id?: string
        }
        Update: {
          ativo?: boolean
          atualizado_em?: string
          chave?: string
          criado_em?: string
          descricao?: string
          id?: string
        }
        Relationships: []
      }
      ferias: {
        Row: {
          ano: number
          aprovado_chefia_em: string | null
          aprovado_chefia_por: string | null
          aprovado_rh_em: string | null
          aprovado_rh_por: string | null
          atualizado_em: string
          criado_em: string
          data_fim: string
          data_inicio: string
          dias_solicitados: number
          funcionario_id: string
          id: string
          motivo_rejeicao: string | null
          solicitado_em: string
          status: string
          tipo: string
        }
        Insert: {
          ano: number
          aprovado_chefia_em?: string | null
          aprovado_chefia_por?: string | null
          aprovado_rh_em?: string | null
          aprovado_rh_por?: string | null
          atualizado_em?: string
          criado_em?: string
          data_fim: string
          data_inicio: string
          dias_solicitados: number
          funcionario_id: string
          id?: string
          motivo_rejeicao?: string | null
          solicitado_em?: string
          status?: string
          tipo?: string
        }
        Update: {
          ano?: number
          aprovado_chefia_em?: string | null
          aprovado_chefia_por?: string | null
          aprovado_rh_em?: string | null
          aprovado_rh_por?: string | null
          atualizado_em?: string
          criado_em?: string
          data_fim?: string
          data_inicio?: string
          dias_solicitados?: number
          funcionario_id?: string
          id?: string
          motivo_rejeicao?: string | null
          solicitado_em?: string
          status?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "ferias_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios: {
        Row: {
          atualizado_em: string
          banco: string | null
          bi: string | null
          carreira: string | null
          categoria: string | null
          chefia_direta: string | null
          contacto_email: string | null
          contacto_telefone: string | null
          criado_em: string
          data_admissao: string | null
          data_nascimento: string | null
          departamento: string | null
          documentos: Json | null
          estado_civil: string | null
          funcao_atual: string | null
          genero: string | null
          iban: string | null
          id: string
          morada: string | null
          nif: string | null
          nivel: number | null
          nome_completo: string
          numero_funcionario: string
          situacao: string
          tipo_vinculo: string | null
          unidade_organica: string | null
          user_id: string | null
        }
        Insert: {
          atualizado_em?: string
          banco?: string | null
          bi?: string | null
          carreira?: string | null
          categoria?: string | null
          chefia_direta?: string | null
          contacto_email?: string | null
          contacto_telefone?: string | null
          criado_em?: string
          data_admissao?: string | null
          data_nascimento?: string | null
          departamento?: string | null
          documentos?: Json | null
          estado_civil?: string | null
          funcao_atual?: string | null
          genero?: string | null
          iban?: string | null
          id?: string
          morada?: string | null
          nif?: string | null
          nivel?: number | null
          nome_completo: string
          numero_funcionario: string
          situacao?: string
          tipo_vinculo?: string | null
          unidade_organica?: string | null
          user_id?: string | null
        }
        Update: {
          atualizado_em?: string
          banco?: string | null
          bi?: string | null
          carreira?: string | null
          categoria?: string | null
          chefia_direta?: string | null
          contacto_email?: string | null
          contacto_telefone?: string | null
          criado_em?: string
          data_admissao?: string | null
          data_nascimento?: string | null
          departamento?: string | null
          documentos?: Json | null
          estado_civil?: string | null
          funcao_atual?: string | null
          genero?: string | null
          iban?: string | null
          id?: string
          morada?: string | null
          nif?: string | null
          nivel?: number | null
          nome_completo?: string
          numero_funcionario?: string
          situacao?: string
          tipo_vinculo?: string | null
          unidade_organica?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funcionarios_chefia_direta_fkey"
            columns: ["chefia_direta"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_funcional_pensionista: {
        Row: {
          cargo: string
          categoria: string | null
          criado_em: string
          data_fim: string | null
          data_inicio: string
          departamento: string | null
          id: string
          observacoes: string | null
          pensionista_id: string
          unidade_organica: string | null
        }
        Insert: {
          cargo: string
          categoria?: string | null
          criado_em?: string
          data_fim?: string | null
          data_inicio: string
          departamento?: string | null
          id?: string
          observacoes?: string | null
          pensionista_id: string
          unidade_organica?: string | null
        }
        Update: {
          cargo?: string
          categoria?: string | null
          criado_em?: string
          data_fim?: string | null
          data_inicio?: string
          departamento?: string | null
          id?: string
          observacoes?: string | null
          pensionista_id?: string
          unidade_organica?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_funcional_pensionista_pensionista_id_fkey"
            columns: ["pensionista_id"]
            isOneToOne: false
            referencedRelation: "pensionistas"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_config: {
        Row: {
          ativo: boolean
          atualizado_em: string
          config: Json
          criado_em: string
          id: string
          nome: string
          tipo: string
        }
        Insert: {
          ativo?: boolean
          atualizado_em?: string
          config: Json
          criado_em?: string
          id?: string
          nome: string
          tipo: string
        }
        Update: {
          ativo?: boolean
          atualizado_em?: string
          config?: Json
          criado_em?: string
          id?: string
          nome?: string
          tipo?: string
        }
        Relationships: []
      }
      logs_auditoria: {
        Row: {
          acao: string
          criado_em: string
          dados_anteriores: Json | null
          dados_novos: Json | null
          id: string
          ip_address: string | null
          registro_id: string | null
          tabela: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          acao: string
          criado_em?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          ip_address?: string | null
          registro_id?: string | null
          tabela: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          acao?: string
          criado_em?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          ip_address?: string | null
          registro_id?: string | null
          tabela?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      mapa_letra_juiz: {
        Row: {
          atualizado_em: string
          criado_em: string
          id: string
          juiz_adjunto_perfil_id: string | null
          juiz_relator_perfil_id: string | null
          letra: string
          vigencia: Json | null
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          juiz_adjunto_perfil_id?: string | null
          juiz_relator_perfil_id?: string | null
          letra: string
          vigencia?: Json | null
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          juiz_adjunto_perfil_id?: string | null
          juiz_relator_perfil_id?: string | null
          letra?: string
          vigencia?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "mapa_letra_juiz_juiz_adjunto_perfil_id_fkey"
            columns: ["juiz_adjunto_perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis_utilizador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mapa_letra_juiz_juiz_relator_perfil_id_fkey"
            columns: ["juiz_relator_perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis_utilizador"
            referencedColumns: ["id"]
          },
        ]
      }
      movimentacoes_funcionarios: {
        Row: {
          aprovado_por: string | null
          atualizado_em: string
          categoria_destino: string | null
          categoria_origem: string | null
          criado_em: string
          data_movimentacao: string
          despacho_numero: string | null
          documentos: Json | null
          funcionario_id: string
          id: string
          motivo: string | null
          solicitado_por: string | null
          status: string
          tipo: string
          unidade_destino: string | null
          unidade_origem: string | null
        }
        Insert: {
          aprovado_por?: string | null
          atualizado_em?: string
          categoria_destino?: string | null
          categoria_origem?: string | null
          criado_em?: string
          data_movimentacao: string
          despacho_numero?: string | null
          documentos?: Json | null
          funcionario_id: string
          id?: string
          motivo?: string | null
          solicitado_por?: string | null
          status?: string
          tipo: string
          unidade_destino?: string | null
          unidade_origem?: string | null
        }
        Update: {
          aprovado_por?: string | null
          atualizado_em?: string
          categoria_destino?: string | null
          categoria_origem?: string | null
          criado_em?: string
          data_movimentacao?: string
          despacho_numero?: string | null
          documentos?: Json | null
          funcionario_id?: string
          id?: string
          motivo?: string | null
          solicitado_por?: string | null
          status?: string
          tipo?: string
          unidade_destino?: string | null
          unidade_origem?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_funcionarios_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      noticias_comunicados: {
        Row: {
          anexos: Json | null
          atualizado_em: string
          autor_id: string | null
          conteudo: string
          criado_em: string
          id: string
          prioridade: string
          publicado_em: string | null
          status: string
          tipo: string
          titulo: string
        }
        Insert: {
          anexos?: Json | null
          atualizado_em?: string
          autor_id?: string | null
          conteudo: string
          criado_em?: string
          id?: string
          prioridade?: string
          publicado_em?: string | null
          status?: string
          tipo: string
          titulo: string
        }
        Update: {
          anexos?: Json | null
          atualizado_em?: string
          autor_id?: string | null
          conteudo?: string
          criado_em?: string
          id?: string
          prioridade?: string
          publicado_em?: string | null
          status?: string
          tipo?: string
          titulo?: string
        }
        Relationships: []
      }
      notificacao_templates: {
        Row: {
          assunto: string | null
          atualizado_em: string
          canal: string
          corpo: string
          criado_em: string
          evento: string
          id: string
        }
        Insert: {
          assunto?: string | null
          atualizado_em?: string
          canal: string
          corpo: string
          criado_em?: string
          evento: string
          id?: string
        }
        Update: {
          assunto?: string | null
          atualizado_em?: string
          canal?: string
          corpo?: string
          criado_em?: string
          evento?: string
          id?: string
        }
        Relationships: []
      }
      oficio_anexos: {
        Row: {
          criado_em: string
          criado_por: string | null
          id: string
          nome_arquivo: string
          oficio_id: string
          storage_path: string
          tamanho_arquivo: number
          tipo_arquivo: string
        }
        Insert: {
          criado_em?: string
          criado_por?: string | null
          id?: string
          nome_arquivo: string
          oficio_id: string
          storage_path: string
          tamanho_arquivo: number
          tipo_arquivo: string
        }
        Update: {
          criado_em?: string
          criado_por?: string | null
          id?: string
          nome_arquivo?: string
          oficio_id?: string
          storage_path?: string
          tamanho_arquivo?: number
          tipo_arquivo?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_oficio_remessa"
            columns: ["oficio_id"]
            isOneToOne: false
            referencedRelation: "oficios_remessa"
            referencedColumns: ["id"]
          },
        ]
      }
      oficios_remessa: {
        Row: {
          assinado: boolean | null
          assinatura_digital: string | null
          assunto: string
          atualizado_em: string
          conteudo: string
          criado_em: string
          criado_por: string | null
          data_assinatura: string | null
          data_emissao: string
          destinatario: string
          id: string
          numero: string
          remetente_cargo: string
          remetente_nome: string
          status: string
        }
        Insert: {
          assinado?: boolean | null
          assinatura_digital?: string | null
          assunto: string
          atualizado_em?: string
          conteudo: string
          criado_em?: string
          criado_por?: string | null
          data_assinatura?: string | null
          data_emissao?: string
          destinatario: string
          id?: string
          numero: string
          remetente_cargo: string
          remetente_nome: string
          status?: string
        }
        Update: {
          assinado?: boolean | null
          assinatura_digital?: string | null
          assunto?: string
          atualizado_em?: string
          conteudo?: string
          criado_em?: string
          criado_por?: string | null
          data_assinatura?: string | null
          data_emissao?: string
          destinatario?: string
          id?: string
          numero?: string
          remetente_cargo?: string
          remetente_nome?: string
          status?: string
        }
        Relationships: []
      }
      organizacao_estrutura: {
        Row: {
          criado_em: string | null
          criado_por: string | null
          descricao: string | null
          divisao_pai_id: string | null
          id: string
          nome: string
          tipo: string
        }
        Insert: {
          criado_em?: string | null
          criado_por?: string | null
          descricao?: string | null
          divisao_pai_id?: string | null
          id?: string
          nome: string
          tipo: string
        }
        Update: {
          criado_em?: string | null
          criado_por?: string | null
          descricao?: string | null
          divisao_pai_id?: string | null
          id?: string
          nome?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizacao_estrutura_divisao_pai_id_fkey"
            columns: ["divisao_pai_id"]
            isOneToOne: false
            referencedRelation: "organizacao_estrutura"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos_pensao: {
        Row: {
          ano: number
          criado_em: string
          data_pagamento: string | null
          descontos: number | null
          id: string
          mes: number
          observacoes: string | null
          pensionista_id: string
          processado: boolean | null
          processado_em: string | null
          processado_por: string | null
          status: string
          subsidios: number | null
          valor_base: number
          valor_liquido: number
        }
        Insert: {
          ano: number
          criado_em?: string
          data_pagamento?: string | null
          descontos?: number | null
          id?: string
          mes: number
          observacoes?: string | null
          pensionista_id: string
          processado?: boolean | null
          processado_em?: string | null
          processado_por?: string | null
          status?: string
          subsidios?: number | null
          valor_base: number
          valor_liquido: number
        }
        Update: {
          ano?: number
          criado_em?: string
          data_pagamento?: string | null
          descontos?: number | null
          id?: string
          mes?: number
          observacoes?: string | null
          pensionista_id?: string
          processado?: boolean | null
          processado_em?: string | null
          processado_por?: string | null
          status?: string
          subsidios?: number | null
          valor_base?: number
          valor_liquido?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_pensao_pensionista_id_fkey"
            columns: ["pensionista_id"]
            isOneToOne: false
            referencedRelation: "pensionistas"
            referencedColumns: ["id"]
          },
        ]
      }
      pensionistas: {
        Row: {
          atualizado_em: string
          banco: string | null
          bi: string | null
          contacto_email: string | null
          contacto_telefone: string | null
          criado_em: string
          criado_por: string | null
          data_aposentadoria: string
          data_nascimento: string | null
          data_ultima_prova_vida: string | null
          estado_civil: string | null
          funcionario_id: string | null
          genero: string | null
          iban: string | null
          id: string
          morada: string | null
          motivo_aposentadoria: string | null
          nif: string | null
          nome_completo: string
          numero_pensionista: string
          observacoes: string | null
          proxima_prova_vida: string | null
          status: string
          tempo_servico_anos: number | null
          tempo_servico_meses: number | null
          tipo_aposentadoria: string
          valor_pensao: number | null
        }
        Insert: {
          atualizado_em?: string
          banco?: string | null
          bi?: string | null
          contacto_email?: string | null
          contacto_telefone?: string | null
          criado_em?: string
          criado_por?: string | null
          data_aposentadoria: string
          data_nascimento?: string | null
          data_ultima_prova_vida?: string | null
          estado_civil?: string | null
          funcionario_id?: string | null
          genero?: string | null
          iban?: string | null
          id?: string
          morada?: string | null
          motivo_aposentadoria?: string | null
          nif?: string | null
          nome_completo: string
          numero_pensionista: string
          observacoes?: string | null
          proxima_prova_vida?: string | null
          status?: string
          tempo_servico_anos?: number | null
          tempo_servico_meses?: number | null
          tipo_aposentadoria: string
          valor_pensao?: number | null
        }
        Update: {
          atualizado_em?: string
          banco?: string | null
          bi?: string | null
          contacto_email?: string | null
          contacto_telefone?: string | null
          criado_em?: string
          criado_por?: string | null
          data_aposentadoria?: string
          data_nascimento?: string | null
          data_ultima_prova_vida?: string | null
          estado_civil?: string | null
          funcionario_id?: string | null
          genero?: string | null
          iban?: string | null
          id?: string
          morada?: string | null
          motivo_aposentadoria?: string | null
          nif?: string | null
          nome_completo?: string
          numero_pensionista?: string
          observacoes?: string | null
          proxima_prova_vida?: string | null
          status?: string
          tempo_servico_anos?: number | null
          tempo_servico_meses?: number | null
          tipo_aposentadoria?: string
          valor_pensao?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pensionistas_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis_utilizador: {
        Row: {
          activo: boolean | null
          actualizado_em: string
          area_funcional_id: string | null
          criado_em: string
          descricao: string | null
          id: string
          nome_perfil: string
          permissoes: Database["public"]["Enums"]["permissao_sistema"][] | null
        }
        Insert: {
          activo?: boolean | null
          actualizado_em?: string
          area_funcional_id?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          nome_perfil: string
          permissoes?: Database["public"]["Enums"]["permissao_sistema"][] | null
        }
        Update: {
          activo?: boolean | null
          actualizado_em?: string
          area_funcional_id?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          nome_perfil?: string
          permissoes?: Database["public"]["Enums"]["permissao_sistema"][] | null
        }
        Relationships: [
          {
            foreignKeyName: "perfis_utilizador_area_funcional_id_fkey"
            columns: ["area_funcional_id"]
            isOneToOne: false
            referencedRelation: "areas_funcionais"
            referencedColumns: ["id"]
          },
        ]
      }
      processo_documentos: {
        Row: {
          atualizado_em: string
          criado_em: string
          descricao: string | null
          id: string
          nome_arquivo: string
          ocr_processado: boolean | null
          ocr_processado_em: string | null
          processo_numero: string
          status: string
          storage_path: string
          tamanho_arquivo: number
          texto_extraido: string | null
          tipo_documento: string
          tipo_mime: string
          uploaded_by: string | null
          validado_em: string | null
          validado_por: string | null
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          nome_arquivo: string
          ocr_processado?: boolean | null
          ocr_processado_em?: string | null
          processo_numero: string
          status?: string
          storage_path: string
          tamanho_arquivo: number
          texto_extraido?: string | null
          tipo_documento: string
          tipo_mime: string
          uploaded_by?: string | null
          validado_em?: string | null
          validado_por?: string | null
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          id?: string
          nome_arquivo?: string
          ocr_processado?: boolean | null
          ocr_processado_em?: string | null
          processo_numero?: string
          status?: string
          storage_path?: string
          tamanho_arquivo?: number
          texto_extraido?: string | null
          tipo_documento?: string
          tipo_mime?: string
          uploaded_by?: string | null
          validado_em?: string | null
          validado_por?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          divisao: string | null
          email: string
          id: string
          nome_completo: string
          seccao: string | null
          telefone: string | null
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          divisao?: string | null
          email: string
          id: string
          nome_completo: string
          seccao?: string | null
          telefone?: string | null
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          divisao?: string | null
          email?: string
          id?: string
          nome_completo?: string
          seccao?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      provas_vida: {
        Row: {
          criado_em: string
          criado_por: string | null
          data_verificacao: string
          documento_url: string | null
          id: string
          local_verificacao: string | null
          observacoes: string | null
          pensionista_id: string
          proxima_verificacao: string
          tipo_verificacao: string
          verificado_por: string | null
        }
        Insert: {
          criado_em?: string
          criado_por?: string | null
          data_verificacao: string
          documento_url?: string | null
          id?: string
          local_verificacao?: string | null
          observacoes?: string | null
          pensionista_id: string
          proxima_verificacao: string
          tipo_verificacao: string
          verificado_por?: string | null
        }
        Update: {
          criado_em?: string
          criado_por?: string | null
          data_verificacao?: string
          documento_url?: string | null
          id?: string
          local_verificacao?: string | null
          observacoes?: string | null
          pensionista_id?: string
          proxima_verificacao?: string
          tipo_verificacao?: string
          verificado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provas_vida_pensionista_id_fkey"
            columns: ["pensionista_id"]
            isOneToOne: false
            referencedRelation: "pensionistas"
            referencedColumns: ["id"]
          },
        ]
      }
      registos_ponto: {
        Row: {
          criado_em: string
          data: string
          entrada_manha: string | null
          entrada_tarde: string | null
          funcionario_id: string
          id: string
          observacoes: string | null
          saida_manha: string | null
          saida_tarde: string | null
          tipo: string
          validado: boolean | null
          validado_em: string | null
          validado_por: string | null
        }
        Insert: {
          criado_em?: string
          data: string
          entrada_manha?: string | null
          entrada_tarde?: string | null
          funcionario_id: string
          id?: string
          observacoes?: string | null
          saida_manha?: string | null
          saida_tarde?: string | null
          tipo?: string
          validado?: boolean | null
          validado_em?: string | null
          validado_por?: string | null
        }
        Update: {
          criado_em?: string
          data?: string
          entrada_manha?: string | null
          entrada_tarde?: string | null
          funcionario_id?: string
          id?: string
          observacoes?: string | null
          saida_manha?: string | null
          saida_tarde?: string | null
          tipo?: string
          validado?: boolean | null
          validado_em?: string | null
          validado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registos_ponto_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      regras_distribuicao: {
        Row: {
          ativo: boolean
          atualizado_em: string
          criado_em: string
          criterio: string
          id: string
          parametros: Json | null
          tipo_processo: string
        }
        Insert: {
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          criterio: string
          id?: string
          parametros?: Json | null
          tipo_processo: string
        }
        Update: {
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          criterio?: string
          id?: string
          parametros?: Json | null
          tipo_processo?: string
        }
        Relationships: []
      }
      remuneracoes: {
        Row: {
          ano: number
          criado_em: string
          desconto_inss: number | null
          desconto_irt: number | null
          funcionario_id: string
          id: string
          liquido: number | null
          mes: number
          observacoes: string | null
          outros_descontos: number | null
          outros_subsidios: number | null
          processado: boolean | null
          processado_em: string | null
          subsidio_alimentacao: number | null
          subsidio_ferias: number | null
          subsidio_natal: number | null
          subsidio_transporte: number | null
          total_descontos: number | null
          total_vencimentos: number | null
          vencimento_base: number
        }
        Insert: {
          ano: number
          criado_em?: string
          desconto_inss?: number | null
          desconto_irt?: number | null
          funcionario_id: string
          id?: string
          liquido?: number | null
          mes: number
          observacoes?: string | null
          outros_descontos?: number | null
          outros_subsidios?: number | null
          processado?: boolean | null
          processado_em?: string | null
          subsidio_alimentacao?: number | null
          subsidio_ferias?: number | null
          subsidio_natal?: number | null
          subsidio_transporte?: number | null
          total_descontos?: number | null
          total_vencimentos?: number | null
          vencimento_base: number
        }
        Update: {
          ano?: number
          criado_em?: string
          desconto_inss?: number | null
          desconto_irt?: number | null
          funcionario_id?: string
          id?: string
          liquido?: number | null
          mes?: number
          observacoes?: string | null
          outros_descontos?: number | null
          outros_subsidios?: number | null
          processado?: boolean | null
          processado_em?: string | null
          subsidio_alimentacao?: number | null
          subsidio_ferias?: number | null
          subsidio_natal?: number | null
          subsidio_transporte?: number | null
          total_descontos?: number | null
          total_vencimentos?: number | null
          vencimento_base?: number
        }
        Relationships: [
          {
            foreignKeyName: "remuneracoes_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      retencao_regras: {
        Row: {
          anos_retencao: number
          atualizado_em: string
          criado_em: string
          id: string
          politica: string
          tipo_processo: string
        }
        Insert: {
          anos_retencao: number
          atualizado_em?: string
          criado_em?: string
          id?: string
          politica: string
          tipo_processo: string
        }
        Update: {
          anos_retencao?: number
          atualizado_em?: string
          criado_em?: string
          id?: string
          politica?: string
          tipo_processo?: string
        }
        Relationships: []
      }
      saldo_ferias: {
        Row: {
          ano: number
          atualizado_em: string
          dias_direito: number
          dias_disponiveis: number | null
          dias_gozados: number
          dias_pendentes: number
          funcionario_id: string
          id: string
        }
        Insert: {
          ano: number
          atualizado_em?: string
          dias_direito?: number
          dias_disponiveis?: number | null
          dias_gozados?: number
          dias_pendentes?: number
          funcionario_id: string
          id?: string
        }
        Update: {
          ano?: number
          atualizado_em?: string
          dias_direito?: number
          dias_disponiveis?: number | null
          dias_gozados?: number
          dias_pendentes?: number
          funcionario_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saldo_ferias_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      sessoes_activas: {
        Row: {
          activa: boolean
          id: string
          iniciada_em: string
          ip_address: string | null
          localizacao: string | null
          session_id: string
          ultima_actividade: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          activa?: boolean
          id?: string
          iniciada_em?: string
          ip_address?: string | null
          localizacao?: string | null
          session_id: string
          ultima_actividade?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          activa?: boolean
          id?: string
          iniciada_em?: string
          ip_address?: string | null
          localizacao?: string | null
          session_id?: string
          ultima_actividade?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sla_regras: {
        Row: {
          atualizado_em: string
          criado_em: string
          id: string
          prazo_dias: number
          suspende_por_solicitacao: boolean
          tipo_processo: string
          urgencia: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          prazo_dias: number
          suspende_por_solicitacao?: boolean
          tipo_processo: string
          urgencia: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          prazo_dias?: number
          suspende_por_solicitacao?: boolean
          tipo_processo?: string
          urgencia?: string
        }
        Relationships: []
      }
      solicitacoes_declaracoes: {
        Row: {
          aprovado_em: string | null
          aprovado_por: string | null
          atualizado_em: string
          criado_em: string
          documento_url: string | null
          funcionario_id: string
          id: string
          motivo_rejeicao: string | null
          observacoes: string | null
          processado_em: string | null
          solicitado_em: string
          solicitado_por: string | null
          status: string
          tipo_declaracao: string
        }
        Insert: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          atualizado_em?: string
          criado_em?: string
          documento_url?: string | null
          funcionario_id: string
          id?: string
          motivo_rejeicao?: string | null
          observacoes?: string | null
          processado_em?: string | null
          solicitado_em?: string
          solicitado_por?: string | null
          status?: string
          tipo_declaracao: string
        }
        Update: {
          aprovado_em?: string | null
          aprovado_por?: string | null
          atualizado_em?: string
          criado_em?: string
          documento_url?: string | null
          funcionario_id?: string
          id?: string
          motivo_rejeicao?: string | null
          observacoes?: string | null
          processado_em?: string | null
          solicitado_em?: string
          solicitado_por?: string | null
          status?: string
          tipo_declaracao?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_declaracoes_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          origem_atribuicao: string | null
          role: Database["public"]["Enums"]["app_role"]
          tipo_atribuicao: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          origem_atribuicao?: string | null
          role: Database["public"]["Enums"]["app_role"]
          tipo_atribuicao?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          origem_atribuicao?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          tipo_atribuicao?: string | null
          user_id?: string
        }
        Relationships: []
      }
      utilizador_perfis: {
        Row: {
          atribuido_em: string
          atribuido_por: string | null
          id: string
          perfil_id: string
          user_id: string
        }
        Insert: {
          atribuido_em?: string
          atribuido_por?: string | null
          id?: string
          perfil_id: string
          user_id: string
        }
        Update: {
          atribuido_em?: string
          atribuido_por?: string | null
          id?: string
          perfil_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "utilizador_perfis_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis_utilizador"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_inactive_sessions: { Args: never; Returns: undefined }
      cleanup_old_auth_logs: { Args: never; Returns: undefined }
      get_user_permissions: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["permissao_sistema"][]
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      search_documentos: {
        Args: { search_query: string }
        Returns: {
          id: string
          nome_arquivo: string
          processo_numero: string
          rank: number
          texto_extraido: string
          tipo_documento: string
        }[]
      }
      update_session_activity: {
        Args: { session_id_param: string }
        Returns: undefined
      }
      user_can_access_expediente: {
        Args: { expediente_id: string; user_id: string }
        Returns: boolean
      }
      user_has_permission: {
        Args: {
          _permission: Database["public"]["Enums"]["permissao_sistema"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "tecnico_sg"
        | "chefe_cg"
        | "juiz_relator"
        | "juiz_adjunto"
        | "presidente_camara"
        | "dst"
        | "secretaria"
        | "ministerio_publico"
      permissao_sistema:
        | "processo.criar"
        | "processo.ver"
        | "processo.editar"
        | "processo.autuar"
        | "processo.distribuir"
        | "processo.ver.todos"
        | "processo.submeter.juiz"
        | "expediente.validar"
        | "expediente.aprovar"
        | "expediente.devolver"
        | "documento.anexar"
        | "relatorio.criar"
        | "relatorio.editar"
        | "relatorio.validar"
        | "cq.executar"
        | "oficio.emitir"
        | "decisao.proferir"
        | "decisao.coadjuvar"
        | "prazo.suspender"
        | "vista.mp.abrir"
        | "promocao.emitir"
        | "notificacao.executar"
        | "certidao.emitir"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "tecnico_sg",
        "chefe_cg",
        "juiz_relator",
        "juiz_adjunto",
        "presidente_camara",
        "dst",
        "secretaria",
        "ministerio_publico",
      ],
      permissao_sistema: [
        "processo.criar",
        "processo.ver",
        "processo.editar",
        "processo.autuar",
        "processo.distribuir",
        "processo.ver.todos",
        "processo.submeter.juiz",
        "expediente.validar",
        "expediente.aprovar",
        "expediente.devolver",
        "documento.anexar",
        "relatorio.criar",
        "relatorio.editar",
        "relatorio.validar",
        "cq.executar",
        "oficio.emitir",
        "decisao.proferir",
        "decisao.coadjuvar",
        "prazo.suspender",
        "vista.mp.abrir",
        "promocao.emitir",
        "notificacao.executar",
        "certidao.emitir",
      ],
    },
  },
} as const
