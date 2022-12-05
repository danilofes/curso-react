import { useState } from "react";

export default function Galeria(props: { titulo: string; fotos: string[] }) {
  const { titulo, fotos } = props;
  const [fotoAtual, setFotoAtual] = useState(0);
  const ultima = fotos.length - 1;

  function voltaParaPrimeira() {
    setFotoAtual(0);
  }

  function voltaParaAnterior() {
    setFotoAtual(fotoAtual - 1);
  }

  function vaiParaProxima() {
    setFotoAtual(fotoAtual + 1);
  }

  function vaiParaUltima() {
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
            <button onClick={voltaParaPrimeira} disabled={fotoAtual === 0}>
              Primeira
            </button>
            <button onClick={voltaParaAnterior} disabled={fotoAtual === 0}>
              Anterior
            </button>
            <button onClick={vaiParaProxima} disabled={fotoAtual === ultima}>
              Próxima
            </button>
            <button onClick={vaiParaUltima} disabled={fotoAtual === ultima}>
              Última
            </button>
          </div>

          <img src={fotos[fotoAtual]} alt={`Foto ${fotoAtual + 1}`} />
        </div>
      )}
    </div>
  );
}
