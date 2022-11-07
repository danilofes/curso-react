const fs = require("fs");
const shiki = require("shiki");
const markdown = require("markdown-it");

async function run() {
  const shikiHl = await shiki.getHighlighter({ theme: "dark-plus" });

  const md = markdown({
    html: true,
    highlight: (code, lang) => shikiHl.codeToHtml(code, { lang }),
  });

  const input = fs.readFileSync("capitulos/c01_introducao.md", "utf-8");
  const output = md.render(input);
  const out = `
  <html>
    <head>
      <title>Shiki</title>
      <style>
        .shiki {
          padding: 1em;
        }
      </style>
    </head>
    <body>
      ${output}
    </body>
  </html>
`;
  fs.writeFileSync("index.html", out);

  console.log("done");
}

run();
