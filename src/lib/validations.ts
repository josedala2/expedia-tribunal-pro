// Validações de campos

/**
 * Valida o nome de uma pessoa ou entidade
 * - Mínimo 2 palavras
 * - Não permite "null", apenas números, ou formatos incoerentes
 */
export const validateName = (name: string): { valid: boolean; message?: string } => {
  if (!name || name.trim().length === 0) {
    return { valid: false, message: "O nome é obrigatório" };
  }

  const trimmedName = name.trim();
  
  // Verifica se é "null" ou variações
  if (trimmedName.toLowerCase() === "null" || trimmedName.toLowerCase() === "n/a") {
    return { valid: false, message: "Nome inválido" };
  }

  // Verifica se contém apenas números
  if (/^\d+$/.test(trimmedName)) {
    return { valid: false, message: "O nome não pode conter apenas números" };
  }

  // Verifica se tem pelo menos 2 caracteres
  if (trimmedName.length < 2) {
    return { valid: false, message: "O nome deve ter pelo menos 2 caracteres" };
  }

  // Verifica se contém caracteres especiais inválidos
  if (/[<>{}[\]\\\/]/.test(trimmedName)) {
    return { valid: false, message: "O nome contém caracteres inválidos" };
  }

  return { valid: true };
};

/**
 * Valida NIF (9 dígitos)
 */
export const validateNIF = (nif: string): { valid: boolean; message?: string } => {
  if (!nif || nif.trim().length === 0) {
    return { valid: false, message: "O NIF é obrigatório" };
  }

  const cleanNIF = nif.replace(/\s/g, "");
  
  if (!/^\d{9}$/.test(cleanNIF)) {
    return { valid: false, message: "O NIF deve ter exactamente 9 dígitos" };
  }

  return { valid: true };
};

/**
 * Valida data - não permite datas futuras
 */
export const validateDateNotFuture = (date: string): { valid: boolean; message?: string } => {
  if (!date) {
    return { valid: false, message: "A data é obrigatória" };
  }

  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (inputDate > today) {
    return { valid: false, message: "A data não pode ser superior à data actual" };
  }

  return { valid: true };
};

/**
 * Valida ficheiro - apenas PDF
 */
export const validatePDFFile = (file: File): { valid: boolean; message?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10 MB
  const allowedTypes = ["application/pdf"];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: "Apenas ficheiros PDF são permitidos" };
  }

  if (file.size > maxSize) {
    return { valid: false, message: "O ficheiro não pode exceder 10 MB" };
  }

  return { valid: true };
};

/**
 * Gera número de contrato automático
 */
export const generateContractNumber = (): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  return `CT/${year}/${String(randomNum).padStart(4, "0")}`;
};

/**
 * Gera número de processo automático
 */
export const generateProcessNumber = (prefix: string = "VP"): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  return `${prefix}-${year}-${String(randomNum).padStart(4, "0")}`;
};
