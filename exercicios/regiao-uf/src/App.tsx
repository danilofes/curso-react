import { useEffect, useState } from "react";

interface Regiao {
  id: number;
  sigla: string;
  nome: string;
}

interface Estado {
  id: number;
  sigla: string;
  nome: string;
  regiao: Regiao;
}

const urlBase = "https://servicodados.ibge.gov.br/api/v1/localidades";

function App() {
  const [regioes, setRegioes] = useState<Regiao[]>([]);
  const [idRegiao, setIdRegiao] = useState("");
  const [estados, setEstados] = useState<Estado[]>([]);
  const [idEstado, setIdEstado] = useState("");

  // Busca as regiões ao montar
  useEffect(() => {
    fetchJson<Regiao[]>(`${urlBase}/regioes`).then(setRegioes);
  }, []);

  // Busca os estados quando idRegiao muda e valor não vazio
  useEffect(() => {
    if (idRegiao) {
      fetchJson<Estado[]>(`${urlBase}/regioes/${idRegiao}/estados`).then(
        setEstados
      );
    }
  }, [idRegiao]);

  return (
    <form>
      <div className="campo">
        <label htmlFor="reg">Região:</label>
        <select
          id="reg"
          value={idRegiao}
          onChange={(e) => {
            setIdRegiao(e.target.value);
            setIdEstado("");
          }}
        >
          <option value="">Escolha a região</option>
          {regioes.map((regiao) => (
            <option key={regiao.id} value={regiao.id}>
              {regiao.nome}
            </option>
          ))}
        </select>
      </div>
      <div className="campo">
        <label htmlFor="uf">Estado:</label>
        <select
          id="uf"
          value={idEstado}
          onChange={(e) => setIdEstado(e.target.value)}
          disabled={!idRegiao}
        >
          <option value="">Escolha o estado</option>
          {estados.map((estado) => (
            <option key={estado.id} value={estado.id}>
              {estado.nome}
            </option>
          ))}
        </select>
      </div>
      <div>ID do estado escolhido: {idEstado}</div>
    </form>
  );
}

function fetchJson<T>(url: string): Promise<T> {
  return fetch(url).then((r) => r.json());
}

export default App;
