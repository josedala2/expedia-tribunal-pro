import { format } from "date-fns";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentFooter } from "./DocumentFooter";

interface DespachoPromocaoData {
  numero: string;
  processo: string;
  entidade: string;
  decisaoJuiz: string;
  dataDecisao: Date;
  fundamentacao: string;
  parecerMP: string;
  observacoes?: string;
  procuradorResponsavel: string;
  dataEmissao: Date;
}

interface DespachoPromocaoTemplateProps {
  data: DespachoPromocaoData;
  logoUrl?: string;
}

export const DespachoPromocaoTemplate = ({ data, logoUrl }: DespachoPromocaoTemplateProps) => {
  return (
    <div className="bg-white p-12 max-w-4xl mx-auto" id="document-content">
      <DocumentHeader logoUrl={logoUrl} />

      <div className="text-center mb-8">
        <h2 className="text-xl font-bold mb-2">DESPACHO DE PROMOÇÃO</h2>
        <p className="font-semibold">Nº {data.numero}</p>
        <p className="text-sm text-gray-600 mt-2">Ministério Público</p>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-3 text-lg border-b pb-2">I. IDENTIFICAÇÃO DO PROCESSO</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-semibold">Processo:</span> {data.processo}</p>
          <p><span className="font-semibold">Entidade:</span> {data.entidade}</p>
          <p><span className="font-semibold">Decisão do Juiz Relator:</span> {data.decisaoJuiz}</p>
          <p><span className="font-semibold">Data da Decisão:</span> {format(data.dataDecisao, "dd/MM/yyyy")}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-3 text-lg border-b pb-2">II. FUNDAMENTAÇÃO LEGAL</h3>
        <div className="text-justify leading-relaxed text-sm whitespace-pre-line">
          {data.fundamentacao}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-3 text-lg border-b pb-2">III. PARECER DO MINISTÉRIO PÚBLICO</h3>
        <div className="text-justify leading-relaxed text-sm whitespace-pre-line">
          {data.parecerMP}
        </div>
      </div>

      {data.observacoes && (
        <div className="mb-6">
          <h3 className="font-bold mb-3 text-lg border-b pb-2">IV. OBSERVAÇÕES</h3>
          <div className="text-justify leading-relaxed text-sm whitespace-pre-line">
            {data.observacoes}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="font-bold mb-3 text-lg border-b pb-2">CONCLUSÃO</h3>
        <div className="text-justify leading-relaxed text-sm">
          <p>
            Face ao exposto, o Ministério Público manifesta-se nos termos do presente despacho, 
            remetendo os autos à CG-SFP para os devidos efeitos legais, com posterior submissão ao 
            Juiz Relator para conhecimento da presente promoção.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="mb-1">Luanda, {format(data.dataEmissao, "dd 'de' MMMM 'de' yyyy")}</p>
        <div className="mt-8 pt-4 border-t border-gray-400 inline-block px-8">
          <p className="font-semibold">{data.procuradorResponsavel}</p>
          <p className="text-sm">Procurador junto ao Tribunal de Contas</p>
        </div>
      </div>

      <DocumentFooter pageNumber={1} totalPages={1} />
    </div>
  );
};
