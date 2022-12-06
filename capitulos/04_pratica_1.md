Crie uma aplicação React contendo o componente `Galeria`.
Tal componente exibe um galeria de fotos e deve receber como `props`:

- `titulo`, que é um título a ser exibido no topo do componente, do tipo `string`;
- `fotos`, que é um _array_ de `string`, correspondente às URLs das fotos a serem exibidas na galeria.

No componente principal da aplicação, você deve usar o componente `Galeria` para testá-lo, por exemplo:

```tsx
function App() {
  return (
    <div>
      <Galeria
        titulo="Fotos de animais"
        fotos={[
          "https://danilofes-curso-react.netlify.app/fotos/foto1.jpg",
          "https://danilofes-curso-react.netlify.app/fotos/foto2.jpg",
          "https://danilofes-curso-react.netlify.app/fotos/foto3.jpg",
          "https://danilofes-curso-react.netlify.app/fotos/foto4.jpg",
          "https://danilofes-curso-react.netlify.app/fotos/foto5.jpg",
        ]}
      />

      <Galeria titulo="Fotos de pessoas" fotos={[]} />
    </div>
  );
}
```

Abaixo temos uma demonstração da aplicação em funcionamento, supondo que usamos duas vezes o componente `Galeria`, conforme código acima.

<iframe src="https://cralmg-galeria-fotos.stackblitz.io" style="border:4px solid #ddd; width:100%; height:500px"></iframe>

É importante implementar os seguintes comportamentos:

- `Galeria` exibe uma foto por vez, e contém botões de navegação para: (i) mostrar a primeira foto, (ii) mostrar a foto anterior, (iii) mostrar a próxima foto e (iv) mostrar a última foto.

- Os botões de mostrar a primeira foto e mostrar a foto anterior devem ficar desabilitados quando a foto atual já é a primeira.
  Da mesma forma, os botões de mostrar a próxima foto e mostrar a última foto devem ficar desabilitados quando estiver na última foto.

- Se a propriedade `fotos` for um _array_ vazio, é exibida a mensagem “Nenhuma foto”.
