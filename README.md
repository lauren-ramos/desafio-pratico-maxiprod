# Controle de Gastos Residenciais

Sistema para controle de gastos de um domicílio: cadastro de pessoas, cadastro de
transações (receitas/despesas) e consulta de totais por pessoa e geral.

## Tecnologias

- **Back-end:** .NET 8 / ASP.NET Core Web API + Entity Framework Core + SQLite
- **Front-end:** React 19 + TypeScript + Vite + [lucide-react](https://lucide.dev) (ícones)

A interface tem paleta de cores por tipo (receita em verde, despesa em vermelho, primária
em violeta), ícones, avatares com iniciais e micro-animações (entrada de telas/linhas,
hover nos botões e cartões, ícone de "atualizar" girando durante o carregamento). As
animações respeitam `prefers-reduced-motion`.

## Persistência

Os dados são gravados em um arquivo SQLite (`backend/src/ControleGastos.Api/controlegastos.db`),
criado e migrado automaticamente na primeira execução da API. Os dados permanecem
disponíveis mesmo depois de fechar e reabrir a aplicação.

## Estrutura do projeto

```
backend/
  src/ControleGastos.Api/
    Models/         Entidades de domínio (Pessoa, Transacao, TipoTransacao)
    Data/           DbContext do Entity Framework Core
    Dtos/           Objetos de entrada/saída da API
    Controllers/    Endpoints (Pessoas, Transacoes, Totais)
    Migrations/      Migrations do EF Core (geram o schema do SQLite)
frontend/
  src/
    types/          Tipos TypeScript espelhando os DTOs da API
    api/            Cliente HTTP para consumir a API
    components/     Telas: Cadastro de Pessoas, Cadastro de Transações, Consulta de Totais
```

## Como executar

### Back-end (porta 5149)

```bash
cd backend/src/ControleGastos.Api
dotnet run
```

A API sobe em `http://localhost:5149` e o Swagger fica disponível em
`http://localhost:5149/swagger` (ambiente de desenvolvimento).

### Front-end (porta 5173)

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`. Por padrão o front aponta para a API em
`http://localhost:5149` (ver `frontend/.env.example` para customizar via `VITE_API_URL`).

## Regras de negócio implementadas

- **Pessoas:** criação, listagem e exclusão. Identificador (`Guid`) sempre gerado
  pelo servidor. Ao excluir uma pessoa, todas as suas transações são apagadas em
  cascata (constraint `ON DELETE CASCADE` no banco).
- **Transações:** criação e listagem apenas (sem edição/exclusão, conforme especificação).
  A pessoa informada precisa existir. Pessoas menores de 18 anos só podem ter
  **despesas** cadastradas — receitas são rejeitadas pela API (HTTP 400) e a opção
  também fica desabilitada no formulário do front-end.
- **Totais:** para cada pessoa, soma de receitas, soma de despesas e saldo
  (receitas − despesas); ao final, o total geral do domicílio.

## Endpoints da API

| Método | Rota                | Descrição                                   |
|--------|---------------------|----------------------------------------------|
| GET    | `/api/pessoas`      | Lista todas as pessoas                        |
| POST   | `/api/pessoas`      | Cadastra uma pessoa (`nome`, `idade`)         |
| DELETE | `/api/pessoas/{id}` | Remove uma pessoa e suas transações           |
| GET    | `/api/transacoes`   | Lista todas as transações                     |
| POST   | `/api/transacoes`   | Cadastra uma transação (`descricao`, `valor`, `tipo`, `pessoaId`) |
| GET    | `/api/totais`       | Totais por pessoa + total geral               |
