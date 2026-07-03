// Funções que conversam com a API do back-end (.NET).
import type { Pessoa, Transacao, ConsultaTotais, TipoTransacao } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5149";

// Faz a requisição e, se a API responder com erro, lança a mensagem recebida.
async function pedir(caminho: string, opcoes?: RequestInit) {
  const resposta = await fetch(API_URL + caminho, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });

  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => null);
    throw new Error(corpo?.mensagem ?? "Erro ao comunicar com o servidor.");
  }

  if (resposta.status === 204) return null;
  return resposta.json();
}

export function listarPessoas(): Promise<Pessoa[]> {
  return pedir("/api/pessoas");
}

export function criarPessoa(nome: string, idade: number): Promise<Pessoa> {
  return pedir("/api/pessoas", { method: "POST", body: JSON.stringify({ nome, idade }) });
}

export function excluirPessoa(id: number): Promise<null> {
  return pedir(`/api/pessoas/${id}`, { method: "DELETE" });
}

export function listarTransacoes(): Promise<Transacao[]> {
  return pedir("/api/transacoes");
}

export function criarTransacao(dados: {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: number;
}): Promise<Transacao> {
  return pedir("/api/transacoes", { method: "POST", body: JSON.stringify(dados) });
}

export function obterTotais(): Promise<ConsultaTotais> {
  return pedir("/api/totais");
}
