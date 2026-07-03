namespace ControleGastos.Api.Dtos;

// Totais de uma pessoa.
public class TotalPorPessoaDto
{
    public int PessoaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal Saldo { get; set; } // receitas - despesas
}

// Resposta da consulta: totais de cada pessoa + o total geral.
public class ConsultaTotaisResponseDto
{
    public List<TotalPorPessoaDto> Pessoas { get; set; } = new();
    public decimal TotalReceitasGeral { get; set; }
    public decimal TotalDespesasGeral { get; set; }
    public decimal SaldoGeral { get; set; }
}
