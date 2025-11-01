# Sistema de Gestão do Tribunal de Contas

## Perfis de Utilizadores e Áreas de Trabalho

Este documento descreve os perfis de utilizadores, suas permissões e áreas de trabalho conforme os fluxogramas dos processos.

### Perfis Implementados

O sistema implementa 9 perfis baseados nos fluxogramas dos documentos:

#### 1. **Administrador** (`admin`)
- Acesso total ao sistema
- Gestão de utilizadores e permissões
- Configurações do sistema
- Acesso a todas as áreas de trabalho

#### 2. **Técnico da Secretaria Geral** (`tecnico_sg`)
- Registo de entrada de processos
- Digitalização de documentos
- Distribuição inicial
- Tramitação de processos

#### 3. **Chefe da Contabilidade Geral** (`chefe_cg`)
- Validação de documentos
- Conferência de processos
- Despacho de processos
- Análise preliminar

#### 4. **Juiz Relator** (`juiz_relator`)
- Análise técnica de processos
- Emissão de pareceres
- Decisão sobre processos
- Homologação de contas

#### 5. **Juiz Adjunto** (`juiz_adjunto`)
- Apoio ao Juiz Relator
- Análise de processos
- Emissão de pareceres complementares

#### 6. **Presidente da Câmara** (`presidente_camara`)
- Aprovação final de decisões
- Homologação de pareceres
- Decisões estratégicas

#### 7. **DST - Direção de Serviços Técnicos** (`dst`)
- Análise técnica especializada
- Verificação de documentação
- Pareceres técnicos

#### 8. **Secretaria** (`secretaria`)
- Apoio administrativo
- Gestão de expedientes
- Comunicações
- Arquivo de documentos

#### 9. **Ministério Público** (`ministerio_publico`)
- Vista de processos
- Emissão de pareceres jurídicos
- Acompanhamento de processos de multa

### Áreas de Trabalho por Processo

#### **Prestação de Contas** (17 Etapas)
1. Registo de Entrada - Técnico SG
2. Digitalização - Técnico SG
3. Validação da Secretaria - Secretaria
4. Distribuição ao Juiz Relator - Chefe CG
5. Verificação Preliminar - Juiz Relator
6. Distribuição à DST - Juiz Relator
7. Análise Técnica - DST
8. Distribuição ao Juiz - DST
9. Análise de conta - Juiz Relator
10. Vista ao Ministério Público - Juiz Relator
11. Parecer do MP - Ministério Público
12. Decisão - Juiz Relator
13. Homologação - Presidente da Câmara
14. Comunicação da decisão - Secretaria
15. Recurso (se aplicável) - Juiz Relator
16. Arquivamento - Secretaria
17. Expediente de saída - Secretaria

#### **Processo de Visto** (15 Etapas)
1. Registo de Entrada - Técnico SG
2. Digitalização - Técnico SG
3. Validação da Secretaria - Secretaria
4. Verificação Preliminar - Chefe CG
5. Distribuição ao Juiz Relator - Chefe CG
6. Análise do Juiz - Juiz Relator
7. Solicitação de elementos (se necessário) - Juiz Relator
8. Análise de elementos complementares - Juiz Relator
9. Decisão (Concessão/Recusa/Visto Tácito) - Juiz Relator
10. Homologação - Presidente da Câmara
11. Comunicação da decisão - Secretaria
12. Recurso (se aplicável) - Juiz Relator
13. Análise de recurso - Presidente da Câmara
14. Arquivamento - Secretaria
15. Expediente de saída - Secretaria

#### **Fiscalização OGE** (15 Etapas)
1. Receção do Relatório Trimestral - Técnico SG
2. Registo de Entrada - Técnico SG
3. Distribuição ao Juiz Relator - Chefe CG
4. Análise Preliminar - Juiz Relator
5. Notificação de Gestores Observados - Secretaria
6. Receção de Contraditório - Secretaria
7. Análise de Contraditório - Juiz Relator
8. Distribuição à Divisão Competente - Juiz Relator
9. Emissão de Parecer - DST
10. Análise Final - Juiz Relator
11. Decisão - Juiz Relator
12. Homologação - Presidente da Câmara
13. Comunicação ao Ministério das Finanças - Secretaria
14. Arquivamento - Secretaria
15. Acompanhamento de recomendações - DST

### Controle de Acesso

O sistema implementa controle de acesso baseado em:

1. **Row Level Security (RLS)** no banco de dados
2. **Verificação de roles** nas operações
3. **Interface adaptativa** baseada em permissões
4. **Auditoria** de todas as ações

### Gestão de Utilizadores

Apenas administradores podem:
- Criar novos utilizadores
- Atribuir perfis múltiplos
- Remover perfis
- Desativar utilizadores

### Autenticação

- Login com email e senha
- Auto-confirmação de email (ambiente de desenvolvimento)
- Sessões seguras com Supabase Auth
- Logout em todos os dispositivos

### Segurança

- Senhas encriptadas
- Tokens JWT
- Políticas RLS no banco de dados
- Funções security definer para verificação de roles
- Validação de inputs client-side e server-side

## Como Usar

### Login Inicial
1. Acesse `/auth`
2. Crie uma conta com email e senha
3. Um administrador deve atribuir os perfis adequados

### Atribuir Perfis (Admin)
1. Navegue para "Utilizadores" no menu
2. Clique em "Editar" no utilizador
3. Selecione os perfis adequados
4. Clique em "Guardar"

### Navegação
- **Menu Lateral**: Acesso aos diferentes tipos de processos
- **Menu Horizontal**: Utilizadores, Relatórios, Documentos, Configurações
- **Dashboard**: Visão geral de todos os processos

### Fluxo de Trabalho
1. Cada processo segue as etapas definidas nos fluxogramas
2. Apenas utilizadores com perfis adequados podem executar ações
3. Todas as ações são registadas com timestamp e utilizador
4. Notificações automáticas para próximas etapas

## Tecnologias

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Lovable Cloud (Supabase)
- **Banco de Dados**: PostgreSQL com RLS
- **Autenticação**: Supabase Auth
- **UI Components**: shadcn/ui

## Suporte

Para questões sobre perfis e permissões, contacte o administrador do sistema.
