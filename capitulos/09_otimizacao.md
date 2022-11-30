Vimos que o uma das principais vantagens de utilizar React é que ele cuida da atualização dos elementos do DOM, enquanto nós precisamos apenas descrever como a interface deve ser.
De fato, o React renderiza os componentes sempre que houver mudanças de estado e, por padrão, todos os componentes descendentes são renderizados novamente.
Normalmente, isso não é um problema, pois o algoritmo de comparação do virtual DOM é bastante rápido.
No entanto, em determinadas situações, pode ser necessário evitar renderizações desnecessárias ou a execução de cálculos pesados em cada renderização para melhorar a performance da aplicação.
Nesta seção veremos algumas formar de fazer isso.

### A função `memo`

A função `memo` recebe como parâmetro um componente e retorna um componente otimizado, que só renderiza quando seu `props` é alterado.
Com isso, é possível evitar que toda uma subárvore de componentes deixe de ser renderizada ao alterar o estado do componente pai, obtendo ganhos de desempenho.
Para entender melhor, considere o exemplo abaixo.

```tsx
export default function Raiz() {
  console.log("Renderizou Raiz");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  return (
    <div>
      X={x}, Y={y}
      <button onClick={() => setX(x + 1)}>Incrementa X</button>
      <button onClick={() => setY(y + 1)}>Incrementa Y</button>
      <C_1 x={x} />
    </div>
  );
}

function C_1(props: { x: number }) {
  console.log("Renderizou C_1");
  return (
    <div>
      <C_1_1 />
      <C_1_2 />
    </div>
  );
}

function C_1_1() {
  console.log("Renderizou C_1_1");
  return <div>C_1_1</div>;
}

function C_1_2() {
  console.log("Renderizou C_1_2");
  return <div>C_1_2</div>;
}
```

Nesta aplicação, o componente `Raiz` possui dois contadores: `x` e `y`.
Quando a aplicação é renderizada pela primeira vez, temos a saída no console:

```
Renderizou Raiz
Renderizou C_1
Renderizou C_1_1
Renderizou C_1_2
```

Quando incrementamos o contador `x` ou `y`, uma nova renderização do componente `Raiz` é disparada e, consequentemente, dos seus descendentes.
Portanto, mais uma vez temos a saída no console:

```
Renderizou Raiz
Renderizou C_1
Renderizou C_1_1
Renderizou C_1_2
```

Vamos agora utilizar `memo` para criar uma versão otimizada de `C_1`:

```tsx
export default function Raiz() {
  console.log("Renderizou Raiz");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  return (
    <div>
      X={x}, Y={y}
      <button onClick={() => setX(x + 1)}>Incrementa X</button>
      <button onClick={() => setY(y + 1)}>Incrementa Y</button>
      <C_1_MEMO x={x} /> {/* Trocamos C_1 por C_1_MEMO. */}
    </div>
  );
}

const C_1_MEMO = memo(C_1);

// O restante do código é o mesmo...
```

Quando a aplicação é renderizada pela primeira vez o comportamento é o mesmo.
Mas quando incrementamos o contador `y`, agora teremos no console:

```
Renderizou Raiz
```

Ou seja, `C_1` e toda a subárvore de componentes abaixo dele não são mais renderizados quando `y` muda, pois tal valor não é passado como `props` para `C_1_MEMO`.
No entanto, se `x` mudar, `C_1` e seus descendentes serão renderizados, visto que `props` mudou.

:::info
**Nota:**
A comparação de mudanças nos `props` é feita de maneira rasa, ou seja, cada propriedade do objeto `props` é comparado com o valor anterior usando o operador `===`.
Isto significa que valores que são objetos ou _arrays_ serão comparados por referência.
:::

### O hook `useMemo`

O hook `useMemo` pode ser usado para computar um valor apenas quando um conjunto de dependências sofrer alguma alteração de uma renderização para a outra.
Ou seja, ele tem comportamento semelhante ao `useEffect`, mas a função passada, em vez de executar um efeito, computa um valor.
Considere o exemplo a seguir:

```tsx
export default function Raiz() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const raizDeX = Math.sqrt(x);

  return (
    <div>
      X={x}, Y={y}, Raiz de X={raizDeX}
      <br />
      <button onClick={() => setX(x + 1)}>Incrementa X</button>
      <button onClick={() => setY(y + 1)}>Incrementa Y</button>
    </div>
  );
}
```

Este componente possui dois estados: `x` e `y`. Além disso, o componente computa o valor `raizDeX`, que é derivado de `x`.
Isso funciona perfeitamente, mas devemos ter ciência que `raizDeX` será computada em toda renderização, mesmo quando `x` não mudar.
Se quisermos evitar isso, podemos envolver o cálculo em um `useMemo` e passar `x` como dependência:

```tsx
const raizDeX = useMemo(() => {
  console.log("Calculou a raiz de X");
  return Math.sqrt(x);
}, [x]);
```

Nesta nova forma, o cálculo só será feito quando `x` mudar.
Podemos verificar isso pela mensagem impressa no console.

No exemplo acima, calcular `raizDeX` é uma operação bastante rápida e portanto o impacto desta otimização é provavelmente irrelevante.
No entanto, pode fazer sentido aplicar `useMemo` para uma computação custosa, especialmente se o estado do componente muda com frequência por motivos não relacionados à computação em questão.

### Objetos estáveis com `useMemo`

Um segundo motivo forte para usar `useMemo` é quando computamos um objeto (ou _array_) derivado de outras informações.
Digamos que exista uma computação:

```tsx
const [x, setX] = useState(0);
const [y, setY] = useState(0);
const coords = [x, y];
```

Se `coords` é computada em toda renderização, ela sempre será um _array_ diferente, mesmo que `x` e `y` não tenha mudado.
Isso pode ser um problema se `coords` for passado via `props` para um componente otimizado com `memo`, pois o componente sempre será renderizado.
De forma semelhante, teremos problemas se `coords` for usado como dependência de um efeito.
Para evitar estes problemas, poderíamos computar `coords` como:

```tsx
const coords = useMemo(() => [x, y], [x, y]);
```

#### Funções estáveis com `useCallback`

Uma situação semelhante à descrita anteriormente ocorre com funções.
Muitas vezes definimos um função callback dentro de um componente que será repassada via `props` para componentes filhos.
Para evitar que em toda renderização ela seja uma função diferente, podemos usar `useCallback` da seguinte forma.

```tsx
function MeuComponente() {
  const [x, setX] = useState(0);

  const incrementX = useCallback(() => {
    setX(x + 1);
  }, [x]);

  return (
    <div>
      <ComponenteHipotetico onIncrement={incrementX} />
    </div>
  );
}
```

Observe que `useCallback` recebe como parâmetros uma função e um _array_ de dependências.
Neste caso, passamos `x` como dependência pois lemos o valor de `x` dentro da função.
Note que a função `setX`, em tese, também deveria ser uma dependência pois ela é usada dentro do _callback_.
No entanto, a função retornada por `useState` é sempre a mesma em toda renderização, por isso é seguro ignorá-la.
