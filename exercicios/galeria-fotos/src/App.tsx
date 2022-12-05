import Galeria from "./Galeria";

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

export default App;
