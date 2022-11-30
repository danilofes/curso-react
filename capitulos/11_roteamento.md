Aplicações React tipicamente consistem em um único documento HTML e toda a interface é construída via JavaScript.
Neste tipo de arquitetura, que é conhecida com SPA (Single Page Application), é essencial que utilizemos roteamento do lado do cliente para representar diferentes telas como diferentes URLs.
Caso contrário, a experiência de usuário ficaria comprometida, pois mudanças de tela não ficariam representadas no histórico do navegador e as ações de voltar/avançar não funcionariam.
O React não oferece funcionalidades relacionadas ao roteamento do lado do cliente, mas existem bibliotecas de terceiros que nos auxiliam nessa tarefa.
A mais popular delas é [React Router](https://reactrouter.com/), que vamos estudar nesta seção.

### Adicionando React Router no projeto

O projeto criado via `create-react-app` é um projeto Node.js.
Sendo assim, a gestão de dependências do projeto, seja o React Router ou qualquer outra biblioteca adicional, pode ser feita via `npm`.
Para adicionar a dependência para o projeto, execute em um terminal, no diretório do projeto:

```
npm install react-router-dom
```

Este comando instalará a versão mais recente.
Se preferir instalar a versão exata utilizada no curso, mude o comando para:

```
npm install react-router-dom@6.4
```

Após a execução deste comando, o pacote será adicionado como dependência no arquivo `package.json` do projeto e instalado no diretório `node_modules`.
A partir daí, já poderemos importá-lo e utilizá-lo no código-fonte.

:::info
**Nota:**
O projeto base fornecido no curso já vem com React Router instalado, portanto você pode pular a instalação deste pacote.
:::

### Configurando o Router
