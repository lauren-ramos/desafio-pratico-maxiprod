# Controle de Gastos Residenciais

Sistema simples para cadastro de pessoas, cadastro de transacoes financeiras e consulta de totais por pessoa e total geral.

Projeto desenvolvido como desafio pratico para vaga de estagio.

## Tecnologias utilizadas

- Back-end: .NET 8, ASP.NET Core, Entity Framework Core e SQLite
- Front-end: React, TypeScript e Vite
- Banco de dados: SQLite

## Funcionalidades

- Cadastro de pessoas
- Listagem de pessoas
- Exclusao de pessoas
- Cadastro de transacoes
- Listagem de transacoes
- Consulta de totais por pessoa
- Consulta do total geral

## Regras do sistema

- Cada pessoa possui um identificador unico gerado automaticamente.
- Cada transacao possui um identificador unico gerado automaticamente.
- Uma pessoa menor de 18 anos pode ter apenas transacoes do tipo despesa.
- Ao excluir uma pessoa, suas transacoes tambem sao excluidas.
- O sistema calcula receitas, despesas e saldo.

## Como baixar o projeto

A pessoa que for avaliar pode clonar o repositorio:

```bash
git clone URL_DO_REPOSITORIO
cd desafio-pratico-maxiprod
```

Substitua `URL_DO_REPOSITORIO` pela URL do repositorio no GitHub.

Tambem e possivel abrir pelo GitHub Codespaces, desde que o ambiente tenha .NET 8 e Node.js disponiveis.

## Requisitos para rodar localmente

Instale:

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/)

## Como rodar no Windows

Na raiz do projeto, execute:

```bash
.\iniciar.bat
```

Esse arquivo abre dois terminais:

- um para o backend
- outro para o frontend

Depois acesse:

```txt
http://localhost:5173
```

## Como rodar manualmente

Abra dois terminais.

No primeiro terminal, rode o backend:

```bash
cd backend/src/ControleGastos.Api
dotnet run
```

Por padrao, a API roda em:

```txt
http://localhost:5149
```

No segundo terminal, rode o frontend:

```bash
cd frontend
npm install
npm run dev
```

Depois acesse:

```txt
http://localhost:5173
```

## Banco de dados

O projeto usa SQLite.

Ao iniciar o backend, o Entity Framework cria/atualiza o banco automaticamente usando as migrations do projeto.

O arquivo do banco e gerado localmente como:

```txt
controlegastos.db
```

## Endereco da API

Durante o desenvolvimento local, o frontend ja esta configurado para acessar a API em:

```txt
http://localhost:5149
```

Por isso, nao e necessario criar arquivo `.env` nem informar chave de API para rodar o projeto localmente.

## Estrutura do projeto

```txt
desafio-pratico-maxiprod/
  backend/
    src/ControleGastos.Api/
  frontend/
    src/
  iniciar.bat
```
