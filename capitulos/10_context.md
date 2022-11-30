Normalmente passamos dados de um componente para outro via `props`.
No entanto, essa forma de passar dados pode ser tornar verbosa e inconveniente quando a informação precisa ser repassada por vários componentes até chegar no seu destinatário final, ou quando a informação é utilizada em quase toda a aplicação.
O React oferece um recurso conhecido como contexto que nos permite passar valores de um componente para um descendente, em qualquer nível de aninhamento, de forma implícita.
Vamos considerar, como ilustração, o exemplo a seguir.

```tsx
export default function ExemploContext() {
  const [idioma, setIdioma] = useState("pt");
  return (
    <div>
      <label>
        Idioma:{" "}
        <select value={idioma} onChange={(e) => setIdioma(e.target.value)}>
          <option value="pt">Português</option>
          <option value="en">Inglês</option>
        </select>
      </label>
      <div>
        <Componente1 idioma={idioma} />
      </div>
    </div>
  );
}

function Componente1(props: { idioma: string }) {
  return <Componente2 idioma={props.idioma} />;
}

function Componente2(props: { idioma: string }) {
  return <Componente3 idioma={props.idioma} />;
}

function Componente3(props: { idioma: string }) {
  return <ValorMonetario idioma={props.idioma} valor={4.7} />;
}

function ValorMonetario(props: { idioma: string; valor: number }) {
  const valorDecimal = props.valor.toFixed(2);
  if (props.idioma === "pt") {
    return <span>R$ {valorDecimal.replace(".", ",")}</span>;
  } else {
    return <span>$ {valorDecimal}</span>;
  }
}
```

No componente principal, `ExemploContext`, temos o estado `idioma` e um elemento `select` para selecionar seu valor.
O valor de `idioma` é utilizado no componente `ValorMonetario`, pois a moeda e o separador decimal dependem do idioma.
Note que `idioma` é passado via `props`.
Como existem vários componentes intermediários entre `ExemploContext` até `ValorMonetario`, `idioma` é repassado por todos eles via `props`.
Essa situação inconveniente costuma ser chamada de "prop drilling".

### Criando um contexto

Vamos modificar solução acima para utilizar contexto.
O primeiro passo é definir um contexto por meio da função `createContext`:

```tsx
const idiomaContext = createContext("pt");
```

Essa função recebe como parâmetro o valor padrão do contexto e retorna um objeto que representa o contexto criado.
Usaremos o objeto retornado para especificar o valor do contexto e utilizá-lo.

:::info
**Nota:**
O contexto possui um tipo associado, e o TypeSCript normalmente infere esse tipo pelo valor padrão passado como parâmetro para `createContext`.
No entanto, `createContext` recebe um tipo parametrizado se desejarmos informá-lo explicitamente, por exemplo `createContext<string>("pt")`.
:::

### Definindo um Provider

Definimos o valor do contexto por meio do componente especial `idiomaContext.Provider`, por exemplo:

```tsx
<idiomaContext.Provider value={"en"}>
  {/* Qualquer componente descendente deste Provider pode acessar o valor definido no contexto. */}
</idiomaContext.Provider>
```

Qualquer componente envolvido pela tag `Provider`, não importando o quão profundo ele esteja, terá acesso ao valor do contexto, que é definido pela propriedade `value`.
O valor definido no `Provider` sobrescreve o valor padrão que informamos na criação do contexto.

### Acessando o valor do contexto

Para acessar o valor do contexto chamamos o hook `useContext`, passando o contexto como parâmetro.
O código-fonte completo da solução ficaria assim:

```tsx
const idiomaContext = createContext("pt");

export default function ExemploContext() {
  const [idioma, setIdioma] = useState("pt");
  return (
    <div>
      <label>
        Idioma:{" "}
        <select value={idioma} onChange={(e) => setIdioma(e.target.value)}>
          <option value="pt">Português</option>
          <option value="en">Inglês</option>
        </select>
      </label>
      <idiomaContext.Provider value={idioma}>
        <div>
          <Componente1 /> {/* Não precisamos mais passar idioma via props */}
        </div>
      </idiomaContext.Provider>
    </div>
  );
}

function Componente1() {
  return <Componente2 />;
}

function Componente2() {
  return <Componente3 />;
}

function Componente3() {
  return <ValorMonetario valor={4.7} />;
}

function ValorMonetario(props: { valor: number }) {
  const idioma = useContext(idiomaContext);
  const valorDecimal = props.valor.toFixed(2);
  if (idioma === "pt") {
    return <span>R$ {valorDecimal.replace(".", ",")}</span>;
  } else {
    return <span>$ {valorDecimal}</span>;
  }
}
```

Nesta nova solução, primeiro definimos `idiomaContext`.
No componente `ExemploContext`, usamos `<idiomaContext.Provider value={idioma}>` para definir o valor do idioma de acordo com o valor do estado do componente.
Como `Componente1` está envolvido no Provider, ele e seus descendentes terão acesso ao valor.
Agora não precisamos mais passar `idioma` via props para `Componente1`, `Componente2`, `Componente3` e `ValorMonetario`, deixando o código mais limpo.
Finalmente, no componente `ValorMonetario`, usamos `useContext(idiomaContext)` para obter o idioma.
