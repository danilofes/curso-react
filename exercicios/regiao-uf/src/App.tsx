import { useEffect, useState } from "react";
import { buscaEstados, buscaRegioes, Estado, Regiao } from "./api";

export default function App() {
  const [regioes, setRegioes] = useState<Regiao[]>([]);
  useEffect(() => {
    buscaRegioes().then(setRegioes);
  }, []);

  const [idRegiao, setIdRegiao] = useState<string>("");

  const [estados, setEstados] = useState<Estado[]>([]);
  useEffect(() => {
    if (idRegiao) {
      buscaEstados(idRegiao).then(setEstados);
    }
  }, [idRegiao]);

  const [idUf, setIdUf] = useState<string>("");

  return (
    <form>
      <div>
        <label htmlFor="reg">Região: </label>
        <select
          id="reg"
          value={idRegiao}
          onChange={(e) => {
            setIdRegiao(e.target.value);
            setIdUf("");
          }}
        >
          <option value="">Escolha uma região</option>
          {regioes.map((regiao) => (
            <option key={regiao.id} value={regiao.id}>
              {regiao.nome}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="uf">Estado: </label>
        <select id="uf" value={idUf} onChange={(e) => setIdUf(e.target.value)} disabled={!idRegiao}>
          <option value="">Escolha uma estado</option>
          {estados.map((estado) => (
            <option key={estado.id} value={estado.id}>
              {estado.nome}
            </option>
          ))}
        </select>
      </div>
      <div>ID do estado selecionado: {idUf}</div>
    </form>
  );
}
