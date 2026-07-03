import { apiClient } from "./client";
import type { ConsultaTotais } from "../types";

export const totaisApi = {
  obter: () => apiClient.get<ConsultaTotais>("/api/totais"),
};
