import AprovacoesPendentes from "./AprovacoesPendentes";

interface GestaoFeriasLicencasProps {
  onBack: () => void;
}

export default function GestaoFeriasLicencas({ onBack }: GestaoFeriasLicencasProps) {
  return <AprovacoesPendentes onBack={onBack} />;
}
