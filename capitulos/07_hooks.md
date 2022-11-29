_Hooks_ são funções especiais do React que adicionam comportamentos diversos aos nossos componentes.
Este recurso surgiu a partir da versão 16.8 do React e revolucionou o desenvolvimento de componentes, que antes precisavam ser definidos por meio de classes na maioria dos casos.
Nos capítulos anteriores já usamos os _hooks_ `useState` e `useEffect`, mas ainda não vimos em detalhes como eles funcionam.
Nesta seção aprenderemos alguns cuidados que devemos tomar ao utilizar _hooks_ e também como definir nossos próprios _hooks_.

### As regras dos _hooks_

Para que os _hooks_ funcionem corretamente, devemos respeitar duas regras fundamentais:

1. _Hooks_ só podem ser chamados dentro de componentes React ou outros _hooks_.
2. _Hooks_ NÃO podem ser chamados dentro de condicional ou repetição.

Para deixar mais claro, vejamos alguns exemplos de chamadas inválidas:

```tsx
function ComponenteFicticio(props: any) {
  if (props.prop1) {
    const [estado1, setEstado1] = useState(0); // ERRADO: não pode chamar hook dentro de condicionais.
  }

  for (const item of props.prop2) {
    const [estado2, setEstado2] = useState(0); // ERRADO: não pode chamar hook dentro de repetições.
  }

  return <div>Este é um componente React</div>;
}

function funcaoComum(props): string {
  const [estado1, setEstado1] = useState(0); // ERRADO: só pode chamar hook dentro de componente.

  return "Esta é uma função comum, não um componente";
}
```

O motivo destas regras tem a ver com a forma como os _hooks_ funcionam internamente.
O _hooks_ precisam de informações que persistem entre diferentes renderizações do mesmo componente.
O React armazena estes dados na instância do componente em uma estrutura indexada pela ordem das chamadas.
Portanto, toda renderização do componente deve chamar os mesmo _hooks_ na mesma ordem.

### Definindo seus próprios hooks

Além de usar os _hooks_ oferecidos pelo React, podemos definir nossos próprios _hooks_.
Para isso, basta definirmos uma função seguindo a nomenclatura `useXXX`, onde `XXX` é um identificador qualquer.
Para diferenciá-los dos _hooks_ nativos do React, vamos chamá-los de _hooks_ customizados.
_Hooks_ customizados podem chamar outros _hooks_, o que nos permite extrair lógica dos componentes e reutilizar onde for necessário.
Contudo, devemos continuar seguindo as mesmas regras de _hooks_ que usamos em componentes, ou seja: não chamar _hooks_ dentro de loops ou comandos condicionais.

Vamos resgatar o componente `DigitalClock` que vimos anteriormente.
Seu código-fonte originalmente era.

```tsx
export default function DigitalClock() {
  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    // Atualiza a hora a cada 1s.
    const intervalId = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

    // Devemos chamar clearInterval no código de limpeza para desfazer o setInterval.
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return <span>{time}</span>;
}
```

Vamos tentar simplificar o componente extraindo um _hook_ customizado para encapsular toda a lógica de configurar o setInterval, obter a hora e atualizar o estado.
Chamaremos esse _hook_ de `useCurrentTime`.
O novo código-fonte ficaria assim:

```tsx
export default function DigitalClock() {
  const time = useCurrentTime();

  return <span>{time}</span>;
}

function useCurrentTime(): string {
  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return time;
}
```

Note que agora o componente ficou muito simples, pois toda a complexidade foi encapsulada no _hook_ `useCurrentTime`.
Do ponto de vista do componente, só interessa que o _hook_ retorne o valor da hora, sem se preocupar com os detalhes de implementação.
Outra vantagem é que `useCurrentTime` poderia ser reutilizado em outros componentes.

### Definindo hooks com parâmetros

Se desejarmos, podemos extrair mais um _hook_, encapsulando a lógica de configurar o temporizador.
Vamos definir o _hook_ `useInterval`, que recebe como parâmetro um intervalo de tempo (em ms) e uma função a ser chamada neste intervalo.
Por ser parametrizado, `useInterval` tem ainda mais potencial de reuso do que `useCurrentTime`.
O novo código-fonte ficaria assim:

```tsx
export default function DigitalClock() {
  const time = useCurrentTime();
  return <span>{time}</span>;
}

function useCurrentTime(): string {
  const [time, setTime] = useState(getCurrentTime());

  useInterval(1000, () => {
    setTime(getCurrentTime());
  });

  return time;
}

function useInterval(time: number, fn: () => void) {
  useEffect(() => {
    const intervalId = setInterval(fn, time);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
}
```

Note que o _hook_ `useInterval` é usado dentro do hook `useCurrentTime`, que por sua vez é usado no componente `DigitalClock`.
Isto é permitido.
Na prática, as chamadas a `useState` e `useEffect`, ainda que sejam feitas indiretamente, estarão associadas à instância do componente `DigitalClock`.
As regras dos _hooks_ garantem que elas sejam chamadas sempre na mesma ordem.
