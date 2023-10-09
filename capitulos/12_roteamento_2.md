Neste capítulo vamos construir uma aplicação completa no estilo CRUD usando todos os recursos do React Router em conjunto.

<iframe src="https://cralmg-contatos.stackblitz.io" style="border:4px solid #ddd; width:100%; height:300px; margin: 1rem 0"></iframe>

:::fullcode index.css

```css
body {
  margin: 0;
  padding: 1rem;
  font-family: sans-serif;
}

button,
select {
  font-family: inherit;
  font-size: inherit;
}

.app {
  display: flex;
  max-width: 600px;
  margin: auto;
  border: 1px solid grey;
  border-radius: 1em;
}

.error {
  margin: 1em 0;
  color: red;
}

.inline {
  display: inline;
}

.app label {
  display: block;
}

.app h2 {
  margin: 0;
}

nav,
main {
  padding: 1em;
}

nav {
  border-right: 1px solid grey;
  min-width: 200px;
}

.toolbar {
  margin-top: 1em;
}

.toolbar > * {
  margin-right: 1em;
}
```

:::
