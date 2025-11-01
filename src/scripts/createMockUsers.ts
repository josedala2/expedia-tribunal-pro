import { supabase } from "@/integrations/supabase/client";

const mockUsers = [
  { 
    nome: "Admin Geral", 
    email: "admin@tc.gov.ao", 
    password: "admin123", 
    roles: ["admin"] 
  },
  { 
    nome: "João Silva", 
    email: "joao.silva@tc.gov.ao", 
    password: "tecnico123", 
    roles: ["tecnico_sg"] 
  },
  { 
    nome: "Maria Santos", 
    email: "maria.santos@tc.gov.ao", 
    password: "chefe123", 
    roles: ["chefe_cg"] 
  },
  { 
    nome: "Carlos Neto", 
    email: "carlos.neto@tc.gov.ao", 
    password: "juiz123", 
    roles: ["juiz_relator"] 
  },
  { 
    nome: "Ana Costa", 
    email: "ana.costa@tc.gov.ao", 
    password: "dst123", 
    roles: ["dst"] 
  },
];

export async function createMockUsers() {
  console.log("Criando usuários de teste...");

  for (const user of mockUsers) {
    try {
      // Primeiro, tenta fazer login para ver se já existe
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      });

      if (loginData.user) {
        console.log(`✓ Usuário ${user.email} já existe`);
        
        // Verificar e adicionar roles se necessário
        for (const role of user.roles) {
          const { error: roleError } = await supabase
            .from("user_roles")
            .upsert({
              user_id: loginData.user.id,
              role: role as any,
            });
          
          if (!roleError) {
            console.log(`✓ Role ${role} adicionado para ${user.email}`);
          }
        }
        
        // Fazer logout
        await supabase.auth.signOut();
        continue;
      }

      // Se não existe, criar novo usuário
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            nome_completo: user.nome,
          },
        },
      });

      if (signupError) {
        console.error(`✗ Erro ao criar ${user.email}:`, signupError.message);
        continue;
      }

      if (signupData.user) {
        console.log(`✓ Usuário ${user.email} criado com sucesso`);

        // Fazer login para adicionar roles
        const { data: loginData2 } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: user.password,
        });

        if (loginData2.user) {
          // Adicionar roles
          for (const role of user.roles) {
            const { error: roleError } = await supabase
              .from("user_roles")
              .insert({
                user_id: loginData2.user.id,
                role: role as any,
              });

            if (roleError) {
              console.error(`✗ Erro ao adicionar role ${role}:`, roleError.message);
            } else {
              console.log(`✓ Role ${role} adicionado para ${user.email}`);
            }
          }

          // Fazer logout
          await supabase.auth.signOut();
        }
      }
    } catch (error) {
      console.error(`✗ Erro ao processar ${user.email}:`, error);
    }
  }

  console.log("Processo concluído!");
}
