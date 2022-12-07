import { useState } from "react";

export default function Galeria(props: { titulo: string; fotos: string[] }) {
  const { titulo, fotos } = props;
  const [fotoAtual, setFotoAtual] = useState(0);
  const ultima = fotos.length - 1;
  const estaNaPrimeira = fotoAtual === 0;
  const estaNaUltima = fotoAtual === ultima;

  function vaiParaProximaFoto() {
    setFotoAtual(fotoAtual + 1);
  }

  function vaiParaFotoAnterior() {
    setFotoAtual(fotoAtual - 1);
  }

  function vaiParaPrimeiraFoto() {
    setFotoAtual(0);
  }

  function vaiParaUltimaFoto() {
    setFotoAtual(ultima);
  }

  return (
    <div className="galeria">
      <h3>{titulo}</h3>
      {fotos.length === 0 && <div>Nenhuma foto</div>}
      {fotos.length > 0 && (
        <div>
          <div>
            Foto {fotoAtual + 1} de {fotos.length}
            <br />
            <button disabled={estaNaPrimeira} onClick={vaiParaPrimeiraFoto}>
              Primeira
            </button>
            <button disabled={estaNaPrimeira} onClick={vaiParaFotoAnterior}>
              Anterior
            </button>
            <button disabled={estaNaUltima} onClick={vaiParaProximaFoto}>
              Próxima
            </button>
            <button disabled={estaNaUltima} onClick={vaiParaUltimaFoto}>
              Última
            </button>
          </div>
          <img src={fotos[fotoAtual]} alt={`Foto ${fotoAtual + 1}`} />
        </div>
      )}
    </div>
  );
}
