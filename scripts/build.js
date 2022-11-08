const fs = require("fs");
const shiki = require("shiki");
const markdown = require("markdown-it");

const customElements = {
  pre({ className, style, children }) {
    return `<pre class="${className}" style="padding: 1em; font-size: inherit; ${style}">${children}</pre>`;
  },
};

const template = {
  start: `
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <title>Teste Markdown</title>
  <link rel="stylesheet" href="estilos.css">
</head>
<body>
<main>
  `,
  end: `
</main>
</body>
</html>`,
};

const baseDir = "capitulos/";

async function run() {
  const shikiHl = await shiki.getHighlighter({ theme: "dark-plus" });

  const md = markdown({
    html: true,
    highlight: (code, lang) => {
      const tokens = shikiHl.codeToThemedTokens(code, lang);
      return shiki.renderToHtml(tokens, { bg: "#1e1e1e", elements: customElements });
    },
  });

  fs.writeFileSync("index.html", template.start);

  const files = fs.readdirSync(baseDir);
  for (const file of files) {
    console.log(`Generationg HTML for ${file}`);
    const input = fs.readFileSync(baseDir + file, "utf-8");
    const output = "\n" + md.render(input) + "\n";
    fs.appendFileSync("index.html", output);
  }

  fs.appendFileSync("index.html", template.end);
  console.log("Done");
}

run();
