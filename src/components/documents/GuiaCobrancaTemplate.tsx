import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentFooter } from "./DocumentFooter";

interface GuiaCobrancaData {
  numero: string;
  processo: string;
  entidade: string;
  nif: string;
  endereco: string;
  dataEmissao: Date;
  dataVencimento: Date;
  descricao: string;
  valor: number;
  emolumentos: number;
  total: number;
}

interface GuiaCobrancaTemplateProps {
  data: GuiaCobrancaData;
  logoUrl?: string;
}

export const GuiaCobrancaTemplate = ({ data, logoUrl }: GuiaCobrancaTemplateProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(value);
  };

  return (
    <div className="bg-white p-12 max-w-4xl mx-auto" id="document-content">
      <DocumentHeader logoUrl={logoUrl} />

      <div className="text-center mb-8">
        <h2 className="text-xl font-bold mb-2">GUIA DE COBRANÇA</h2>
        <p className="font-semibold">Nº {data.numero}</p>
      </div>

      <div className="mb-8 p-6 border-2 border-gray-300 rounded">
        <h3 className="font-bold mb-4">DADOS DO CONTRIBUINTE</h3>
        <div className="space-y-2">
          <p><span className="font-semibold">Entidade:</span> {data.entidade}</p>
          <p><span className="font-semibold">NIF:</span> {data.nif}</p>
          <p><span className="font-semibold">Endereço:</span> {data.endereco}</p>
          <p><span className="font-semibold">Processo:</span> {data.processo}</p>
        </div>
      </div>

      <div className="mb-8 p-6 border-2 border-gray-300 rounded">
        <h3 className="font-bold mb-4">DETALHES DA COBRANÇA</h3>
        <div className="space-y-2">
          <p><span className="font-semibold">Data de Emissão:</span> {format(data.dataEmissao, "dd/MM/yyyy")}</p>
          <p><span className="font-semibold">Data de Vencimento:</span> {format(data.dataVencimento, "dd/MM/yyyy")}</p>
          <p><span className="font-semibold">Descrição:</span> {data.descricao}</p>
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full border-2 border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-3 text-left">Descrição</th>
              <th className="border border-gray-300 p-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-3">Emolumentos do Processo</td>
              <td className="border border-gray-300 p-3 text-right">{formatCurrency(data.emolumentos)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3">Outras Taxas</td>
              <td className="border border-gray-300 p-3 text-right">{formatCurrency(data.valor)}</td>
            </tr>
            <tr className="bg-gray-100 font-bold">
              <td className="border border-gray-300 p-3">TOTAL A PAGAR</td>
              <td className="border border-gray-300 p-3 text-right text-lg">{formatCurrency(data.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-8 p-4 bg-yellow-50 border border-yellow-300 rounded">
        <h4 className="font-bold mb-2">INSTRUÇÕES DE PAGAMENTO</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>O pagamento deve ser efetuado até a data de vencimento indicada</li>
          <li>Pagamentos após o vencimento estão sujeitos a multas e juros</li>
          <li>Efetue o pagamento através dos canais oficiais do Tribunal de Contas</li>
          <li>Guarde o comprovante de pagamento para sua segurança</li>
        </ul>
      </div>

      <div className="text-center text-sm text-gray-600">
        <p>Este documento é válido sem assinatura conforme legislação em vigor</p>
      </div>

      <DocumentFooter pageNumber={1} totalPages={1} />
    </div>
  );
};
