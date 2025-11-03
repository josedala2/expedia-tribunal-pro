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
  const [categoria, setCategoria] = useState<CategoriaEntidade | undefined>(undefined);
  const [subcategoria, setSubcategoria] = useState<string | undefined>(undefined);
  const [tutela, setTutela] = useState<string | undefined>(undefined);
  const [entidade, setEntidade] = useState<string | undefined>(undefined);

  // Se já houver um valor, tenta determinar a categoria e entidade
  useEffect(() => {
    if (value && !entidade) {
      // Procura em qual categoria está a entidade
      for (const [key, cat] of Object.entries(entidadesPorCategoria)) {
        // @ts-ignore
        if (cat.hasSubcategories && cat.subcategorias) {
          // @ts-ignore
          for (const [subKey, subCat] of Object.entries(cat.subcategorias)) {
            // @ts-ignore
            if (subCat.hasTutelas && subCat.porTutela) {
              // @ts-ignore
              for (const [tutKey, tutData] of Object.entries(subCat.porTutela)) {
                // @ts-ignore
                if (tutData.entidades.includes(value)) {
                  setCategoria(key as CategoriaEntidade);
                  setSubcategoria(subKey);
                  setTutela(tutKey);
                  setEntidade(value);
                  return;
                }
              }
            } else {
              // @ts-ignore
              if (subCat.entidades && subCat.entidades.includes(value)) {
                setCategoria(key as CategoriaEntidade);
                setSubcategoria(subKey);
                setEntidade(value);
                return;
              }
            }
          }
        } else {
          // @ts-ignore
          if (cat.entidades && cat.entidades.includes(value)) {
            setCategoria(key as CategoriaEntidade);
            setEntidade(value);
            return;
          }
        }
      }
    }
  }, [value]);

  const handleCategoriaChange = (newCategoria: string) => {
    setCategoria(newCategoria as CategoriaEntidade);
    setSubcategoria(undefined);
    setTutela(undefined);
    setEntidade(undefined);
    onChange("");
  };

  const handleSubcategoriaChange = (newSubcategoria: string) => {
    setSubcategoria(newSubcategoria);
    setTutela(undefined);
    setEntidade(undefined);
    onChange("");
  };

  const handleTutelaChange = (newTutela: string) => {
    setTutela(newTutela);
    setEntidade(undefined);
    onChange("");
  };

  const handleEntidadeChange = (newEntidade: string) => {
    setEntidade(newEntidade);
    onChange(newEntidade);
  };

  const categoriaData = categoria ? entidadesPorCategoria[categoria] : null;
  // @ts-ignore
  const hasSubcategories = categoriaData?.hasSubcategories;
  // @ts-ignore
  const subcategorias = categoriaData?.subcategorias;
  // @ts-ignore
  const subcategoriaData = subcategoria && subcategorias ? subcategorias[subcategoria] : null;
  // @ts-ignore
  const hasTutelas = subcategoriaData?.hasTutelas;
  // @ts-ignore
  const porTutela = subcategoriaData?.porTutela;

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

      {categoria && hasSubcategories && (
        <div className="space-y-2">
          <Label>
            Tipo de Entidade {required && "*"}
          </Label>
          <Select value={subcategoria} onValueChange={handleSubcategoriaChange}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {Object.entries(subcategorias || {}).map(([key, subCat]: [string, any]) => (
                <SelectItem key={key} value={key}>
                  {subCat.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {categoria && hasSubcategories && subcategoria && hasTutelas && (
        <div className="space-y-2">
          <Label>
            Ministério de Tutela {required && "*"}
          </Label>
          <Select value={tutela} onValueChange={handleTutelaChange}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Selecione o ministério" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50 max-h-[300px]">
              {Object.entries(porTutela || {}).map(([key, tutData]: [string, any]) => (
                <SelectItem key={key} value={key}>
                  {tutData.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {categoria && ((hasSubcategories && subcategoria && ((hasTutelas && tutela) || !hasTutelas)) || !hasSubcategories) && (
        <div className="space-y-2">
          <Label>
            {label} {required && "*"}
          </Label>
          <Select value={entidade} onValueChange={handleEntidadeChange}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50 max-h-[300px]">
              {hasSubcategories && subcategoria 
                ? (hasTutelas && tutela && porTutela[tutela]
                    ? porTutela[tutela].entidades.map((ent: string) => (
                        <SelectItem key={ent} value={ent}>
                          {ent}
                        </SelectItem>
                      ))
                    : subcategoriaData?.entidades?.map((ent: string) => (
                        <SelectItem key={ent} value={ent}>
                          {ent}
                        </SelectItem>
                      ))
                  )
                : // @ts-ignore
                  categoriaData?.entidades?.map((ent: string) => (
                    <SelectItem key={ent} value={ent}>
                      {ent}
                    </SelectItem>
                  ))
              }
            </SelectContent>
          </Select>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )}
    </div>
  );
};
