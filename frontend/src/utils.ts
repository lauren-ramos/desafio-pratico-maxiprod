// Formata um número como dinheiro em reais (ex.: 1200 -> "R$ 1.200,00").
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Pega as iniciais de um nome para mostrar no avatar (ex.: "Maria Silva" -> "MS").
export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? "?";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}
