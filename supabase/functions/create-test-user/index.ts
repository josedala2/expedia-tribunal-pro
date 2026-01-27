import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const testUser = existingUsers?.users?.find(u => u.email === 'teste@tc.gov.ao')

    if (testUser) {
      return new Response(
        JSON.stringify({ message: 'Utilizador de teste já existe', user: { email: testUser.email } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create the test user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: 'teste@tc.gov.ao',
      password: 'teste123',
      email_confirm: true,
      user_metadata: { nome_completo: 'Utilizador de Teste' }
    })

    if (error) throw error

    return new Response(
      JSON.stringify({ message: 'Utilizador de teste criado com sucesso', user: { email: data.user?.email } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
