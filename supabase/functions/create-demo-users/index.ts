import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Lista de utilizadores demo a criar
const demoUsers = [
  { email: 'presidente.tc@tc.gov.ao', nome: 'Presidente do TC', perfil: 'Presidente do TC' },
  { email: 'presidente.1camara@tc.gov.ao', nome: 'Presidente da 1ª Câmara', perfil: 'Presidente da 1.ª Câmara' },
  { email: 'presidente.2camara@tc.gov.ao', nome: 'Presidente da 2ª Câmara', perfil: 'Presidente da 2.ª Câmara' },
  { email: 'juiz.relator@tc.gov.ao', nome: 'Juiz Relator Demo', perfil: 'Juiz Relator' },
  { email: 'juiz.adjunto@tc.gov.ao', nome: 'Juiz Adjunto Demo', perfil: 'Juiz Adjunto' },
  { email: 'mp@tc.gov.ao', nome: 'Ministério Público Demo', perfil: 'Ministério Público' },
  { email: 'dst@tc.gov.ao', nome: 'Director Serviços Técnicos', perfil: 'Director dos Serviços Técnicos (DST)' },
  { email: 'chefe.sg@tc.gov.ao', nome: 'Chefe da Secretaria Geral', perfil: 'Chefe SG' },
  { email: 'chefe.divisao@tc.gov.ao', nome: 'Chefe de Divisão Demo', perfil: 'Chefe de Divisão' },
  { email: 'chefe.seccao@tc.gov.ao', nome: 'Chefe de Secção Demo', perfil: 'Chefe de Secção' },
  { email: 'contadoria@tc.gov.ao', nome: 'Contadoria Geral Demo', perfil: 'Contadoria Geral' },
  { email: 'tecnico@tc.gov.ao', nome: 'Técnico Demo', perfil: 'Técnico' },
  { email: 'tecnico.sg@tc.gov.ao', nome: 'Técnico SG Demo', perfil: 'Técnico SG' },
  { email: 'oficial@tc.gov.ao', nome: 'Oficial de Diligências Demo', perfil: 'Oficial de Diligências' },
  { email: '1divisao@tc.gov.ao', nome: '1ª Divisão Demo', perfil: '1ª Divisão' },
  { email: '2divisao@tc.gov.ao', nome: '2ª Divisão Demo', perfil: '2ª Divisão' },
  { email: '3divisao@tc.gov.ao', nome: '3ª Divisão Fiscalização', perfil: '3ª Divisão - Fiscalização OGE' },
  { email: 'fiscalizacao@tc.gov.ao', nome: 'Dept. Fiscalização Demo', perfil: 'Departamento de Fiscalização' },
  { email: 'fisc.preventiva@tc.gov.ao', nome: 'Fiscalização Preventiva', perfil: 'Secção de Fiscalização Preventiva' },
  { email: 'fisc.sucessiva@tc.gov.ao', nome: 'Fiscalização Sucessiva', perfil: 'Secção de Fiscalização Sucessiva' },
  { email: 'entidade@tc.gov.ao', nome: 'Representante Entidade', perfil: 'Representante da Entidade' },
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const results: Array<{ email: string; status: string; error?: string }> = []

    // Buscar perfis existentes
    const { data: perfis } = await supabaseAdmin
      .from('perfis_utilizador')
      .select('id, nome_perfil')
      .eq('activo', true)

    const perfilMap = new Map(perfis?.map(p => [p.nome_perfil, p.id]) || [])

    // Listar utilizadores existentes
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingEmails = new Set(existingUsers?.users?.map(u => u.email) || [])

    for (const demoUser of demoUsers) {
      try {
        if (existingEmails.has(demoUser.email)) {
          results.push({ email: demoUser.email, status: 'já existe' })
          continue
        }

        // Criar utilizador
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
          email: demoUser.email,
          password: 'demo123',
          email_confirm: true,
          user_metadata: { nome_completo: demoUser.nome }
        })

        if (userError) {
          results.push({ email: demoUser.email, status: 'erro', error: userError.message })
          continue
        }

        // Atribuir perfil se existir
        const perfilId = perfilMap.get(demoUser.perfil)
        if (perfilId && userData.user) {
          await supabaseAdmin
            .from('utilizador_perfis')
            .insert({
              user_id: userData.user.id,
              perfil_id: perfilId
            })
        }

        results.push({ email: demoUser.email, status: 'criado' })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido'
        results.push({ email: demoUser.email, status: 'erro', error: message })
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Processo concluído', 
        results,
        totalCriados: results.filter(r => r.status === 'criado').length,
        totalExistentes: results.filter(r => r.status === 'já existe').length,
        totalErros: results.filter(r => r.status === 'erro').length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Erro ao criar utilizadores demo:', message)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
