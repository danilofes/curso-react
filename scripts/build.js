const fs = require("fs");
const shiki = require("shiki");
const markdown = require("markdown-it");
const markdownContainer = require("markdown-it-container");

const customElements = {
  pre({ className, style, children }) {
    return `<pre class="${className}" style="padding: 1em; font-size: inherit; overflow-x:auto; ${style}">${children}</pre>`;
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
      return shiki.renderToHtml(tokens, { bg: "#1e1e1e", fg: "#f0f0f0", elements: customElements });
    },
  });

  md.use(markdownContainer, "info", {
    render: function (tokens, idx) {
      if (tokens[idx].nesting === 1) {
        // opening tag
        return '<div style="background-color: #bde8fc; padding: 1em 1em 1px 1em; border-left: 4px solid #6dd0ff; margin: 1em 0">\n';
      } else {
        // closing tag
        return "</div>\n";
      }
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
