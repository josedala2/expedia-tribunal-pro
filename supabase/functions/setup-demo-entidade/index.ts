import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const email = "entidade.demo@tc.gov.ao";
    const password = "demo123";

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u) => u.email === email);

    let userId: string;

    if (existing) {
      userId = existing.id;
    } else {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { nome_completo: "Utilizador Demo Entidade", tipo_utilizador: "entidade_externa" },
      });
      if (createError) throw createError;
      userId = newUser.user.id;
    }

    // Check if entity exists
    const { data: existingEnt } = await supabase
      .from("entidades_externas")
      .select("id")
      .eq("email", "demo@minfin.gov.ao")
      .maybeSingle();

    let entidadeId: string;

    if (existingEnt) {
      entidadeId = existingEnt.id;
      // Make sure it's approved
      await supabase.from("entidades_externas").update({ status: "aprovada" }).eq("id", entidadeId);
    } else {
      const { data: newEnt, error: entError } = await supabase
        .from("entidades_externas")
        .insert({
          nome: "Ministério das Finanças (Demo)",
          sigla: "MINFIN",
          nif: "5000000001",
          email: "demo@minfin.gov.ao",
          telefone: "+244 222 000 000",
          endereco: "Largo da Mutamba, Luanda",
          tipo_entidade: "Órgão Público",
          provincia: "Luanda",
          responsavel_nome: "João Demo Silva",
          responsavel_cargo: "Director Administrativo",
          responsavel_email: email,
          responsavel_telefone: "+244 923 000 000",
          status: "aprovada",
        })
        .select()
        .single();
      if (entError) throw entError;
      entidadeId = newEnt.id;
    }

    // Link user to entity
    const { data: existingLink } = await supabase
      .from("utilizadores_entidade")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!existingLink) {
      const { error: linkError } = await supabase.from("utilizadores_entidade").insert({
        user_id: userId,
        entidade_id: entidadeId,
        nome_completo: "João Demo Silva",
        cargo: "Director Administrativo",
        telefone: "+244 923 000 000",
        is_responsavel: true,
      });
      if (linkError) throw linkError;
    }

    return new Response(JSON.stringify({ success: true, email, password }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
