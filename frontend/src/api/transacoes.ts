import { apiClient } from "./client";
import type { Transacao, TipoTransacao } from "../types";

export interface NovaTransacao {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: string;
}

export const transacoesApi = {
  listar: () => apiClient.get<Transacao[]>("/api/transacoes"),
  criar: (dados: NovaTransacao) => apiClient.post<Transacao>("/api/transacoes", dados),
};
