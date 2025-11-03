import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { entidadesPorCategoria, CategoriaEntidade } from "@/data/entidades";
import { useState, useEffect } from "react";

interface EntitySelectorProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export const EntitySelector = ({ 
  value, 
  onChange, 
  label = "Entidade/Instituição",
  placeholder = "Selecione a entidade",
  required = false,
  error
}: EntitySelectorProps) => {
  const [categoria, setCategoria] = useState<CategoriaEntidade | "">("");
  const [entidade, setEntidade] = useState<string>("");

  // Se já houver um valor, tenta determinar a categoria e entidade
  useEffect(() => {
    if (value && !entidade) {
      // Procura em qual categoria está a entidade
      for (const [key, cat] of Object.entries(entidadesPorCategoria)) {
        if (cat.entidades.includes(value)) {
          setCategoria(key as CategoriaEntidade);
          setEntidade(value);
          break;
        }
      }
    }
  }, [value]);

  const handleCategoriaChange = (newCategoria: string) => {
    setCategoria(newCategoria as CategoriaEntidade);
    setEntidade(""); // Limpa a entidade quando muda a categoria
    onChange(""); // Notifica que o valor foi limpo
  };

  const handleEntidadeChange = (newEntidade: string) => {
    setEntidade(newEntidade);
    onChange(newEntidade);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>
          Órgão de Soberania {required && "*"}
        </Label>
        <Select value={categoria} onValueChange={handleCategoriaChange}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Selecione o órgão de soberania" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            {Object.entries(entidadesPorCategoria).map(([key, cat]) => (
              <SelectItem key={key} value={key}>
                {key}. {cat.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {categoria && (
        <div className="space-y-2">
          <Label>
            {label} {required && "*"}
          </Label>
          <Select value={entidade} onValueChange={handleEntidadeChange}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50 max-h-[300px]">
              {entidadesPorCategoria[categoria].entidades.map((ent) => (
                <SelectItem key={ent} value={ent}>
                  {ent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )}
    </div>
  );
};
