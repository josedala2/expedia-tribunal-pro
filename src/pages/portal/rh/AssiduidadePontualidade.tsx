import AprovacoesPendentes from "./AprovacoesPendentes";

interface AssiduidadePontualidadeProps {
  onBack: () => void;
}

export default function AssiduidadePontualidade({ onBack }: AssiduidadePontualidadeProps) {
  return <AprovacoesPendentes onBack={onBack} />;
}
