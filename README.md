# Controle de Gastos Residenciais

Cadastro de pessoas, cadastro de transações (receitas/despesas) e consulta dos totais.

- **Back-end:** .NET 8 + Entity Framework Core + SQLite
- **Front-end:** React + TypeScript (Vite)

Os dados ficam salvos no arquivo `controlegastos.db` e continuam após fechar o app.

## Como rodar

Precisa do [.NET 8 SDK](https://dotnet.microsoft.com/download) e do [Node.js](https://nodejs.org).

**Windows:** rode `.\iniciar.bat` — abre o backend e o frontend, cada um em seu terminal.

**Ou manualmente, em dois terminais:**

```bash
# terminal 1
cd backend/src/ControleGastos.Api
dotnet run
```

```bash
# terminal 2
cd frontend
npm install
npm run dev
```

Depois abra **http://localhost:5173**.

## Regras

- Cada pessoa e transação tem um **número** (id) único, gerado automaticamente.
- **Pessoas:** criar, listar e excluir (ao excluir, as transações da pessoa também somem).
- **Transações:** criar e listar. Menor de 18 anos só pode ter despesa.
- **Totais:** receitas, despesas e saldo de cada pessoa + o total geral.
