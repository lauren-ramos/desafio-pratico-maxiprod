// Tipos que espelham os DTOs expostos pela API .NET (backend/src/ControleGastos.Api/Dtos).

export type TipoTransacao = "Receita" | "Despesa";

export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: string;
  pessoaNome: string;
}

export interface TotalPorPessoa {
  pessoaId: string;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface ConsultaTotais {
  pessoas: TotalPorPessoa[];
  totalReceitasGeral: number;
  totalDespesasGeral: number;
  saldoGeral: number;
}
