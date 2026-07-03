import { apiClient } from "./client";
import type { Pessoa } from "../types";

export interface NovaPessoa {
  nome: string;
  idade: number;
}

export const pessoasApi = {
  listar: () => apiClient.get<Pessoa[]>("/api/pessoas"),
  criar: (dados: NovaPessoa) => apiClient.post<Pessoa>("/api/pessoas", dados),
  deletar: (id: string) => apiClient.delete(`/api/pessoas/${id}`),
};
